interface CardProps {
  variant?: "default" | "elevated" | "flat";
  padding?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-card border border-border shadow-sm",
  elevated:
    "bg-card shadow-lg transition-shadow duration-normal hover:shadow-xl",
  flat: "bg-muted",
};

export function Card({
  variant = "default",
  padding = true,
  children,
}: CardProps) {
  return (
    <div
      data-component="card"
      className={`overflow-hidden rounded-lg ${variantStyles[variant]} ${padding ? "p-6" : ""}`}
    >
      {children}
    </div>
  );
}

export function CardImage({
  src,
  alt,
  height = "h-40",
}: {
  src?: string;
  alt?: string;
  height?: string;
}) {
  if (!src) {
    return <div className={`w-full ${height} bg-muted`} />;
  }
  return (
    <img
      src={src}
      alt={alt || ""}
      className={`w-full ${height} object-cover`}
    />
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
      {children}
    </p>
  );
}

export function CardTitle({
  as: Tag = "h3",
  children,
}: {
  as?: "p" | "h2" | "h3" | "h4";
  children: React.ReactNode;
}) {
  return (
    <Tag className="mb-1 font-semibold text-card-foreground">{children}</Tag>
  );
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted-foreground">{children}</div>;
}
