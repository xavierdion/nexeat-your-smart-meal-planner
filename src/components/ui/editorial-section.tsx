import * as React from "react";
import { cn } from "@/lib/utils";

type Surface = "warm" | "cool" | "paper" | "default";

export interface EditorialSectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: Surface;
  eyebrow?: string;
  title?: string;
}

const SURFACE_CLASSES: Record<Surface, string> = {
  warm: "bg-surface-warm",
  cool: "bg-surface-cool",
  paper: "bg-surface-paper",
  default: "bg-background",
};

export const EditorialSection = React.forwardRef<HTMLElement, EditorialSectionProps>(
  ({ surface = "default", eyebrow, title, className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("w-full px-4 py-6", SURFACE_CLASSES[surface], className)}
      {...props}
    >
      {(eyebrow || title) && (
        <header className="mb-4">
          {eyebrow && (
            <p className="text-eyebrow uppercase text-primary/70">{eyebrow}</p>
          )}
          {title && (
            <h2 className="font-display text-display-lg text-foreground mt-1">{title}</h2>
          )}
        </header>
      )}
      {children}
    </section>
  ),
);
EditorialSection.displayName = "EditorialSection";