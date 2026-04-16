import { Suspense } from "react";
import { CommandPalette } from "@/chrome/CommandPalette";
import { ChromeProvider } from "@/chrome/ChromeProvider";
import { discoverComponents } from "@/chrome/discover";
import { ChromeShell } from "@/chrome/ChromeShell";

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = discoverComponents();
  const allItems = groups.flatMap((g) => g.items);

  return (
    <ChromeProvider>
      <CommandPalette navItems={allItems} />
      <Suspense>
        <ChromeShell groups={groups}>
          {children}
        </ChromeShell>
      </Suspense>
    </ChromeProvider>
  );
}
