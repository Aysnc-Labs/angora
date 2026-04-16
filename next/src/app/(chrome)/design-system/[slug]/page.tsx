import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { SpecimenProvider } from "@/chrome/SpecimenContext";

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ specimen?: string }>;
}

export default async function ComponentPage({
  params,
  searchParams,
}: ComponentPageProps) {
  const { slug } = await params;
  const { specimen } = await searchParams;

  const componentsDir = path.join(process.cwd(), "src/components");
  const files = fs.existsSync(componentsDir)
    ? fs.readdirSync(componentsDir).filter((f) =>
        f.endsWith(".tsx") && !f.includes(".specimen.")
      )
    : [];

  const match = files.find((f) => {
    const name = f.replace(/\.tsx$/, "");
    const fileSlug = name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
    return fileSlug === slug;
  });

  if (!match) notFound();

  const componentName = match.replace(/\.tsx$/, "");
  const displayName = componentName.replace(/([a-z])([A-Z])/g, "$1 $2");
  const filePath = `src/components/${match}`;

  // Load MDX
  const mdxPath = path.join(componentsDir, `${componentName}.mdx`);
  const hasMdx = fs.existsSync(mdxPath);
  let MdxPage: React.ComponentType | null = null;

  if (hasMdx) {
    try {
      const mod = await import(`@/components/${componentName}.mdx`);
      MdxPage = mod.default;
    } catch {
      // MDX failed to load
    }
  }

  return (
    <SpecimenProvider activeSpecimen={specimen ?? null}>
      {MdxPage ? (
        <div className={specimen ? "" : "px-8 pb-12 lg:px-12"}>
          <MdxPage />
        </div>
      ) : (
        <div className="mx-8 flex items-center justify-center rounded-xl border-2 border-dashed border-chrome-border p-16 lg:mx-12">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              No design page yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create <code className="rounded bg-chrome px-1.5 py-0.5 font-mono text-[11px]">{componentName}.mdx</code> next to the component.
            </p>
          </div>
        </div>
      )}
    </SpecimenProvider>
  );
}
