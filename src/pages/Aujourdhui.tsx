import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RecipeSheet from "@/components/RecipeSheet";
import MealCard from "@/components/MealCard";
import ProactiveContextBlock from "@/components/ProactiveContextBlock";
import { EditorialSection } from "@/components/ui/editorial-section";
import { Pill } from "@/components/ui/pill";

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

interface UpcomingItem {
  time: string;
  label: string;
  kind: "meal" | "class";
}

const UPCOMING: UpcomingItem[] = [
  { time: "12h", label: "Dîner", kind: "meal" },
  { time: "13h", label: "IFT-2008", kind: "class" },
];

const Aujourdhui = () => {
  const navigate = useNavigate();
  const [recipeOpen, setRecipeOpen] = useState(false);

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

      {/* Context banner */}
      <div className="mx-4 mt-4 mb-2">
        <ProactiveContextBlock
          variant="banner"
          eventTitle="Examen final IFT-2008"
          eventTime="18h"
          mealLabel="Souper"
          mealTime="15h30"
          rationale="Repas légers et digestes programmés. Énergie stable jusqu'à l'examen."
        />
      </div>

      {/* Upcoming */}
      <EditorialSection eyebrow="Prochainement" className="py-4">
        <div className="grid grid-cols-2 gap-2">
          {UPCOMING.map((item, i) => {
            const isFirst = i === 0;
            return (
              <div
                key={i}
                className="bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-2 shadow-card"
              >
                <div className="flex flex-col min-w-0">
                  <Pill variant="proactive" className="self-start mb-1">
                    {isFirst ? "Maintenant" : "Ensuite"}
                  </Pill>
                  <span className="text-[13px] font-semibold text-[#2A2D35] truncate leading-tight">
                    {item.label}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-[#2A2D35]/70 shrink-0">
                  {item.time}
                </span>
              </div>
            );
          })}
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

      {/* Locked notice */}
      <div className="mt-4 mx-4 bg-surface-paper border border-dashed border-[#E8E8E4] rounded-xl px-4 py-3 text-center">
        <p className="text-[13px] text-[#2A2D35]/60 italic">
          Pour modifier un repas, va dans l'onglet Semaine
        </p>
      </div>

      {/* Quick action */}
      <button
        onClick={() => navigate("/epicerie")}
        className="mt-4 mx-4 h-12 rounded-xl border-[1.5px] border-[#4A6670] text-[#4A6670] text-[14px] font-semibold bg-white"
      >
        Voir l'épicerie
      </button>

      <RecipeSheet open={recipeOpen} onClose={() => setRecipeOpen(false)} />
    </div>
  );
};

export default Aujourdhui;
