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
    <div className="flex flex-col pb-6 bg-surface-warm min-h-full">
      {/* Header éditorial */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-[#E8E8E4]">
        <p className="text-eyebrow uppercase text-[#4A6670]/70">LUNDI 17 MAI</p>
        <h1 className="font-display text-display-xl text-[#2A2D35] mt-1">
          {greeting}
        </h1>
        <p className="text-[14px] text-[#2A2D35]/60 mt-1">{subtitle}</p>
      </header>

      {/* Timeline horaire */}
      <EditorialSection eyebrow="Ta journée" className="py-4">
        <div className="bg-white rounded-xl px-4 pt-6 pb-5 shadow-card">
          <div className="relative h-[110px]">
            {/* Rail */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E8E8E4] rounded-full" />
            {/* Progress fill */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#E07A5F]/40 rounded-full"
              style={{ width: `${nowPct}%` }}
            />
            {/* Items */}
            {TIMELINE.map((item, i) => {
              const left = pct(item.hour);
              const past = item.hour < nowHour;
              const isEvent = item.kind === "event";
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${left}%` }}
                >
                  {/* Label above */}
                  <div className={`absolute bottom-[18px] flex flex-col items-center ${past && !item.done ? "opacity-50" : ""}`}>
                    <span className="text-[10px] uppercase tracking-wide text-[#2A2D35]/50 font-semibold leading-none">
                      {item.time}
                    </span>
                    <span className="text-[11px] font-semibold text-[#2A2D35] leading-tight whitespace-nowrap mt-0.5 max-w-[80px] truncate">
                      {item.label}
                    </span>
                  </div>
                  {/* Marker */}
                  {isEvent ? (
                    <div className="w-[12px] h-[12px] bg-[#E07A5F] rotate-45 rounded-[2px]" />
                  ) : item.done ? (
                    <div className="w-[14px] h-[14px] rounded-full bg-[#A8C5BC] flex items-center justify-center">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-[12px] h-[12px] rounded-full bg-white border-2 border-[#4A6670]" />
                  )}
                </div>
              );
            })}
            {/* Now indicator */}
            {nowHour >= TL_START && nowHour <= TL_END && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-10"
                style={{ left: `${nowPct}%` }}
              >
                <div className="w-[16px] h-[16px] rounded-full bg-[#E07A5F] ring-4 ring-[#E07A5F]/20" />
                <span className="absolute top-[20px] text-[10px] font-bold text-[#E07A5F] uppercase tracking-wide whitespace-nowrap">
                  {nowLabel}
                </span>
              </div>
            )}
          </div>
          {/* Légende */}
          <div className="flex items-center justify-center gap-4 mt-2 pt-3 border-t border-[#E8E8E4]">
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] rounded-full bg-[#A8C5BC]" />
              <span className="text-[11px] text-[#2A2D35]/60">Repas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] bg-[#E07A5F] rotate-45 rounded-[1px]" />
              <span className="text-[11px] text-[#2A2D35]/60">Événement</span>
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
        className="mt-4 mx-4 h-12 rounded-xl border-[1.5px] border-[#4A6670] text-[#4A6670] text-[14px] font-semibold bg-white"
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
