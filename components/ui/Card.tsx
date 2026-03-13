import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ className, children, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        // Base styles
        "bg-surface rounded-md",
        "border-2 border-black",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        // Hover effect (optional)
        hoverable && [
          "transition-all duration-150",
          "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
          "hover:translate-x-[2px] hover:translate-y-[2px]",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
