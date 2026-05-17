import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RecipeSheet from "@/components/RecipeSheet";
import MealCard from "@/components/MealCard";
import SwapSheet from "@/components/SwapSheet";
import { EditorialSection } from "@/components/ui/editorial-section";
import { Check } from "lucide-react";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";
type StatusTone = "done" | "active" | "queued";

interface MealItem {
  type: MealType;
  time: string;
  name: string;
  category: string;
  isNew?: boolean;
  score: Score;
  prep: string;
  status: { label: string; tone: StatusTone };
}

const MEALS: MealItem[] = [
  {
    type: "DÉJEUNER", time: "7H",
    name: "Smoothie bowl mangue-kefir-granola",
    category: "Végétarien", score: "A", prep: "10 min",
    status: { label: "Terminé", tone: "done" },
  },
  {
    type: "DÎNER", time: "12H",
    name: "Bol coréen bibimbap végétarien",
    category: "Végétarien", score: "A", prep: "25 min",
    status: { label: "Dans 2h30", tone: "active" },
  },
  {
    type: "SOUPER", time: "15H30",
    name: "Soupe miso riz edamames",
    category: "Végétarien", score: "A", prep: "12 min",
    status: { label: "Ce soir — avant 15h30", tone: "queued" },
  },
];

type TimelineKind = "meal" | "event";
interface TimelineItem {
  time: string;
  hour: number;
  label: string;
  kind: TimelineKind;
  done?: boolean;
}

const TIMELINE: TimelineItem[] = [
  { time: "7h", hour: 7, label: "Déjeuner", kind: "meal", done: true },
  { time: "12h", hour: 12, label: "Dîner", kind: "meal" },
  { time: "13h", hour: 13, label: "IFT-2008", kind: "event" },
  { time: "15h30", hour: 15.5, label: "Souper", kind: "meal" },
  { time: "18h", hour: 18, label: "Examen IFT-2008", kind: "event" },
];

const TL_START = 7;
const TL_END = 20;
const pct = (h: number) =>
  Math.max(0, Math.min(100, ((h - TL_START) / (TL_END - TL_START)) * 100));

