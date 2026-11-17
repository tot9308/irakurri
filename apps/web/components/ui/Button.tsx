import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants: Record<string, string> = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500",
    secondary: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-400",
    ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 focus-visible:ring-neutral-300",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
