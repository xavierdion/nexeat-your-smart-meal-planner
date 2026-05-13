import * as React from "react";
import { cn } from "@/lib/utils";

export type NutriScore = "A" | "B" | "C" | "D" | "E";

const SCORE_BG: Record<NutriScore, string> = {
  A: "#3D9970",
  B: "#7DC46A",
  C: "#F4C430",
  D: "hsl(var(--accent))",
  E: "hsl(var(--score-e))",
};

const SCORE_TEXT_COLOR: Record<NutriScore, string> = {
  A: "#FFFFFF",
  B: "#FFFFFF",
  C: "hsl(var(--foreground))",
  D: "#FFFFFF",
  E: "#FFFFFF",
};

export const NUTRI_SCORE_TEXT: Record<NutriScore, string> = {
  A: "Recette très équilibrée",
  B: "Recette bien équilibrée",
  C: "Équilibre moyen",
  D: "À consommer à l'occasion",
  E: "À limiter dans le plan",
};

interface NutriScoreBadgeProps {
  score: NutriScore;
  className?: string;
}

export function NutriScoreBadge({ score, className }: NutriScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-stretch rounded-[6px] overflow-hidden border border-foreground/10 align-middle",
        className,
      )}
      aria-label={`Nutri-Score ${score}`}
    >
      <span className="bg-white text-foreground/70 text-[10px] font-semibold px-[6px] py-[3px] leading-none flex items-center">
        Nutri-Score
      </span>
      <span
        className="text-[11px] font-bold px-[7px] py-[3px] leading-none flex items-center"
        style={{ background: SCORE_BG[score], color: SCORE_TEXT_COLOR[score] }}
      >
        {score}
      </span>
    </span>
  );
}

export default NutriScoreBadge;