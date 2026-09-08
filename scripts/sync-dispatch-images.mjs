/**
 * Sync every declared dispatch image to the file that is actually on disk.
 *
 * Swapping a placeholder for a real screenshot means three edits, and two of
 * them are easy to forget: the extension changes, the intrinsic dimensions
 * change, and the alt text stops describing a placeholder. Miss the dimensions
 * and `next/image` reserves the wrong box, which stretches the image rather
 * than failing — so `__tests__/content.test.ts` asserts they match. This is the
 * fixer for that assertion.
 *
 *     pnpm sync-images          report what is out of date
 *     pnpm sync-images --write  fix it
 *
 * Drop a file in `public/news/planetar/` with the same basename as the one it
 * replaces — any of .png, .jpg or .svg — and this repoints the reference,
 * corrects the numbers, and drops a "Placeholder:" prefix from the alt.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DISPATCH_DIR = path.join(ROOT, "content", "dispatches");
const RECORDS = path.join(ROOT, "content", "dispatches.ts");
const PUBLIC_DIR = path.join(ROOT, "public");
const WRITE = process.argv.includes("--write");

/** Intrinsic size of an image, for the three formats this site uses. */
function imageSize(file) {
  const buf = readFileSync(file);

  if (file.endsWith(".png")) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
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
    return width && height
      ? { width: Number(width[1]), height: Number(height[1]) }
      : null;
  }

  return null;
}

const exists = (file) => {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
};

/**
 * The file a reference should point at: itself if it exists, otherwise the
 * same basename under another extension — which is what a swapped screenshot
 * looks like.
 */
function resolve(src) {
  if (exists(path.join(PUBLIC_DIR, src))) return src;

  const dir = path.posix.dirname(src);
  const stem = path.posix.basename(src).replace(/\.[a-z]+$/i, "");
  for (const ext of [".png", ".jpg", ".jpeg", ".svg"]) {
    if (exists(path.join(PUBLIC_DIR, dir, stem + ext))) {
      return path.posix.join(dir, stem + ext);
    }
  }
  return null;
}

const changes = [];
const problems = [];

/** Rewrite one `src` / `width` / `height` / `alt` cluster wherever it appears. */
function syncBlock(source, block, where) {
  const src = block.match(/src[:=]\s*"([^"]+)"/)?.[1];
  if (!src || !src.startsWith("/news/")) return source;

  const resolved = resolve(src);
  if (!resolved) {
    problems.push(`${where}: no file for ${src}`);
    return source;
  }

  const size = imageSize(path.join(PUBLIC_DIR, resolved));
  if (!size) {
    problems.push(`${where}: could not read dimensions of ${resolved}`);
    return source;
  }

  let next = block;
  if (resolved !== src) {
    next = next.replace(src, resolved);
    changes.push(`${where}: ${src} -> ${resolved}`);
  }

  // `width: 1200,` in the records; `width={1200}` in a body.
  for (const [key, value] of [
    ["width", size.width],
    ["height", size.height],
  ]) {
    const record = new RegExp(`(${key}:\\s*)(\\d+)`);
    const jsx = new RegExp(`(${key}=\\{)(\\d+)(\\})`);
    const current = next.match(record)?.[2] ?? next.match(jsx)?.[2];
    if (current === undefined) continue;
    if (Number(current) === value) continue;
    next = next.replace(record, `$1${value}`).replace(jsx, `$1${value}$3`);
    changes.push(`${where}: ${key} ${current} -> ${value}`);
  }

  // A real screenshot is not a placeholder any more.
  if (!resolved.endsWith(".svg") && /alt[:=]\s*"Placeholder: /.test(next)) {
    next = next.replace(
      /(alt[:=]\s*")Placeholder: (\w)/,
      (_, lead, first) => lead + first.toUpperCase(),
    );
    changes.push(`${where}: dropped the "Placeholder:" prefix from alt`);
  }

  return next === block ? source : source.replace(block, next);
}

/* Covers, in the records module. */
let records = readFileSync(RECORDS, "utf8");
for (const match of records.matchAll(/cover: \{[\s\S]*?\n {4}\},/g)) {
  const slug = records
    .slice(0, match.index)
    .match(/slug: "([^"]+)",(?![\s\S]*slug: ")/)?.[1];
  records = syncBlock(records, match[0], `${slug ?? "?"} cover`);
}
if (WRITE) writeFileSync(RECORDS, records);

/* Body images, in each `.mdx`. */
for (const file of readdirSync(DISPATCH_DIR).filter((f) =>
  f.endsWith(".mdx"),
)) {
  const p = path.join(DISPATCH_DIR, file);
  let source = readFileSync(p, "utf8");
  const before = source;
  for (const match of source.matchAll(/<Figure\s[^>]*?\/>/g)) {
    source = syncBlock(source, match[0], `${file} body`);
  }
  if (WRITE && source !== before) writeFileSync(p, source);
}

/* Orphans, which the test also fails on. */
const referenced = new Set();
for (const p of [
  RECORDS,
  ...readdirSync(DISPATCH_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(DISPATCH_DIR, f)),
]) {
  for (const m of readFileSync(p, "utf8").matchAll(
    /\/news\/planetar\/([\w.-]+)/g,
  )) {
    referenced.add(m[1]);
  }
}
const orphans = readdirSync(path.join(PUBLIC_DIR, "news", "planetar")).filter(
  (f) => !referenced.has(f),
);

console.log(
  changes.length
    ? `${WRITE ? "Applied" : "Would apply"} ${changes.length} change(s):`
    : "Every declared image already matches its file.",
);
for (const line of changes) console.log(`  ${line}`);

if (orphans.length) {
  console.log(`\nUnreferenced files (delete these):`);
  for (const f of orphans) console.log(`  public/news/planetar/${f}`);
}
if (problems.length) {
  console.log(`\nCould not resolve:`);
  for (const line of problems) console.log(`  ${line}`);
}
if (!WRITE && changes.length) console.log(`\nRe-run with --write to apply.`);

process.exit(problems.length ? 1 : 0);
