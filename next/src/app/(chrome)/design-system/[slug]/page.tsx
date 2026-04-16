import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { SpecimenProvider } from "@/chrome/SpecimenContext";
import { A11yProvider } from "@/chrome/A11yContext";
import {
  componentFileForSlug,
  componentPath,
  specimenPath,
} from "@/chrome/discover";

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

  const match = componentFileForSlug(slug);
  if (!match) notFound();

  const { name, dir } = match;
  const specimenRel = specimenPath(name, dir);
  const specimenAbs = path.join(process.cwd(), specimenRel);
  const hasMdx = fs.existsSync(specimenAbs);

  let MdxPage: React.ComponentType | null = null;
  if (hasMdx) {
    try {
      const mod = await import(`@/components/${name}/${name}.specimen.mdx`);
      MdxPage = mod.default;
    } catch {
      // MDX failed to load
    }
  }

  const displayName = name.replace(/([a-z])([A-Z])/g, "$1 $2");
  const inSpecimen = Boolean(specimen);

  return (
    <A11yProvider
      componentContext={{
        name,
        file: componentPath(name, dir),
        specimenFile: specimenRel,
      }}
    >
      <SpecimenProvider activeSpecimen={specimen ?? null}>
        {MdxPage ? (
          <div className={inSpecimen ? "" : "px-8 pb-12 pt-6 lg:px-12"}>
            <MdxPage />
          </div>
        ) : (
          <div className="mx-8 flex items-center justify-center rounded-xl border-2 border-dashed border-chrome-border p-16 lg:mx-12">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                No design page yet for {displayName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create{" "}
                <code className="rounded bg-chrome px-1.5 py-0.5 font-mono text-[11px]">
                  {name}.specimen.mdx
                </code>{" "}
                inside{" "}
                <code className="rounded bg-chrome px-1.5 py-0.5 font-mono text-[11px]">
                  {dir}/{name}/
                </code>
                .
              </p>
            </div>
          </div>
        )}
      </SpecimenProvider>
    </A11yProvider>
  );
}
