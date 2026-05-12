import * as React from "react";
import { cn } from "@/lib/utils";

type TagVariant =
  | "score-a" | "score-b" | "score-c" | "score-d" | "score-e"
  | "status-done" | "status-active" | "status-queued"
  | "context-proactive"
  | "meta";

const VARIANT_CLASSES: Record<TagVariant, string> = {
  "score-a": "bg-[#3E8B3E] text-white",
  "score-b": "bg-[#85BB2F] text-white",
  "score-c": "bg-[#FFCC00] text-foreground",
  "score-d": "bg-[#EE8100] text-white",
  "score-e": "bg-[#E63312] text-white",
  "status-done": "bg-secondary/30 text-foreground",
  "status-active": "bg-accent text-white",
  "status-queued": "bg-border text-foreground/60",
  "context-proactive": "bg-accent/10 text-accent",
  "meta": "bg-muted text-foreground/70",
};

interface TagProps {
  variant: TagVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Tag = ({ variant, children, icon, className }: TagProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-md text-[11px] leading-none font-semibold px-2.5 py-1 whitespace-nowrap",
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    {icon}
    {children}
  </span>
);