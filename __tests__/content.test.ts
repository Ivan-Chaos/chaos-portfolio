import { describe, expect, it } from "vitest";
import { capabilities } from "@/content/capabilities";
import { credentials } from "@/content/education";
import { engagements } from "@/content/engagements";
import { practiceFacts, practiceParagraphs } from "@/content/practice";
import {
  contactMethods,
  email,
  gitHubUrl,
  linkedInUrl,
} from "@/content/profile";
import { readings } from "@/content/readings";
import { roles } from "@/content/roles";
import type { Range } from "@/content/schema";

/**
 * Invariants for the content layer, checked without rendering anything.
 *
 * These are the failures that would otherwise reach the page silently: a
 * duplicated id quietly dropping a React child, a range typed backwards, two
 * roles marked current so the timeline lights two markers, a figure that stops
 * being a string and picks up a locale-formatted thousands separator.
 */

/** `YYYY-MM` sorts lexicographically, which is the whole reason for the format. */
const ISO_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function checkRange(range: Range) {
  expect(range.start).toMatch(ISO_MONTH);
  expect(range.startLabel.length).toBeGreaterThan(0);
  expect(range.endLabel.length).toBeGreaterThan(0);

  if (range.end === null) {
    // An open range has to read as open. "Dec 2024 — Dec 2024" for a job
    // someone still holds is the failure this catches.
    expect(range.endLabel).toBe("Present");
    return;
  }

  expect(range.end).toMatch(ISO_MONTH);
  expect(range.end >= range.start).toBe(true);
}

function expectUniqueIds(items: readonly { id: string }[]) {
  const ids = items.map((item) => item.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) {
    // Ids reach the DOM as element ids and React keys, so they have to be
    // URL-safe and lowercase.
    expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  }
}

describe("readings", () => {
  it("has four, with unique ids", () => {
    expect(readings).toHaveLength(4);
    expectUniqueIds(readings);
  });

  it("keeps every value a plain string with a leading digit run", () => {
    for (const reading of readings) {
      expect(typeof reading.value).toBe("string");
      // No thousands separators, no spaces: the count-up animates the leading
      // digits and renders the rest verbatim, and a "," or a narrow no-break
      // space would make that parse wrong.
      expect(reading.value).toMatch(/^\d+[A-Za-z+%]*$/);
    }
  });

  it("gives every reading a hint saying where the figure came from", () => {
    for (const reading of readings) {
      expect(reading.hint.length).toBeGreaterThan(10);
      expect(reading.hint.endsWith(".")).toBe(true);
    }
  });
});

describe("roles", () => {
  it("has unique ids and valid ranges", () => {
    expectUniqueIds(roles);
    for (const role of roles) checkRange(role.range);
  });

  it("is ordered newest first", () => {
    const starts = roles.map((role) => role.range.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it("marks exactly one role current, and it is the first", () => {
    const current = roles.filter((role) => role.current);
    expect(current).toHaveLength(1);
    expect(current[0]).toBe(roles[0]);
    expect(current[0].range.end).toBeNull();
  });

  it("gives every role highlights", () => {
    for (const role of roles) {
      expect(role.highlights.length).toBeGreaterThan(0);
    }
  });
});

describe("engagements", () => {
  it("has unique ids, valid ranges and a stack", () => {
    expectUniqueIds(engagements);
    for (const engagement of engagements) {
      checkRange(engagement.range);
      expect(engagement.stack.length).toBeGreaterThan(0);
      expect(engagement.highlights.length).toBeGreaterThan(0);
    }
  });

  it("keeps an even count, because the grid is two-up and never three", () => {
    expect(engagements.length % 2).toBe(0);
  });

  it("sits inside the span of the roles that contained it", () => {
    // Every engagement was delivered inside a role. If one starts before the
    // earliest role or ends after the latest, either a date is wrong or the
    // engagement does not belong to this history.
    const earliest = roles.at(-1)!.range.start;
    for (const engagement of engagements) {
      expect(engagement.range.start >= earliest).toBe(true);
    }
  });
});

describe("credentials", () => {
  it("has unique ids and valid ranges", () => {
    expectUniqueIds(credentials);
    for (const credential of credentials) checkRange(credential.range);
  });

  it("is ordered newest first", () => {
    const starts = credentials.map((credential) => credential.range.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });
});

describe("capabilities", () => {
  it("has unique ids and no empty group", () => {
    expectUniqueIds(capabilities);
    for (const capability of capabilities) {
      expect(capability.items.length).toBeGreaterThan(0);
    }
  });

  it("lists no capability twice within a group", () => {
    for (const capability of capabilities) {
      expect(new Set(capability.items).size).toBe(capability.items.length);
    }
  });
});

describe("profile", () => {
  it("has well-formed contact details", () => {
    expect(email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    expect(linkedInUrl).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[\w-]+$/);
    expect(gitHubUrl).toMatch(/^https:\/\/github\.com\/[\w-]+$/);
  });

  it("offers unique contact methods, and email is first", () => {
    expectUniqueIds(contactMethods);
    expect(contactMethods[0].href).toBe(`mailto:${email}`);
  });

  it("links every contact method that is a link over https or mailto", () => {
    for (const method of contactMethods) {
      if (method.href === undefined) continue;
      expect(method.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});

describe("practice", () => {
  it("has prose and facts", () => {
    expect(practiceParagraphs.length).toBeGreaterThan(1);
    expect(practiceFacts.length).toBeGreaterThan(0);
    for (const fact of practiceFacts) {
      expect(fact.term.length).toBeGreaterThan(0);
      expect(fact.definition.length).toBeGreaterThan(0);
    }
  });
});
