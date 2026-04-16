interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active active:translate-y-px",
  secondary:
    "bg-transparent text-foreground border border-input hover:bg-muted active:bg-accent active:translate-y-px",
  ghost:
    "bg-transparent text-foreground hover:bg-muted active:bg-accent active:translate-y-px",
};

const sizeStyles = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-md gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-component="button"
      className={`inline-flex items-center justify-center font-medium transition-all duration-fast ease-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
}
