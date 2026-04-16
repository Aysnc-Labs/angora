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
      data-component="Card"
      className={`overflow-hidden rounded-lg ${variantStyles[variant]} ${padding ? "p-6" : ""}`}
    >
      {children}
    </div>
  );
}
