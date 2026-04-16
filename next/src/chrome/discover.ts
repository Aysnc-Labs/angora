import fs from "fs";
import path from "path";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Scans the components directory and builds navigation groups.
 * Runs at build/request time on the server — never shipped to the client.
 */
export function discoverComponents(
  componentsDir: string = path.join(process.cwd(), "src/components")
): NavGroup[] {
  if (!fs.existsSync(componentsDir)) {
    return [{ title: "Components", items: [] }];
  }

  const files = fs.readdirSync(componentsDir).filter((f) => {
    // Only .tsx files, skip test files, index files, and non-component files
    if (!f.endsWith(".tsx")) return false;
    if (f.startsWith("_") || f === "index.tsx") return false;
    if (f.includes(".test.") || f.includes(".spec.") || f.includes(".specimen.")) return false;
    return true;
  });

  const items: NavItem[] = files.map((f) => {
    const name = f.replace(/\.tsx$/, "");
    // Convert PascalCase to display name: "CardGrid" → "Card Grid"
    const label = name.replace(/([a-z])([A-Z])/g, "$1 $2");
    const slug = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    return { label, href: `/design-system/${slug}` };
  });

  // Sort alphabetically
  items.sort((a, b) => a.label.localeCompare(b.label));

  // For now, single group. MDX meta.category will enable grouping later.
  return [{ title: "Components", items }];
}
