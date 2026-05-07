import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center rounded-md text-[11px] leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        category: "bg-[#F0F4F3] text-[#4A6670] font-medium px-[10px] py-[3px]",
        new: "bg-[#FEF0ED] text-[#E07A5F] font-semibold px-[10px] py-[3px]",
        proactive: "bg-[#E07A5F] text-white font-semibold px-[10px] py-[3px]",
        veggie: "bg-[hsl(165_24%_72%_/_0.4)] text-[#2A2D35] font-medium px-[10px] py-[3px]",
        "score-a": "bg-[#3E8B3E] text-white font-semibold px-[7px] py-[3px]",
        "score-b": "bg-[#85BB2F] text-white font-semibold px-[7px] py-[3px]",
        "score-c": "bg-[#FFCC00] text-[#2A2D35] font-semibold px-[7px] py-[3px]",
        "score-d": "bg-[#EE8100] text-white font-semibold px-[7px] py-[3px]",
        "score-e": "bg-[#E63312] text-white font-semibold px-[7px] py-[3px]",
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