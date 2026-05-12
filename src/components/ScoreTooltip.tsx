import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

type Score = "A" | "B" | "C" | "D" | "E";

interface ScoreTooltipProps {
  score: Score;
  className?: string;
}

const ScoreTooltip = ({ score, className }: ScoreTooltipProps) => {
  const variant = `score-${score.toLowerCase()}` as
    | "score-a" | "score-b" | "score-c" | "score-d" | "score-e";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className={cn("inline-flex outline-none", className)}
          aria-label={`Indice d'équilibre ${score}`}
        >
          <Pill variant={variant}>{score}</Pill>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="z-50 w-auto max-w-[240px] rounded-xl border-0 bg-white p-3 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[13px] font-semibold text-foreground">Équilibre culinaire</p>
        <p className="mt-1 text-[12px] text-foreground/70 leading-relaxed">
          Calculé sur l'ensemble des ingrédients
        </p>
        <div className="my-2 h-px bg-[#E8E8E4]" />
        <p className="text-[11px] text-foreground/50">Données : Open Food Facts</p>
        <Link
          to="/profil"
          className="mt-2 inline-block text-[12px] text-[hsl(var(--coral))] underline"
        >
          Voir la légende complète →
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default ScoreTooltip;