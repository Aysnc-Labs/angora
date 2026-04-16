"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface A11yViolation {
  id: string;
  description: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  help: string;
  helpUrl: string;
  targets: string[];
}

export interface A11yScan {
  id: string;
  title: string;
  scanning: boolean;
  passes: number;
  violations: A11yViolation[];
}

export interface ComponentContext {
  name: string;
  file: string;
  specimenFile: string;
}

interface A11yContextValue {
  scans: A11yScan[];
  register: (scan: A11yScan) => void;
  componentContext: ComponentContext | null;
}

const Ctx = createContext<A11yContextValue | null>(null);

export function useA11yContext() {
  return useContext(Ctx);
}

export function A11yProvider({
  children,
  componentContext = null,
}: {
  children: React.ReactNode;
  componentContext?: ComponentContext | null;
}) {
  const [scansMap, setScansMap] = useState<Record<string, A11yScan>>({});

  const register = useCallback((scan: A11yScan) => {
    setScansMap((prev) => {
      const existing = prev[scan.id];
      if (
        existing &&
        existing.scanning === scan.scanning &&
        existing.passes === scan.passes &&
        existing.violations.length === scan.violations.length &&
        existing.title === scan.title
      ) {
        return prev;
      }
      return { ...prev, [scan.id]: scan };
    });
  }, []);

  const scans = useMemo(() => Object.values(scansMap), [scansMap]);

  return (
    <Ctx.Provider value={{ scans, register, componentContext }}>
      {children}
    </Ctx.Provider>
  );
}
