/**
 * Presentation helpers for the foundation docs pages.
 *
 * These are Storybook-only and deliberately live outside `components/` — they
 * document the system, they are not part of it.
 *
 * MDX docs pages are not stories, so the `withTheme` decorator in
 * `.storybook/preview.tsx` never runs for them. Everything here therefore
 * carries its own theme wrapper rather than depending on the class on <html>,
 * which is also better documentation: both themes are visible at once.
 */
import * as React from "react";

/* ── contrast measurement ──────────────────────────────────────────────────
   The point of measuring in the browser rather than restating the numbers from
   globals.css is that this reads whatever the tokens *currently* resolve to. If
   someone retunes a ramp, these tables go red on their own. */

function parseRgb(value: string): [number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null;
  return [parts[0], parts[1], parts[2]];
}

function relativeLuminance([r, g, b]: [number, number, number]) {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = parseRgb(fg);
  const b = parseRgb(bg);
  if (!a || !b) return null;
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

const toHex = (value: string) => {
  const rgb = parseRgb(value);
  if (!rgb) return value;
  return (
    "#" +
    rgb
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

/**
 * Reads the `color` and `background-color` an element actually computes to.
 *
 * Attach it to an element that already carries the tokens under test, and both
 * values come from one measurement — no hidden probe elements, and the visible
 * sample doubles as the evidence.
 *
 * Measuring happens in a ref callback rather than an effect: setting state
 * synchronously inside an effect body is what the React Compiler lint rejects,
 * and a ref callback fires exactly when the element attaches, which is when the
 * computed style becomes readable.
 *
 * A tuple rather than `{ ref, value }` because a field literally named `ref`
 * trips the `react-hooks/refs` heuristic.
 *
 * Measures once per mount, which is enough: `ThemeSplit` mounts both themes
 * simultaneously, so each sample reads its own theme.
 */
function useComputedColors() {
  const [computed, setComputed] = React.useState<{
    color: string;
    background: string;
  } | null>(null);

  const attach = React.useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const style = getComputedStyle(el);
    setComputed({ color: style.color, background: style.backgroundColor });
  }, []);

  return [attach, computed] as const;
}

/* ── layout ───────────────────────────────────────────────────────────────── */

/**
 * Renders children once per theme. Background and text colours sit on a child
 * of the `.dark` element because the dark variant is `&:is(.dark *)` — the
 * element carrying the class is not matched by it.
 */
export function ThemeSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 grid gap-px overflow-hidden border border-neutral-500/40 bg-neutral-500/40 md:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div key={theme} className={theme === "dark" ? "dark" : undefined}>
          <div className="bg-background p-5 text-foreground">
            <p className="mb-4 label-caps text-muted-foreground">{theme}</p>
            {children}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-start gap-4">{children}</div>;
}

/* ── swatches ─────────────────────────────────────────────────────────────── */

/**
 * One colour token. Shows the token name and the value it actually resolves to
 * in the surrounding theme.
 */
export function Swatch({
  token,
  label,
  note,
}: {
  token: string;
  label?: string;
  note?: string;
}) {
  const [attach, computed] = useComputedColors();
  return (
    <div className="min-w-36">
      <span
        ref={attach}
        aria-hidden="true"
        className="block h-14 w-full border border-hairline"
        style={{ background: `var(${token})` }}
      />
      <p className="mt-2 text-2xs leading-relaxed">
        <span className="block text-foreground">{label ?? token}</span>
        <span className="block text-muted-foreground">
          {computed ? toHex(computed.background) : "—"}
        </span>
        {note ? (
          <span className="block text-muted-foreground">{note}</span>
        ) : null}
      </p>
    </div>
  );
}

/** A ramp rendered as one continuous strip — reads as a scale, not a list. */
export function Ramp({ tokens, label }: { tokens: string[]; label: string }) {
  return (
    <div className="min-w-full">
      <p className="mb-2 label-caps text-muted-foreground">{label}</p>
      <div className="flex border border-hairline">
        {tokens.map((t) => (
          <span
            key={t}
            title={t}
            className="h-12 flex-1"
            style={{ background: `var(${t})` }}
          />
        ))}
      </div>
      <div className="mt-1 flex">
        {tokens.map((t) => (
          <span
            key={t}
            className="flex-1 text-center text-2xs text-muted-foreground"
          >
            {t.replace(/^--(ink|amber|red|green)-?/, "")}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── contrast table ───────────────────────────────────────────────────────── */

type Pair = { fg: string; bg: string; label: string; need: 4.5 | 3 };

function ContrastRow({ pair }: { pair: Pair }) {
  const [attach, computed] = useComputedColors();
  const ratio = computed
    ? contrastRatio(computed.color, computed.background)
    : null;
  const pass = ratio !== null && ratio >= pair.need;

  return (
    <tr className="border-t border-hairline">
      <td className="py-2 pr-4 align-top">
        {/* The sample IS the measurement — this element carries both tokens, so
            what you see is exactly what the ratio was computed from. */}
        <span
          ref={attach}
          className="mr-2 inline-block border border-hairline px-1.5 align-middle"
          style={{ color: `var(${pair.fg})`, background: `var(${pair.bg})` }}
        >
          Aa
        </span>
        {pair.label}
      </td>
      <td className="py-2 pr-4 text-right align-top tabular-nums">
        {ratio ? `${ratio.toFixed(2)}:1` : "—"}
      </td>
      <td className="py-2 pr-4 text-right align-top text-muted-foreground">
        {pair.need === 4.5 ? "text" : "non-text"}
      </td>
      <td
        className={`py-2 text-right align-top ${pass ? "text-success-text" : "text-danger-text"}`}
      >
        {ratio === null ? "—" : pass ? "PASS" : "FAIL"}
      </td>
    </tr>
  );
}

/**
 * Measures each pair against its real WCAG threshold: 4.5:1 for text (1.4.3),
 * 3:1 for anything that only has to be distinguishable (1.4.11).
 */
export function ContrastTable({ pairs }: { pairs: Pair[] }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="label-caps text-muted-foreground">
          <th className="pb-2 text-left font-normal">Pair</th>
          <th className="pb-2 text-right font-normal">Ratio</th>
          <th className="pb-2 text-right font-normal">Threshold</th>
          <th className="pb-2 text-right font-normal">Result</th>
        </tr>
      </thead>
      <tbody>
        {pairs.map((p) => (
          <ContrastRow key={`${p.fg}|${p.bg}|${p.label}`} pair={p} />
        ))}
      </tbody>
    </table>
  );
}

/* ── type + motion specimens ──────────────────────────────────────────────── */

export function TypeRow({
  className,
  name,
  sample = "Orbital mechanics 0123456789",
}: {
  className: string;
  name: string;
  sample?: string;
}) {
  return (
    <div className="border-t border-hairline py-3">
      <p className="mb-1 label-caps text-muted-foreground">{name}</p>
      <p className={className}>{sample}</p>
    </div>
  );
}

/** Click-to-replay so an easing curve can actually be felt, not just read. */
export function MotionSpecimen({
  name,
  duration,
  easing,
}: {
  name: string;
  duration: string;
  easing: string;
}) {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="w-full border-t border-hairline py-3 text-left"
    >
      <span className="mb-2 block label-caps text-muted-foreground">
        {name} · {duration} · {easing}
      </span>
      <span className="block h-2 bg-muted">
        <span
          className="block h-full bg-signal"
          style={{
            width: on ? "100%" : "8%",
            transitionProperty: "width",
            transitionDuration: `var(${duration})`,
            transitionTimingFunction: `var(${easing})`,
          }}
        />
      </span>
    </button>
  );
}
