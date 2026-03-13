"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-text-inverted hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-secondary text-text-inverted hover:bg-secondary-hover active:bg-secondary-active",
  outline: "bg-transparent text-text border-2 border-black hover:bg-surface",
  ghost: "bg-transparent text-text hover:bg-surface border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center font-semibold",
        "border-2 border-black rounded-md",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "transition-all duration-150",
        // Hover press effect (only when not disabled)
        !isDisabled && [
          "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          "hover:translate-x-[2px] hover:translate-y-[2px]",
          "active:shadow-none",
          "active:translate-x-[4px] active:translate-y-[4px]",
        ],
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Disabled state
        isDisabled && "opacity-50 cursor-not-allowed",
        // Ghost variant removes shadow
        variant === "ghost" && "shadow-none border-0",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
