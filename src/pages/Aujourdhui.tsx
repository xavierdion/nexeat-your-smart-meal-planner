import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar, Coffee, Salad, Utensils, BookOpen, ChevronRight } from "lucide-react";
import RecipeSheet from "@/components/RecipeSheet";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DEJEUNER" | "DINER" | "SOUPER";

const SCORE_STYLES: Record<Score, { bg: string; text: string }> = {
  A: { bg: "#3E8B3E", text: "#FFFFFF" },
  B: { bg: "#85BB2F", text: "#FFFFFF" },
  C: { bg: "#FFCC00", text: "#2A2D35" },
  D: { bg: "#EE8100", text: "#FFFFFF" },
  E: { bg: "#E63312", text: "#FFFFFF" },
};

interface MealCard {
  type: MealType;
  time: string;
  name: string;
  category: string;
  score: Score;
  prep: string;
  status: { label: string; bg: string; text: string };
}

const MEALS: MealCard[] = [
  {
    type: "DEJEUNER", time: "7H",
    name: "Smoothie bowl mangue-kefir-granola",
    category: "Vegetarien", score: "A", prep: "10 min",
    status: { label: "Termine", bg: "#A8C5BC", text: "#FFFFFF" },
  },
  {
    type: "DINER", time: "12H",
    name: "Bol coreen bibimbap vegetarien",
    category: "Vegetarien", score: "A", prep: "25 min",
    status: { label: "Dans 2h30", bg: "#E07A5F", text: "#FFFFFF" },
  },
  {
    type: "SOUPER", time: "15H30",
    name: "Soupe miso riz edamames",
    category: "Vegetarien", score: "A", prep: "12 min",
    status: { label: "Ce soir — avant 15h30", bg: "#E8E8E4", text: "rgba(42,45,53,0.6)" },
  },
];

const MealIcon = ({ type }: { type: MealType }) => {
  const Icon = type === "DEJEUNER" ? Coffee : type === "DINER" ? Salad : Utensils;
  return <Icon size={24} className="text-[#4A6670] opacity-40" strokeWidth={2} />;
};

interface UpcomingItem {
  time: string;
  label: string;
  kind: "meal" | "class";
  icon?: MealType;
}

const UPCOMING: UpcomingItem[] = [
  { time: "12h", label: "Diner", kind: "meal", icon: "DINER" },
  { time: "13h", label: "IFT-2008", kind: "class" },
  { time: "15h30", label: "Souper", kind: "meal", icon: "SOUPER" },
  { time: "18h", label: "Examen IFT-2008", kind: "class" },
];

