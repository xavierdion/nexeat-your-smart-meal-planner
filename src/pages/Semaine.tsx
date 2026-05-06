import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Salad, Utensils, Shuffle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import SwapSheet from "@/components/SwapSheet";
import RecipeSheet from "@/components/RecipeSheet";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DEJEUNER" | "DINER" | "SOUPER";

interface Meal {
  type: MealType;
  name: string;
  category: string;
  score: Score;
  prep: string;
  badge?: string;
  isNew?: boolean;
}

interface Day {
  key: string;
  label: string;
  meals: Meal[];
}

const DAYS: Day[] = [
  {
    key: "lun", label: "Lun 17",
    meals: [
      { type: "DEJEUNER", name: "Smoothie bowl mangue-kefir-granola", category: "Vegetarien", score: "A", prep: "10 min" },
      { type: "DINER", name: "Bol coreen bibimbap vegetarien", category: "Nouveau pour toi", score: "A", prep: "25 min", badge: "Examen IFT-2008 ce soir — repas proteines pour rester concentre", isNew: true },
      { type: "SOUPER", name: "Soupe miso riz edamames", category: "Vegetarien", score: "A", prep: "12 min", badge: "Examen dans 2h — repas leger et digeste" },
    ],
  },
  {
    key: "mar", label: "Mar 18",
    meals: [
      { type: "DEJEUNER", name: "Pancakes sarrasin-bleuets-sirop d'erable", category: "Sans viande", score: "B", prep: "20 min" },
      { type: "DINER", name: "Salade thai vermicelles-poulet-arachides", category: "Proteines", score: "B", prep: "20 min" },
      { type: "SOUPER", name: "Burrito bowl poulet-salsa-creme sure", category: "Proteines", score: "B", prep: "25 min", badge: "Session d'etude 6h ce soir — repas copieux avant de commencer" },
    ],
  },
  {
    key: "mer", label: "Mer 19",
    meals: [
      { type: "DEJEUNER", name: "Acai bowl amandes-banane-noix de coco", category: "Nouveau pour toi", score: "A", prep: "8 min", isNew: true },
      { type: "DINER", name: "Poke bowl thon-mangue-avocat", category: "Omega-3", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Cari pois chiches-epinards-lait de coco", category: "Vegetarien", score: "A", prep: "30 min", badge: "Travail d'equipe IFT-2007 a 17h — souper avant 16h30" },
    ],
  },
  {
    key: "jeu", label: "Jeu 20",
    meals: [
      { type: "DEJEUNER", name: "Oeufs benedictine vege sur muffin anglais", category: "Proteines", score: "B", prep: "20 min" },
      { type: "DINER", name: "Ramen vegetarien bouillon miso", category: "Vegetarien", score: "B", prep: "25 min" },
      { type: "SOUPER", name: "Tacos haricots noirs-mais-salsa verde", category: "Vegetarien", score: "B", prep: "20 min" },
    ],
  },
  {
    key: "ven", label: "Ven 21",
    meals: [
      { type: "DEJEUNER", name: "French toast cannelle-compote de pommes", category: "Sans viande", score: "B", prep: "15 min", badge: "Examen STT-1000 ce soir — bien demarrer la journee" },
      { type: "DINER", name: "Wrap mediterraneen falafel-tzatziki", category: "Vegetarien", score: "B", prep: "15 min", badge: "Fenetre diner 30 min — repas express prevu" },
      { type: "SOUPER", name: "Bol soba-tofu-sauce tahini-concombre", category: "Vegetarien", score: "A", prep: "20 min", badge: "Examen dans 2h30 — glycemie stable" },
    ],
  },
  {
    key: "sam", label: "Sam 22",
    meals: [
      { type: "DEJEUNER", name: "Crepes sarrasin-compote-sirop d'erable", category: "Sans viande", score: "B", prep: "25 min" },
      { type: "DINER", name: "Buddha bowl quinoa-legumes rotis-tahini", category: "Vegetarien", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Pizza maison pate mince-legumes-fromage", category: "Sans viande", score: "C", prep: "30 min" },
    ],
  },
  {
    key: "dim", label: "Dim 23",
    meals: [
      { type: "DEJEUNER", name: "Granola maison-yogourt grec-fruits frais", category: "Vegetarien", score: "A", prep: "5 min" },
      { type: "DINER", name: "Souvlaki poulet-legumes grilles-riz", category: "Proteines", score: "B", prep: "30 min" },
      { type: "SOUPER", name: "Soupe lentilles-legumes-pain de seigle", category: "Vegetarien", score: "A", prep: "25 min" },
    ],
  },
];

const SCORE_STYLES: Record<Score, { bg: string; text: string }> = {
  A: { bg: "#3E8B3E", text: "#FFFFFF" },
  B: { bg: "#85BB2F", text: "#FFFFFF" },
  C: { bg: "#FFCC00", text: "#2A2D35" },
  D: { bg: "#EE8100", text: "#FFFFFF" },
  E: { bg: "#E63312", text: "#FFFFFF" },
};

const MEAL_LABEL: Record<MealType, string> = {
  DEJEUNER: "DEJEUNER",
  DINER: "DINER",
  SOUPER: "SOUPER",
};

const MealIcon = ({ type }: { type: MealType }) => {
  const Icon = type === "DEJEUNER" ? Coffee : type === "DINER" ? Salad : Utensils;
  return <Icon size={28} className="text-[#4A6670] opacity-40" strokeWidth={2} />;
};

const Semaine = () => {
  const [activeKey, setActiveKey] = useState(DAYS[0].key);
  const [accepted, setAccepted] = useState(false);
  const [swapMeal, setSwapMeal] = useState<{ type: MealType; dayLabel: string } | null>(null);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const navigate = useNavigate();
  const day = DAYS.find((d) => d.key === activeKey)!;

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    setTimeout(() => navigate("/epicerie"), 400);
  };

  return (
    <div className="-mt-11 flex flex-col">
      {/* Curved hero header */}
      <div className="sticky top-0 z-30 -mx-0">
        <div className="relative pt-6 pb-4 px-4 bg-[#4A6670]">
          <div className="flex items-center justify-center relative h-9">
            <h1 className="font-display text-[20px] text-white leading-none">Ma semaine</h1>
            <span className="absolute right-0 text-[12px] text-white/70">17-23 mai</span>
          </div>

          {/* Day pills */}
          <div className="mt-5 flex items-center justify-between gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {DAYS.map((d) => {
              const active = d.key === activeKey;
              const [weekday, num] = d.label.split(" ");
              return (
                <button
                  key={d.key}
                  onClick={() => setActiveKey(d.key)}
                  className={cn(
                    "shrink-0 flex flex-col items-center justify-center rounded-full transition-all",
                    active
                      ? "bg-white text-[#4A6670] w-12 h-14"
                      : "bg-white/10 text-white/80 w-11 h-12",
                  )}
                >
                  <span className={cn("font-display leading-none", active ? "text-[18px]" : "text-[15px]")}>
                    {num}
                  </span>
                  <span className={cn("mt-1 leading-none", active ? "text-[10px] font-semibold" : "text-[10px] opacity-80")}>
                    {weekday}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="pt-3 pb-2">
        {day.meals.map((meal, i) => {
          const score = SCORE_STYLES[meal.score];
          return (
            <div
              key={i}
              className="relative w-[calc(100%-32px)] mx-4 mb-5 bg-white rounded-2xl shadow-card"
            >
              <button
                type="button"
                onClick={() => setRecipeOpen(true)}
                className="block w-full text-left rounded-2xl overflow-hidden"
              >
              <div className="p-4">
                <span
                  className="inline-block rounded-md"
                  style={
                    meal.isNew
                      ? { background: "#FEF0ED", color: "#E07A5F", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px" }
                      : { background: "#F0F4F3", color: "#4A6670", fontSize: "11px", padding: "3px 10px", borderRadius: "6px" }
                  }
                >
                  {meal.category}
                </span>
                {meal.badge && (
                  <div
                    className="flex items-start gap-2 mt-2"
                    style={{
                      background: "#FEF0ED",
                      color: "#E07A5F",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    <Calendar size={14} strokeWidth={2} className="shrink-0 mt-0.5" />
                    <span>{meal.badge}</span>
                  </div>
                )}
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase tracking-wide text-[#2A2D35]/50">
                      {MEAL_LABEL[meal.type]}
                    </div>
                    <div className="font-display text-[17px] text-[#2A2D35] leading-snug mt-0.5">
                      {meal.name}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-[#F0F4F3] flex items-center justify-center shrink-0">
                    <MealIcon type={meal.type} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[13px] text-[#2A2D35]/60">{meal.prep}</span>
                  <span className="text-[11px] text-[#2A2D35]/50 ml-auto">Nutri-Score</span>
                  <span
                    className="text-[11px] font-semibold rounded-md px-[7px] py-[3px]"
                    style={{ background: score.bg, color: score.text }}
                  >
                    {meal.score}
                  </span>
                </div>
              </div>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSwapMeal({ type: meal.type, dayLabel: day.label });
                }}
                aria-label="Changer ce repas"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-card border border-[#E8E8E4] flex items-center justify-center"
              >
                <Shuffle size={16} className="text-[#4A6670]" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sticky CTA above bottom nav (h-16) */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 py-3 bg-background z-40">
        <button
          onClick={handleAccept}
          className={cn(
            "w-full h-[52px] rounded-xl text-white text-[16px] font-semibold transition-colors duration-300",
            accepted ? "bg-[#A8C5BC]" : "bg-[#E07A5F]",
          )}
        >
          {accepted ? "Plan accepte" : "Tout accepter ce plan"}
        </button>
      </div>
      <div className="h-24" aria-hidden />
      <SwapSheet
        open={!!swapMeal}
        onClose={() => setSwapMeal(null)}
        contextLabel={swapMeal ? `${swapMeal.type} ${swapMeal.dayLabel.toUpperCase()}` : ""}
      />
      <RecipeSheet open={recipeOpen} onClose={() => setRecipeOpen(false)} />
    </div>
  );
};

export default Semaine;