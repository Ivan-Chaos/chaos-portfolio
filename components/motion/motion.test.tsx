import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountUp } from "./count-up";
import { Decode } from "./decode";
import { Reveal } from "./reveal";

/**
 * The two promises these primitives have to keep, checked here rather than
 * assumed:
 *
 * 1. **Nothing animates under reduced motion.** All three rewrite the DOM from
 *    script, which puts them outside the CSS guard in `globals.css`. Spec 0001
 *    promises a visitor who asked for reduced motion gets none, and this is the
 *    first code in the project that could break that.
 * 2. **Content is never hidden by server-rendered output.** `Reveal` is the only
 *    thing on the page that can make text invisible, and the guarantee is
 *    structural — the hidden state is an attribute only script writes. The
 *    markup assertion below is what stops someone "simplifying" that into an
 *    initial `opacity-0` class.
 */

/* ── Stubs ───────────────────────────────────────────────────────────────── */

function stubMatchMedia(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes("reduce"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/** jsdom has no IntersectionObserver, so the primitives get a controllable one. */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Reports the observed element as on screen. */
  enter() {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as IntersectionObserver,
    );
  }
}

beforeEach(() => {
  MockIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  stubMatchMedia(false);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/* ── Reveal ──────────────────────────────────────────────────────────────── */

describe("Reveal", () => {
  it("ships no hidden state in server-rendered output", () => {
    const html = renderToStaticMarkup(
      <Reveal>
        <p>Track record</p>
      </Reveal>,
    );

    expect(html).toContain("Track record");
    // The attribute form, not the bare name — `data-reveal-armed:opacity-0` is
    // a Tailwind variant and belongs in the class list. What must never appear
    // is the attribute that variant matches on.
    expect(html).not.toContain("data-reveal-armed=");
    expect(html).not.toContain("data-revealed=");

    // And no unconditional opacity utility either: every `opacity-0` in the
    // class list must be behind a variant keyed on the armed attribute, which
    // only script can set.
    const hidingTokens = [...html.matchAll(/class="([^"]*)"/g)]
      .flatMap(([, value]) => value.split(/\s+/))
      .filter((token) => token === "opacity-0" || token.endsWith(":opacity-0"));

    expect(hidingTokens).toHaveLength(1);
    expect(hidingTokens[0]).toBe("data-reveal-armed:opacity-0");
  });

  it("arms and observes when motion is allowed and it is off screen", () => {
    // jsdom reports a zero rect for everything, so nothing is ever "in
    // viewport" here — which is exactly the branch worth testing.
    const { container } = render(
      <Reveal>
        <p>Engagements</p>
      </Reveal>,
    );
    const node = container.firstElementChild as HTMLElement;

    expect(node.dataset.revealArmed).toBe("");
    expect(node.dataset.revealed).toBeUndefined();
    expect(MockIntersectionObserver.instances).toHaveLength(1);
    expect(MockIntersectionObserver.instances[0].observed).toEqual([node]);
  });

  it("reveals and stops observing once on screen", () => {
    const { container } = render(
      <Reveal>
        <p>Engagements</p>
      </Reveal>,
    );
    const node = container.firstElementChild as HTMLElement;

    MockIntersectionObserver.instances[0].enter();

    expect(node.dataset.revealed).toBe("");
    expect(node.dataset.revealArmed).toBeUndefined();
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true);
  });

  it("reveals unconditionally if the observer never reports", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Reveal>
        <p>Engagements</p>
      </Reveal>,
    );
    const node = container.firstElementChild as HTMLElement;
    expect(node.dataset.revealArmed).toBe("");

    vi.advanceTimersByTime(2000);

    expect(node.dataset.revealed).toBe("");
    expect(node.dataset.revealArmed).toBeUndefined();
  });

  it("neither arms nor observes under reduced motion", () => {
    stubMatchMedia(true);
    const { container } = render(
      <Reveal>
        <p>Capabilities</p>
      </Reveal>,
    );
    const node = container.firstElementChild as HTMLElement;

    expect(node.dataset.revealArmed).toBeUndefined();
    expect(node.dataset.revealed).toBeUndefined();
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });
});

/* ── Decode ──────────────────────────────────────────────────────────────── */

describe("Decode", () => {
  it("renders the real text server-side", () => {
    const html = renderToStaticMarkup(<Decode text="Ivan Chaus" />);
    // Once visible-but-hidden-from-AT, once as the accessible name.
    expect(html.replace(/<[^>]+>/g, "")).toBe("Ivan ChausIvan Chaus");
  });

  it("keeps the accessible name intact while scrambling", () => {
    const { container } = render(<Decode text="Ivan Chaus" />);

    const hidden = container.querySelector("[aria-hidden='true']")!;
    const name = container.querySelector(".sr-only")!;

    // The scrambled node is hidden from assistive technology; the name is not.
    expect(hidden.getAttribute("aria-hidden")).toBe("true");
    expect(name.textContent).toBe("Ivan Chaus");
    // The space is never replaced, so the string cannot break in a new place.
    expect(hidden.textContent).toHaveLength("Ivan Chaus".length);
    expect(hidden.textContent?.[4]).toBe(" ");
  });

  it("settles on the real text", () => {
    vi.useFakeTimers();
    const { container } = render(<Decode text="Ivan Chaus" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    vi.advanceTimersByTime(1000);

    expect(hidden.textContent).toBe("Ivan Chaus");
    expect(hidden.querySelector(".text-muted-foreground")).toBeNull();
  });

  it("does not scramble at all under reduced motion", () => {
    stubMatchMedia(true);
    const { container } = render(<Decode text="Ivan Chaus" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    expect(hidden.textContent).toBe("Ivan Chaus");
  });
});

/* ── CountUp ─────────────────────────────────────────────────────────────── */

describe("CountUp", () => {
  it("renders the final figure server-side", () => {
    const html = renderToStaticMarkup(<CountUp value="50K+" />);
    expect(html.replace(/<[^>]+>/g, "")).toBe("50K+50K+");
  });

  it("starts at zero, padded to the final width, and carries the suffix", () => {
    const { container } = render(<CountUp value="50K+" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    expect(hidden.textContent).toBe("00K+");
    // Width is held by the padding, which is what makes reflow impossible
    // rather than merely unlikely.
    expect(hidden.textContent).toHaveLength("50K+".length);
  });

  it("counts to the final figure once on screen", async () => {
    const { container } = render(<CountUp value="10+" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;
    expect(hidden.textContent).toBe("00+");

    MockIntersectionObserver.instances[0].enter();
    await vi.waitFor(() => expect(hidden.textContent).toBe("10+"), {
      timeout: 2000,
    });
  });

  it("shows the figure even if the observer never reports", async () => {
    const { container } = render(<CountUp value="07" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    await vi.waitFor(() => expect(hidden.textContent).toBe("07"), {
      timeout: 4000,
    });
  });

  it("leaves the figure alone under reduced motion", () => {
    stubMatchMedia(true);
    const { container } = render(<CountUp value="50K+" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    expect(hidden.textContent).toBe("50K+");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("leaves a value with no leading digits untouched", () => {
    const { container } = render(<CountUp value="n/a" />);
    const hidden = container.querySelector("[aria-hidden='true']")!;

    expect(hidden.textContent).toBe("n/a");
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });
});