const Aujourdhui = () => {
  const navigate = useNavigate();
  const [recipeOpen, setRecipeOpen] = useState(false);

  return (
    <div className="px-4 pt-2 pb-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-[22px] text-[#2A2D35] leading-tight">{(() => {
          const h = new Date().getHours();
          if (h >= 6 && h < 10) return "Bonjour — voici ta journee";
          if (h >= 10 && h < 13) return "Bonne matinee — ton diner approche";
          if (h >= 13 && h < 17) return "Bon apres-midi — pense a ton souper";
          if (h >= 17 && h < 21) return "Ce soir, avant de commencer";
          return "Bonne soiree — demain est planifie";
        })()}</h1>
        <p className="text-[14px] text-[#2A2D35]/60 mt-1">Lundi 17 mai — Aujourd'hui</p>
      </div>

      {/* Upcoming */}
      <div className="mt-4 bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] uppercase font-semibold text-[#2A2D35]/50 tracking-wide">
            A venir
          </span>
          <span className="text-[11px] text-[#2A2D35]/50">Prochaines heures</span>
        </div>

        <div className="flex items-stretch gap-1 overflow-x-auto -mx-4 px-4 pb-1">
          {UPCOMING.map((item, i) => {
            const isMeal = item.kind === "meal";
            const isFirst = i === 0;
            return (
              <div key={i} className="flex items-center gap-1 shrink-0">
                <div className="flex flex-col items-center shrink-0 w-[88px]">
                  {isFirst ? (
                    <span className="text-[10px] font-semibold text-[#E07A5F] mb-1 uppercase tracking-wide">
                      Prochain
                    </span>
                  ) : (
                    <span className="h-[14px] mb-1" />
                  )}
                  <div
                    className={
                      "w-full rounded-xl px-2 py-3 flex flex-col items-center gap-1 " +
                      (isMeal
                        ? "bg-[#A8C5BC]/40 "
                        : "bg-[#FEF0ED] border border-[#E07A5F]/20 ") +
                      (isFirst ? "ring-2 ring-[#E07A5F]" : "")
                    }
                  >
                    <span className="text-[11px] font-semibold text-[#2A2D35]/70">
                      {item.time}
                    </span>
                    {isMeal && item.icon ? (
                      <MealIcon type={item.icon} />
                    ) : (
                      <BookOpen size={22} className="text-[#E07A5F]" strokeWidth={2} />
                    )}
                    <span className="text-[11px] font-semibold text-[#2A2D35] text-center leading-tight truncate w-full">
                      {item.label}
                    </span>
                  </div>
                </div>
                {i < UPCOMING.length - 1 && (
                  <ChevronRight size={16} className="text-[#2A2D35]/30 shrink-0 mt-3" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Context banner */}
      <div className="mt-4 bg-[#4A6670] rounded-2xl p-4 flex items-start gap-3">
        <Calendar size={20} className="text-white shrink-0 mt-[2px]" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white">
            Examen final IFT-2008 a 18h ce soir
          </p>
          <p className="text-[12px] text-white/70 mt-1">
            Repas energie stable programmes pour toi aujourd'hui
          </p>
        </div>
      </div>

      {/* Meals */}
      <p className="mt-4 mb-2 text-[12px] text-[#A8C5BC] font-normal">
        2 repas sur 3 completes aujourd'hui
      </p>
      <div className="flex flex-col gap-3">
        {MEALS.map((meal, i) => {
          const score = SCORE_STYLES[meal.score];
          return (
            <button
              key={i}
              onClick={() => setRecipeOpen(true)}
              className="bg-white rounded-2xl shadow-card p-4 text-left w-full"
            >
              <span className="inline-block text-[11px] bg-[#F0F4F3] text-[#4A6670] rounded-md px-2.5 py-[3px]">
                {meal.category}
              </span>
              <div className="mt-2 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-[#2A2D35]/50">
                    {meal.type === "DEJEUNER" ? "Dejeuner" : meal.type === "DINER" ? "Diner" : "Souper"} · {meal.time}
                  </div>
                  <div className="font-display text-[17px] text-[#2A2D35] leading-snug mt-0.5">
                    {meal.name}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-xl bg-[#F0F4F3] flex items-center justify-center shrink-0">
                  <MealIcon type={meal.type} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-[#2A2D35]/60">{meal.prep}</span>
                  <span
                    className="text-[11px] font-semibold rounded-md px-[7px] py-[3px]"
                    style={{ background: score.bg, color: score.text }}
                  >
                    {meal.score}
                  </span>
                </div>
                <span
                  className="text-[11px] rounded-md px-2 py-[3px]"
                  style={{ background: meal.status.bg, color: meal.status.text }}
                >
                  {meal.status.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[12px] text-[#2A2D35]/50 px-1">
        Souper avance avant l'examen de 18h
      </p>

      {/* Locked notice */}
      <div className="mt-4 bg-[#F5F5F0] border-[1.5px] border-dashed border-[#E8E8E4] rounded-xl px-4 py-[14px] text-center">
        <p className="text-[13px] text-[#2A2D35]/60">
          Pour modifier un repas, va dans l'onglet Semaine
        </p>
      </div>

      {/* Quick action */}
      <button
        onClick={() => navigate("/epicerie")}
        className="mt-4 w-full h-11 rounded-xl border-[1.5px] border-[#4A6670] text-[#4A6670] text-[14px] font-semibold bg-transparent"
      >
        Voir l'epicerie
      </button>

      <RecipeSheet open={recipeOpen} onClose={() => setRecipeOpen(false)} />
    </div>
  );
};

export default Aujourdhui;
