interface TextInputProps {
  label?: string;
  hint?: string;
  placeholder?: string;
  value?: string;
  size?: "sm" | "md" | "lg";
  state?: "default" | "error" | "success" | "disabled";
}

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
};

const stateStyles = {
  default: "border-input focus:border-primary focus:ring-1 focus:ring-ring",
  error: "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/50",
  success: "border-success focus:border-success focus:ring-1 focus:ring-success/50",
  disabled: "border-input opacity-50 cursor-not-allowed",
};

export function TextInput({
  label,
  hint,
  placeholder,
  value,
  size = "md",
  state = "default",
}: TextInputProps) {
  const id = `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div data-component="text-input" className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        disabled={state === "disabled"}
        className={`w-full rounded-md border bg-card text-foreground outline-none transition-colors duration-fast placeholder:text-muted-foreground ${sizeStyles[size]} ${stateStyles[state]}`}
      />
      {hint && (
        <p className={`text-xs ${state === "error" ? "text-destructive" : "text-muted-foreground"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
