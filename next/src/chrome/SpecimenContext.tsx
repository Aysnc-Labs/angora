"use client";

import { createContext, useContext, useRef } from "react";

interface SpecimenContextValue {
  activeSpecimen: string | null;
  previewMode: boolean;
  /** In preview mode, only the first Specimen claims the slot; others return null. */
  claimFirst: (id: string) => boolean;
}

const Ctx = createContext<SpecimenContextValue>({
  activeSpecimen: null,
  previewMode: false,
  claimFirst: () => true,
});

export function useSpecimenContext() {
  return useContext(Ctx);
}

export function SpecimenProvider({
  activeSpecimen = null,
  previewMode = false,
  children,
}: {
  activeSpecimen?: string | null;
  previewMode?: boolean;
  children: React.ReactNode;
}) {
  const firstIdRef = useRef<string | null>(null);

  const claimFirst = (id: string) => {
    if (!previewMode) return true;
    if (!firstIdRef.current) firstIdRef.current = id;
    return firstIdRef.current === id;
  };

  return (
    <Ctx.Provider value={{ activeSpecimen, previewMode, claimFirst }}>
      {children}
    </Ctx.Provider>
  );
}

export function specimenId(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
