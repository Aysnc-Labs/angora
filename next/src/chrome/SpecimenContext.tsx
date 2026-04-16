"use client";

import { createContext, useContext } from "react";

interface SpecimenContextValue {
  activeSpecimen: string | null;
}

const Ctx = createContext<SpecimenContextValue>({
  activeSpecimen: null,
});

export function useSpecimenContext() {
  return useContext(Ctx);
}

export function SpecimenProvider({
  activeSpecimen = null,
  children,
}: {
  activeSpecimen?: string | null;
  children: React.ReactNode;
}) {
  return (
    <Ctx.Provider value={{ activeSpecimen }}>
      {children}
    </Ctx.Provider>
  );
}

/** Slugify a title for use as a specimen ID */
export function specimenId(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
