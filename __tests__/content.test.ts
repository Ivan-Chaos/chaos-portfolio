import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { capabilities } from "@/content/capabilities";
import {
  dispatches,
  LATEST_DISPATCH_COUNT,
  newsStandfirst,
} from "@/content/dispatches";
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

/** `YYYY-MM-DD`, and it sorts for the same reason. A dispatch happens on a day. */
const ISO_DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** Ids and slugs both reach the DOM, so both have to be URL-safe and lowercase. */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Resolved from this file rather than `process.cwd()`, so the suite does not
 * depend on where Vitest was started from.
 *
 * `fileURLToPath` is handed the raw string, not `new URL(...)`. Under the
 * jsdom environment the global `URL` is jsdom's own implementation, and Node's
 * `fileURLToPath` rejects one of those with "The URL must be of scheme file"
 * even when the protocol plainly is `file:`.
 */
const CONTENT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "content",
);
const DISPATCH_DIR = path.join(CONTENT_DIR, "dispatches");
const PUBLIC_DIR = path.join(CONTENT_DIR, "..", "public");

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

describe("dispatches", () => {
  it("has unique slugs shaped like ids", () => {
    const slugs = dispatches.map((dispatch) => dispatch.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG);
  });

  it("is ordered newest first", () => {
    const published = dispatches.map((dispatch) => dispatch.published);
    expect([...published].sort().reverse()).toEqual(published);
  });

  it("dates every dispatch, with a hand-written label", () => {
    for (const dispatch of dispatches) {
      expect(dispatch.published).toMatch(ISO_DAY);
      // Written out, not formatted: `Intl` renders month names differently per
      // runtime, and nothing on this site is derived from the clock.
      expect(dispatch.publishedLabel.length).toBeGreaterThan(0);
      expect(dispatch.publishedLabel).not.toMatch(ISO_DAY);
    }
  });

  it("gives every dispatch a title, a standfirst and a topic", () => {
    for (const dispatch of dispatches) {
      expect(dispatch.title.length).toBeGreaterThan(0);
      expect(dispatch.standfirst.length).toBeGreaterThan(40);
      expect(dispatch.topics.length).toBeGreaterThan(0);
      expect(new Set(dispatch.topics).size).toBe(dispatch.topics.length);
    }
  });

  it("describes every cover it has", () => {
    for (const { cover } of dispatches) {
      if (!cover) continue;
      // A cover with an empty alt is decoration, and decoration does not get to
      // be the LCP element of an article. The dimensions are what `next/image`
      // needs to reserve the space before the file arrives.
      expect(cover.alt.length).toBeGreaterThan(0);
      expect(cover.src.startsWith("/")).toBe(true);
      expect(cover.width).toBeGreaterThan(0);
      expect(cover.height).toBeGreaterThan(0);
    }
  });

  it("has at least as many as the home page band shows", () => {
    // The band slices three. Fewer would render a short band nobody looked at,
    // which is how a page ends up with a hole in it — and there is no empty
    // state anywhere in this content layer.
    expect(dispatches.length).toBeGreaterThanOrEqual(LATEST_DISPATCH_COUNT);
  });

  it("has a standfirst for the index page", () => {
    expect(newsStandfirst.length).toBeGreaterThan(40);
  });
});

