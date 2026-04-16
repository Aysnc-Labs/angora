import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight, Plus } from "@/icons";
import { SpecimenProvider } from "@/chrome/SpecimenContext";
import {
  componentFileForSlug,
  discoverComponents,
  specimenPath,
} from "@/chrome/discover";
import { readMdxDescription } from "@/chrome/mdx-utils";

async function loadMdx(slug: string): Promise<React.ComponentType | null> {
  const match = componentFileForSlug(slug);
  if (!match) return null;
  const abs = path.join(process.cwd(), specimenPath(match.name, match.dir));
  if (!fs.existsSync(abs)) return null;
  try {
    const mod = await import(
      `@/components/${match.name}/${match.name}.specimen.mdx`
    );
    return mod.default ?? null;
  } catch {
    return null;
  }
}

export default async function DesignSystemIndex() {
  const groups = discoverComponents();
  const totalComponents = groups.reduce((sum, g) => sum + g.items.length, 0);

  const cards = await Promise.all(
    groups.flatMap((group) =>
      group.items.map(async (item) => {
        const slug = item.href.replace("/design-system/", "");
        const description = readMdxDescription(item.name, item.dir);
        const Mdx = await loadMdx(slug);
        return { item, description, Mdx, groupTitle: group.title };
      })
    )
  );

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Components
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalComponents} component{totalComponents === 1 ? "" : "s"} across{" "}
          {groups.length} group{groups.length === 1 ? "" : "s"}.
        </p>
      </div>

      {totalComponents === 0 ? (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-chrome-border p-16">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-chrome">
              <Plus size={20} strokeWidth={1.75} className="text-chrome-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No components yet</p>
            <p className="mt-1 text-chrome-sm text-muted-foreground">
              Add{" "}
              <code className="rounded bg-chrome px-1.5 py-0.5 font-mono text-chrome-xs">
                src/components/&lt;Name&gt;/&lt;Name&gt;.tsx
              </code>{" "}
              directories to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="mb-3 text-chrome-xs font-semibold uppercase text-chrome-muted">
                {group.title}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const card = cards.find((c) => c.item.href === item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex flex-col overflow-hidden rounded-xl border border-chrome-border bg-chrome-surface no-underline transition-all duration-normal hover:border-chrome-ring hover:shadow-md"
                    >
                      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-background p-4">
                        <div className="pointer-events-none flex h-full w-full scale-75 items-center justify-center [&>*]:!max-w-full">
                          {card?.Mdx ? (
                            <SpecimenProvider previewMode>
                              <card.Mdx />
                            </SpecimenProvider>
                          ) : (
                            <span className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                              {item.label}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-chrome-active group-hover:text-foreground">
                            {item.label}
                          </span>
                          <ArrowRight
                            size={14}
                            strokeWidth={1.75}
                            className="text-chrome-muted transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-chrome-foreground"
                          />
                        </div>
                        {card?.description && (
                          <p className="text-chrome-sm text-pretty text-muted-foreground line-clamp-2">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
