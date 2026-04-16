interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantStyles = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

const sizeStyles = {
  sm: "h-5 px-1.5 text-[10px]",
  md: "h-6 px-2 text-xs",
};

export function Badge({
  variant = "default",
  size = "md",
  children,
}: BadgeProps) {
  return (
    <span
      data-component="badge"
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}
