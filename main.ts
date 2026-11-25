// One-Line Laugh-Off — a single joke, written to /output/entry.txt.
//
// The line: a self-help book on commitment that ghosts its reader.
// The irony does the work: the book that is supposed to teach
// sticking with things is the thing that leaves first.

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I bought a self-help book on commitment; it ghosted me at chapter three.";

const MAX_CHARS = 200;

function gate(line: string): string[] {
  const faults: string[] = [];
  if (line.length < 1) faults.push("empty");
  if (line.length > MAX_CHARS) faults.push(`too long: ${line.length} chars`);
  if (!line.trim()) faults.push("only whitespace");
  if (/[\r\n]/.test(line)) faults.push("not a single line");
  if (line !== line.trim()) faults.push("leading or trailing space to trim");
  return faults;
}

const faults = gate(JOKE);
if (faults.length > 0) {
  for (const fault of faults) console.error(`invalid line: ${fault}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");

writeFileSync(target, JOKE + "\n", "utf8");
chmodSync(target, 0o644);

const saved = readFileSync(target, "utf8");
if (saved !== JOKE + "\n") {
  console.error("invalid line: written file does not match");
  process.exit(1);
}

console.log(JOKE);
console.log(`chars: ${JOKE.length}, bytes: ${Buffer.byteLength(JOKE, "utf8")}`);
