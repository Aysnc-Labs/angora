import fs from "fs";
import path from "path";
import { specimenPath } from "./discover";

/** Extract the first prose paragraph from MDX source (after the H1). */
export function extractDescription(mdxSource: string): string | null {
  const lines = mdxSource.split("\n");
  let idx = 0;

  while (idx < lines.length && !lines[idx].startsWith("# ")) idx++;
  if (idx >= lines.length) return null;
  idx++;

  while (idx < lines.length && lines[idx].trim() === "") idx++;

  const desc: string[] = [];
  while (idx < lines.length) {
    const line = lines[idx];
    const trimmed = line.trim();
    if (trimmed === "") break;
    if (trimmed.startsWith("<")) break;
    if (trimmed.startsWith("#")) break;
    desc.push(trimmed);
    idx++;
  }
  return desc.join(" ") || null;
}

export function readMdxDescription(name: string, dir: string): string | null {
  const abs = path.join(process.cwd(), specimenPath(name, dir));
  if (!fs.existsSync(abs)) return null;
  try {
    const source = fs.readFileSync(abs, "utf8");
    return extractDescription(source);
  } catch {
    return null;
  }
}
