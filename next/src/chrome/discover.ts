import fs from "fs";
import path from "path";
import angoraConfig from "../../angora.config";
import type { NavGroup, NavGroupConfig, NavItem } from "./types";

const DEFAULT_CONFIG: NavGroupConfig[] = [{ dir: "src/components" }];

function toLabel(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function toSlug(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function titleFromDir(dir: string): string {
  const last = dir.replace(/\/$/, "").split("/").pop() ?? dir;
  return last.charAt(0).toUpperCase() + last.slice(1);
}

/**
 * A component directory is any subdirectory of a group dir that contains a
 * `<Name>.tsx` file matching its directory name. Sub-component files, test
 * files, and specimens don't need special handling — the directory-name rule
 * enforces the convention.
 */
function isComponentDir(absPath: string, name: string): boolean {
  if (name.startsWith("_") || name.startsWith(".")) return false;
  try {
    if (!fs.statSync(absPath).isDirectory()) return false;
    return fs.existsSync(path.join(absPath, `${name}.tsx`));
  } catch {
    return false;
  }
}

function scanDir(absDir: string): NavItem[] {
  if (!fs.existsSync(absDir)) return [];
  return fs
    .readdirSync(absDir)
    .filter((entry) => isComponentDir(path.join(absDir, entry), entry))
    .map((name) => ({
      label: toLabel(name),
      href: `/design-system/${toSlug(name)}`,
      name,
      dir: "", // filled by caller
    }));
}

function orderItems(items: NavItem[], order?: string[]): NavItem[] {
  if (!order || order.length === 0) {
    return [...items].sort((a, b) => a.label.localeCompare(b.label));
  }
  const byName = new Map(items.map((i) => [i.name, i]));
  const seen = new Set<string>();
  const head: NavItem[] = [];
  for (const name of order) {
    const item = byName.get(name);
    if (item && !seen.has(item.name)) {
      head.push(item);
      seen.add(item.name);
    }
  }
  const tail = items
    .filter((i) => !seen.has(i.name))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [...head, ...tail];
}

export function discoverComponents(): NavGroup[] {
  const root = process.cwd();
  const config =
    angoraConfig.nav && angoraConfig.nav.length > 0
      ? angoraConfig.nav
      : DEFAULT_CONFIG;

  return config
    .map((group) => ({
      title: group.title ?? titleFromDir(group.dir),
      items: orderItems(
        scanDir(path.join(root, group.dir)).map((item) => ({ ...item, dir: group.dir })),
        group.order
      ),
    }))
    .filter((group) => group.items.length > 0);
}

export function componentFileForSlug(
  slug: string
): { name: string; dir: string } | null {
  const root = process.cwd();
  const config =
    angoraConfig.nav && angoraConfig.nav.length > 0
      ? angoraConfig.nav
      : DEFAULT_CONFIG;

  for (const group of config) {
    const absDir = path.join(root, group.dir);
    if (!fs.existsSync(absDir)) continue;
    const match = fs
      .readdirSync(absDir)
      .filter((entry) => isComponentDir(path.join(absDir, entry), entry))
      .find((name) => toSlug(name) === slug);
    if (match) {
      return { name: match, dir: group.dir };
    }
  }
  return null;
}

/** Specimen file path, e.g. "src/components/Button/Button.specimen.mdx" */
export function specimenPath(name: string, dir: string): string {
  return path.join(dir, name, `${name}.specimen.mdx`);
}

/** Component source file path, e.g. "src/components/Button/Button.tsx" */
export function componentPath(name: string, dir: string): string {
  return path.join(dir, name, `${name}.tsx`);
}
