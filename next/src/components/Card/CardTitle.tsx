export function CardTitle({
  as: Tag = "h3",
  children,
}: {
  as?: "p" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}) {
  return (
    <Tag
      data-component="CardTitle"
      className="mb-1 font-semibold text-card-foreground"
    >
      {children}
    </Tag>
  );
}
