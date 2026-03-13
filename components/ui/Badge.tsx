import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface text-text",
  success: "bg-success text-text-inverted",
  warning: "bg-warning text-text",
  error: "bg-error text-text-inverted",
  info: "bg-secondary text-text-inverted",
};

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base styles
        "inline-flex items-center px-2.5 py-0.5",
        "text-xs font-semibold",
        "border-2 border-black rounded-md",
        "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        // Variant styles
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