describe("dispatch bodies", () => {
  /**
   * The drift guard for docs/adr/0008. Metadata lives in
   * `content/dispatches.ts` and the body is an `.mdx` beside it, so the two can
   * disagree — and neither Vitest nor Storybook compiles MDX, so nothing else
   * in `pnpm check` would notice.
   */
  const files = readdirSync(DISPATCH_DIR).filter((name) =>
    name.endsWith(".mdx"),
  );

  it("has exactly one body per dispatch, and no orphans", () => {
    expect(files.map((name) => name.replace(/\.mdx$/, "")).sort()).toEqual(
      dispatches.map((dispatch) => dispatch.slug).sort(),
    );
  });

  it("keeps metadata, the h1 and markdown images out of every body", () => {
    for (const name of files) {
      const source = readFileSync(path.join(DISPATCH_DIR, name), "utf8");
      expect(source.trim().length).toBeGreaterThan(0);

      // The second source of truth docs/adr/0008 exists to avoid.
      expect(source).not.toMatch(/export\s+const\s+metadata/);

      // The `h1` is the dispatch title, rendered by the page chrome. A `# `
      // here puts two of them on the page and breaks the heading outline —
      // which is also why the element map has no `h1` entry.
      expect(source).not.toMatch(/^#\s/m);

      // A markdown image carries no dimensions, so it cannot go through
      // `next/image` without a layout shift. Write the `<img src width height
      // alt>` tag and the element map turns it into an `Image`.
      expect(source).not.toMatch(/!\[[^\]]*\]\(/);
    }
  });

  it("keeps content/dispatches.ts free of MDX imports", () => {
    // If that module ever imports an `.mdx`, the MDX pipeline reaches the unit
    // Vitest project through news-band.tsx to app/page.tsx to
    // app/page.test.tsx — and no Vitest project knows how to compile one.
    //
    // Comments are stripped first, because the module's own docstring quotes
    // the forbidden import as the example of what not to write. The guard is
    // about code; documenting the rule must not trip it. The strip is naive —
    // it would mangle a `*/` inside a string literal — which is fine for a
    // module that is a typed array and nothing else.
    const source = readFileSync(path.join(CONTENT_DIR, "dispatches.ts"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

    expect(source).not.toMatch(/(?:from\s*|import\s*\(\s*)["'`][^"'`]*\.mdx/);
  });
});

/**
 * Intrinsic dimensions of an image file, without a dependency.
 *
 * Only the three formats this site actually uses. Returns `null` for anything
 * else, so a new format fails the assertion loudly rather than passing
 * vacuously.
 */
function imageSize(file: string): { width: number; height: number } | null {
  const buf = readFileSync(file);

  if (file.endsWith(".png")) {
    // IHDR is the first chunk, and its width and height are big-endian at a
    // fixed offset.
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    // Walk the segment markers to the start-of-frame, which is the only one
    // carrying the dimensions.
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buf[offset + 1];
      const isFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker);
      if (isFrame) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
    return null;
  }

  if (file.endsWith(".svg")) {
    const source = buf.toString("utf8");
    const width = source.match(/\bwidth="(\d+)"/);
    const height = source.match(/\bheight="(\d+)"/);
    if (!width || !height) return null;
    return { width: Number(width[1]), height: Number(height[1]) };
  }

  return null;
}

/**
 * Every image a dispatch body declares, with the numbers it declares.
 *
 * `<Figure>`, capitalised, because a lowercase JSX tag in MDX compiles to the
 * intrinsic element and never reaches the component map — see the entry in
 * `components/news/prose-components.tsx`. Parsing for a lowercase tag here
 * would find nothing and pass every assertion below vacuously.
 */
function bodyImages(slug: string) {
  const source = readFileSync(path.join(DISPATCH_DIR, `${slug}.mdx`), "utf8");
  return [...source.matchAll(/<Figure\s[^>]*?\/>/g)].map((match) => {
    const tag = match[0];
    const src = tag.match(/src="([^"]+)"/);
    const width = tag.match(/width=\{(\d+)\}/);
    const height = tag.match(/height=\{(\d+)\}/);
    return {
      src: src?.[1],
      width: width ? Number(width[1]) : undefined,
      height: height ? Number(height[1]) : undefined,
    };
  });
}

describe("dispatch images", () => {
  /**
   * The guard on swapping a placeholder for a real screenshot.
   *
   * `next/image` reserves space from the declared width and height, and the
   * body images set `w-full h-auto` — so a declared aspect ratio that does not
   * match the file stretches the image rather than letterboxing it. Nothing
   * about that fails a build, and it is exactly the step that gets forgotten
   * when a placeholder is replaced.
   */
  const declared = [
    ...dispatches
      .filter((dispatch) => dispatch.cover)
      .map((dispatch) => ({
        where: `${dispatch.slug} cover`,
        ...dispatch.cover!,
      })),
    ...dispatches.flatMap((dispatch) =>
      bodyImages(dispatch.slug).map((image, index) => ({
        where: `${dispatch.slug} body image ${index + 1}`,
        ...image,
      })),
    ),
  ];

  it("uses Figure rather than a raw img in every body", () => {
    for (const dispatch of dispatches) {
      const source = readFileSync(
        path.join(DISPATCH_DIR, `${dispatch.slug}.mdx`),
        "utf8",
      );
      // A lowercase `<img>` renders as a bare tag: no `next/image`, no `sizes`,
      // no border and no optimisation. Nothing else in this suite would
      // notice, because the file it points at still exists — which is exactly
      // how it got shipped once already.
      expect(source, dispatch.slug).not.toMatch(/<img[\s>]/);
    }
  });

  it("declares a src, a width and a height for every image", () => {
    expect(declared.length).toBeGreaterThan(0);
    for (const image of declared) {
      expect(image.src, image.where).toBeTruthy();
      expect(image.width, image.where).toBeGreaterThan(0);
      expect(image.height, image.where).toBeGreaterThan(0);
    }
  });

  it("points every image at a file that exists", () => {
    for (const image of declared) {
      const file = path.join(PUBLIC_DIR, image.src!);
      expect(existsSync(file), `${image.where} -> ${image.src}`).toBe(true);
    }
  });

  it("declares the dimensions the file actually has", () => {
    for (const image of declared) {
      const size = imageSize(path.join(PUBLIC_DIR, image.src!));
      expect(
        size,
        `${image.where}: unreadable or unsupported format`,
      ).not.toBeNull();
      expect(
        `${size!.width}x${size!.height}`,
        `${image.where} (${image.src})`,
      ).toBe(`${image.width}x${image.height}`);
    }
  });

  it("keeps at most two images per dispatch, counting the cover", () => {
    for (const dispatch of dispatches) {
      const total = (dispatch.cover ? 1 : 0) + bodyImages(dispatch.slug).length;
      expect(total, dispatch.slug).toBeLessThanOrEqual(2);
    }
  });

  it("leaves no unreferenced file in the Planetar image directory", () => {
    const referenced = new Set(
      declared
        .map((image) => image.src!)
        .filter((src) => src.startsWith("/news/planetar/"))
        .map((src) => path.basename(src)),
    );
    const onDisk = readdirSync(path.join(PUBLIC_DIR, "news", "planetar"));
    // An orphan here is a placeholder whose article stopped using it, which is
    // dead weight in the repository and in the deployed bundle.
    expect([...onDisk].sort()).toEqual([...referenced].sort());
  });
});
