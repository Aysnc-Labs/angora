import { discoverComponents } from "@/chrome/discover";
import Link from "next/link";

export default function DesignSystemIndex() {
  const groups = discoverComponents();
  const totalComponents = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Components
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalComponents} component{totalComponents === 1 ? "" : "s"} in the design system.
        </p>
      </div>

      {totalComponents === 0 ? (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-chrome-border p-16">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-chrome">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-chrome-foreground">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">
              No components yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add <code className="rounded bg-chrome px-1.5 py-0.5 font-mono text-[11px]">src/components/*.tsx</code> files to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) =>
            group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col rounded-xl border border-chrome-border bg-chrome-surface p-5 no-underline transition-all duration-normal hover:border-chrome-foreground/15 hover:shadow-md"
              >
                {/* Preview placeholder */}
                <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-background">
                  <div className="flex items-center gap-2">
                    <div className="h-7 rounded-md bg-primary/10 px-3 text-xs leading-7 font-medium text-primary">
                      {item.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-chrome-active group-hover:text-foreground">
                    {item.label}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-chrome-foreground/30 transition-all duration-fast group-hover:translate-x-0.5 group-hover:text-chrome-foreground"
                  >
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="mt-0.5 font-mono text-[10px] text-chrome-foreground/50">
                  src/components/{item.label.replace(/\s/g, "")}.tsx
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