const Aujourdhui = () => {
  const navigate = useNavigate();
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 6 && h < 10) return "Bonjour — voici ta journée";
    if (h >= 10 && h < 13) return "Bonne matinée — ton dîner approche";
    if (h >= 13 && h < 17) return "Bon après-midi — pense à ton souper";
    if (h >= 17 && h < 21) return "Ce soir, avant de commencer";
    return "Bonne soirée — demain est planifié";
  })();

  const completed = MEALS.filter((m) => m.status.tone === "done").length;
  const subtitle =
    completed === MEALS.length
      ? "Journée complétée — bravo"
      : `${completed} repas sur ${MEALS.length} complétés — il te reste ${
          MEALS.length - completed === 1 ? "le souper" : `${MEALS.length - completed} repas`
        }`;

  const now = new Date();
  const nowHour = now.getHours() + now.getMinutes() / 60;
  const nowPct = pct(nowHour);
  const nowLabel =
    nowHour < TL_START
      ? "Bientôt"
      : nowHour > TL_END
      ? "Journée terminée"
      : `Maintenant · ${now.getHours()}h${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col pb-6 bg-canvas-gradient px-5 min-h-screen">
      {/* Header éditorial */}
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-display-xl text-foreground">
          {greeting}
        </h1>
        <p className="text-[14px] text-foreground/60 mt-1">{subtitle}</p>
      </header>

      {/* Banner proactif */}
      <div
        className="mx-4 mt-4 rounded-[var(--radius-card)] p-4 shadow-float bg-white"
      >
        <p className="text-[10px] uppercase tracking-wide font-semibold text-accent">
          ▸ EXAMEN IFT-2008 · DANS 45 MIN
        </p>
        <p className="font-display text-[17px] text-foreground mt-1 leading-snug">
          Ton dîner est prêt en 12 min — commence maintenant.
        </p>
        <button
          type="button"
          onClick={() => setRecipeOpen(true)}
          className="text-[13px] font-semibold text-accent mt-2 underline underline-offset-2"
        >
          Voir la recette →
        </button>
      </div>

      {/* Timeline verticale */}
      <EditorialSection eyebrow="Ta journée" className="py-4">
        <div className="bg-white rounded-xl px-5 py-5 shadow-card">
          {(() => {
            // Index where the "Now" row should be inserted
            const nowIndex = TIMELINE.findIndex((it) => it.hour > nowHour);
            const insertAt =
              nowHour < TL_START
                ? 0
                : nowHour > TL_END || nowIndex === -1
                ? TIMELINE.length
                : nowIndex;
            const showNow = true;

            const rows: Array<
              | { kind: "item"; item: TimelineItem; past: boolean }
              | { kind: "now" }
            > = [];
            TIMELINE.forEach((item, i) => {
              if (showNow && i === insertAt) rows.push({ kind: "now" });
              rows.push({ kind: "item", item, past: item.hour < nowHour });
            });
            if (showNow && insertAt === TIMELINE.length) rows.push({ kind: "now" });

            return (
              <ol className="relative">
                {/* Rail */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#E8E8E4] rounded-full" />
                {rows.map((row, idx) => {
                  if (row.kind === "now") {
                    return (
                      <li key={`now-${idx}`} className="relative flex items-center gap-3 py-2">
                        <div className="relative z-10 w-6 flex justify-center">
                          <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20" />
                        </div>
                        <div className="flex-1 h-[1.5px] bg-accent/30 rounded-full" />
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wide whitespace-nowrap">
                          {nowLabel}
                        </span>
                      </li>
                    );
                  }
                  const { item, past } = row;
                  const isEvent = item.kind === "event";
                  return (
                    <li
                      key={idx}
                      className={`relative flex items-center gap-3 py-2.5 ${
                        past && !item.done ? "opacity-55" : ""
                      }`}
                    >
                      <div className="relative z-10 w-6 flex justify-center">
                        {isEvent ? (
                          <div className="w-[12px] h-[12px] bg-primary rotate-45 rounded-[2px]" />
                        ) : item.done ? (
                          <div className="w-[16px] h-[16px] rounded-full bg-secondary flex items-center justify-center">
                            {/* DOC: strokeWidth={3} — Check sur pastille sage 16px, lisibilité petit format */}
                            <Check size={12} className="text-white" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-[14px] h-[14px] rounded-full bg-white border-2 border-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-baseline gap-2">
                        <span className="text-[10px] uppercase tracking-wide text-foreground/50 font-semibold w-12 shrink-0">
                          {item.time}
                        </span>
                        <span className="text-[14px] font-semibold text-foreground truncate">
                          {item.label}
                        </span>
                      </div>
                      {item.done && (
                        <span className="text-[11px] text-secondary font-semibold uppercase tracking-wide">
                          Terminé
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            );
          })()}
          {/* Légende */}
          <div className="flex items-center justify-center gap-4 mt-2 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-secondary" />
              <span className="text-[11px] text-foreground/60">Repas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] bg-primary rotate-45 rounded-[1px]" />
              <span className="text-[11px] text-foreground/60">Événement</span>
            </div>
          </div>
        </div>
      </EditorialSection>

      {/* Meals */}
      <div className="flex flex-col gap-3 mx-4">
        {MEALS.map((meal, i) => (
          <MealCard
            key={i}
            variant="compact"
            mealType={meal.type}
            time={meal.time}
            title={meal.name}
            category={meal.category}
            isNew={meal.isNew}
            prep={meal.prep}
            score={meal.score}
            status={meal.status}
            onClick={() => setRecipeOpen(true)}
          />
        ))}
      </div>

      {/* Quick action */}
      <button
        onClick={() => navigate("/epicerie")}
        className="mt-4 mx-4 h-12 rounded-xl border-[1.5px] border-primary text-primary text-[14px] font-semibold bg-white"
      >
        Voir l'épicerie
      </button>

      <RecipeSheet
        open={recipeOpen}
        onClose={() => setRecipeOpen(false)}
        onSwap={() => setSwapOpen(true)}
      />
      <SwapSheet
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        contextLabel="DÎNER AUJOURD'HUI"
      />
    </div>
  );
};

export default Aujourdhui;
