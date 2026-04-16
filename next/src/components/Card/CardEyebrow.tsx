export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      data-component="CardEyebrow"
      className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary"
    >
      {children}
    </p>
  );
}
