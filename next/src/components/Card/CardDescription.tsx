export function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <div data-component="CardDescription" className="text-sm text-muted-foreground">
      {children}
    </div>
  );
}
