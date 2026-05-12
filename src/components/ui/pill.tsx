import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center rounded-[6px] text-[11px] leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        category: "bg-secondary/15 text-primary font-medium px-[10px] py-[3px]",
        new: "bg-[hsl(var(--accent-soft))] text-accent font-semibold px-[10px] py-[3px]",
        proactive: "bg-accent text-white font-semibold px-[10px] py-[3px]",
        veggie: "bg-[hsl(165_24%_72%_/_0.4)] text-foreground font-medium px-[10px] py-[3px]",
        "score-a": "bg-[#3D9970] text-white font-bold px-[7px] py-[3px]",
        "score-b": "bg-[#7DC46A] text-white font-bold px-[7px] py-[3px]",
        "score-c": "bg-[#F4C430] text-foreground font-bold px-[7px] py-[3px]",
        "score-d": "bg-accent text-white font-bold px-[7px] py-[3px]",
        "score-e": "bg-[#C0392B] text-white font-bold px-[7px] py-[3px]",
        "category-overlay": "bg-white/95 backdrop-blur-sm text-primary font-medium px-[10px] py-[3px]",
      },
    },
    defaultVariants: { variant: "category" },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(pillVariants({ variant }), className)} {...props} />
  ),
);
Pill.displayName = "Pill";

export { pillVariants };