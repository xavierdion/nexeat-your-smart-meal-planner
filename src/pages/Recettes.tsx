import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Utensils, Bookmark } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

type Score = "A" | "B" | "C" | "D" | "E";
interface Recipe {
  id: string;
  title: string;
  prep: string;
  portions: string;
  score: Score;
}

const SAVED_MOCK: Recipe[] = [
  { id: "s1", title: "Bol coréen bibimbap végétarien", prep: "25 min", portions: "2 portions", score: "A" },
  { id: "s2", title: "Curry de pois chiches au lait de coco", prep: "30 min", portions: "4 portions", score: "B" },
  { id: "s3", title: "Salade tiède de quinoa et patate douce", prep: "20 min", portions: "2 portions", score: "A" },
  { id: "s4", title: "Pâtes au pesto de basilic et noix", prep: "15 min", portions: "3 portions", score: "C" },
];

function ScorePill({ score }: { score: Score }) {
  return <Pill variant={`score-${score.toLowerCase()}` as "score-a"}>{score}</Pill>;
}

function RecipeCard({ recipe, saved }: { recipe: Recipe; saved?: boolean }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card flex flex-col">
      <div className="relative h-[120px] bg-secondary rounded-t-xl">
        {saved && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <Heart size={14} className="text-accent" fill="#E07A5F" strokeWidth={2} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/90 backdrop-blur-sm flex items-center px-2 gap-1.5 text-[10px] text-foreground">
          <Clock size={12} strokeWidth={2} />
          <span>{recipe.prep}</span>
          <span className="text-foreground/30">·</span>
          <Utensils size={12} strokeWidth={2} />
          <span>{recipe.portions}</span>
          <span className="ml-auto"><ScorePill score={recipe.score} /></span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-[13px] font-medium text-foreground leading-snug line-clamp-2">
          {recipe.title}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title, cta }: { title: string; cta?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-10">
      <div className="w-20 h-20 rounded-full bg-secondary/40 flex items-center justify-center mb-4">
        {/* DOC: strokeWidth={1.75} — Bookmark hero empty state, trait fin volontaire */}
        <Bookmark size={28} className="text-primary" strokeWidth={1.75} />
      </div>
      <p className="text-[14px] text-foreground/60 max-w-[280px]">{title}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

const Recettes = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [saved] = useState<Recipe[]>(SAVED_MOCK);
  const mine: Recipe[] = [];

  return (
    <div className="flex flex-col min-h-full bg-surface-warm pb-6">
      {/* Header */}
      <header className="bg-white px-4 pt-6 pb-0 border-b border-border">
        <h1 className="font-display text-display-xl text-foreground mt-1">Mes Recettes</h1>
        <div className="flex gap-6 mt-3">
          {[
            { id: "saved", label: "Sauvegardées" },
            { id: "mine", label: "Mes recettes" },
          ].map((t) => {
            const active = tab === (t.id as "saved" | "mine");
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "saved" | "mine")}
                className={cn(
                  "pb-3 text-[14px] font-medium transition-colors relative",
                  active ? "text-primary" : "text-foreground/50",
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div className="mt-4">
        {tab === "saved" ? (
          saved.length === 0 ? (
            <EmptyState
              title="Explore les suggestions du jour pour sauvegarder tes coups de cœur"
              cta={
                <button
                  onClick={() => navigate("/aujourd-hui")}
                  className="text-[14px] font-semibold text-primary"
                >
                  Voir les suggestions →
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4">
              {saved.map((r) => (
                <RecipeCard key={r.id} recipe={r} saved />
              ))}
            </div>
          )
        ) : (
          <EmptyState title="Bientôt — pour l'instant, sauvegarde tes coups de cœur depuis les suggestions du jour." />
        )}
      </div>
    </div>
  );
};

export default Recettes;
