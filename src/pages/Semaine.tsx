import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Salad, Utensils, Calendar } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import RecipeSheet from "@/components/RecipeSheet";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";

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
      { type: "DÉJEUNER", name: "Smoothie bowl mangue-kefir-granola", category: "Végétarien", score: "A", prep: "10 min" },
      { type: "DÎNER", name: "Bol coreen bibimbap vegetarien", category: "Nouveau pour toi", score: "A", prep: "25 min", badge: "Examen IFT-2008 ce soir — repas proteines pour rester concentre", isNew: true },
      { type: "SOUPER", name: "Soupe miso riz edamames", category: "Végétarien", score: "A", prep: "12 min", badge: "Examen dans 2h — repas leger et digeste" },
    ],
  },
  {
    key: "mar", label: "Mar 18",
    meals: [
      { type: "DÉJEUNER", name: "Pancakes sarrasin-bleuets-sirop d'erable", category: "Sans viande", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Salade thai vermicelles-poulet-arachides", category: "Protéines", score: "B", prep: "20 min" },
      { type: "SOUPER", name: "Burrito bowl poulet-salsa-creme sure", category: "Protéines", score: "B", prep: "25 min", badge: "Session d'etude 6h ce soir — repas copieux avant de commencer" },
    ],
  },
  {
    key: "mer", label: "Mer 19",
    meals: [
      { type: "DÉJEUNER", name: "Acai bowl amandes-banane-noix de coco", category: "Nouveau pour toi", score: "A", prep: "8 min", isNew: true },
      { type: "DÎNER", name: "Poke bowl thon-mangue-avocat", category: "Omega-3", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Cari pois chiches-epinards-lait de coco", category: "Végétarien", score: "A", prep: "30 min", badge: "Travail d'equipe IFT-2007 a 17h — souper avant 16h30" },
    ],
  },
  {
    key: "jeu", label: "Jeu 20",
    meals: [
      { type: "DÉJEUNER", name: "Oeufs benedictine vege sur muffin anglais", category: "Protéines", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Ramen vegetarien bouillon miso", category: "Végétarien", score: "B", prep: "25 min" },
      { type: "SOUPER", name: "Tacos haricots noirs-mais-salsa verde", category: "Végétarien", score: "B", prep: "20 min" },
    ],
  },
  {
    key: "ven", label: "Ven 21",
    meals: [
      { type: "DÉJEUNER", name: "French toast cannelle-compote de pommes", category: "Sans viande", score: "B", prep: "15 min", badge: "Examen STT-1000 ce soir — bien demarrer la journee" },
      { type: "DÎNER", name: "Wrap mediterraneen falafel-tzatziki", category: "Végétarien", score: "B", prep: "15 min", badge: "Fenetre diner 30 min — repas express prevu" },
      { type: "SOUPER", name: "Bol soba-tofu-sauce tahini-concombre", category: "Végétarien", score: "A", prep: "20 min", badge: "Examen dans 2h30 — glycemie stable" },
    ],
  },
  {
    key: "sam", label: "Sam 22",
    meals: [
      { type: "DÉJEUNER", name: "Crepes sarrasin-compote-sirop d'erable", category: "Sans viande", score: "B", prep: "25 min" },
      { type: "DÎNER", name: "Buddha bowl quinoa-légumes rotis-tahini", category: "Végétarien", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Pizza maison pate mince-légumes-fromage", category: "Sans viande", score: "C", prep: "30 min" },
    ],
  },
  {
    key: "dim", label: "Dim 23",
    meals: [
      { type: "DÉJEUNER", name: "Granola maison-yogourt grec-fruits frais", category: "Végétarien", score: "A", prep: "5 min" },
      { type: "DÎNER", name: "Souvlaki poulet-légumes grilles-riz", category: "Protéines", score: "B", prep: "30 min" },
      { type: "SOUPER", name: "Soupe lentilles-légumes-pain de seigle", category: "Végétarien", score: "A", prep: "25 min" },
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
  DÉJEUNER: "DÉJEUNER",
  DÎNER: "DÎNER",
  SOUPER: "SOUPER",
};

const MealIcon = ({ type }: { type: MealType }) => {
  const Icon = type === "DÉJEUNER" ? Coffee : type === "DÎNER" ? Salad : Utensils;
  return <Icon size={28} className="text-[#4A6670] opacity-40" strokeWidth={2} />;
};

const ALTERNATIVES: Record<MealType, Meal[]> = {
  DÉJEUNER: [
    { type: "DÉJEUNER", name: "Bol acai-granola-banane", category: "Végétarien", score: "A", prep: "8 min" },
    { type: "DÉJEUNER", name: "Tartines avocat-oeuf poche", category: "Protéines", score: "B", prep: "12 min" },
    { type: "DÉJEUNER", name: "Yogourt grec-fruits-miel", category: "Végétarien", score: "A", prep: "5 min" },
  ],
  DÎNER: [
    { type: "DÎNER", name: "Riz sauté tofu-légumes-sauce gingembre", category: "Végétarien", score: "A", prep: "18 min" },
    { type: "DÎNER", name: "Salade quinoa-pois chiches-feta", category: "Végétarien", score: "A", prep: "15 min" },
    { type: "DÎNER", name: "Wrap poulet-légumes grilles", category: "Protéines", score: "B", prep: "12 min" },
  ],
  SOUPER: [
    { type: "SOUPER", name: "Pâtes pesto-tomates cerises-parmesan", category: "Végétarien", score: "B", prep: "20 min" },
    { type: "SOUPER", name: "Curry lentilles-epinards-riz basmati", category: "Végétarien", score: "A", prep: "25 min" },
    { type: "SOUPER", name: "Saumon teriyaki-edamames-riz", category: "Omega-3", score: "A", prep: "22 min" },
  ],
};

interface SwipeableMealCardProps {
  meal: Meal;
  onOpen: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeableMealCard = ({ meal, onOpen, onSwipeLeft, onSwipeRight }: SwipeableMealCardProps) => {
  const x = useMotionValue(0);
  const score = SCORE_STYLES[meal.score];

  return (
    <motion.div
      drag="x"
      style={{ x }}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) {
          onSwipeLeft();
          animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        } else if (info.offset.x > 100) {
          onSwipeRight();
          animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        } else {
          animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
      }}
      onClick={() => {
        if (Math.abs(x.get()) < 5) onOpen();
      }}
      className="bg-white rounded-2xl shadow-card cursor-pointer touch-pan-y"
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
    </motion.div>
  );
};

const Semaine = () => {
  const [activeKey, setActiveKey] = useState(DAYS[0].key);
  const [accepted, setAccepted] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [mealAlternatives, setMealAlternatives] = useState<Record<string, number>>({});
  const [dismissedHint, setDismissedHint] = useState(false);
  const navigate = useNavigate();
  const day = DAYS.find((d) => d.key === activeKey)!;

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    setTimeout(() => navigate("/epicerie"), 400);
  };

  const cycleAlt = (dayKey: string, type: MealType, dir: 1 | -1) => {
    const k = `${dayKey}-${type}`;
    setMealAlternatives((prev) => {
      const cur = prev[k] ?? 0;
      const next = (cur + dir + 3) % 3;
      return { ...prev, [k]: next };
    });
    setDismissedHint(true);
  };

  const getDisplayMeal = (dayKey: string, original: Meal): Meal => {
    const k = `${dayKey}-${original.type}`;
    const idx = mealAlternatives[k];
    if (idx === undefined) return original;
    return ALTERNATIVES[original.type][idx];
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E8E8E4] flex items-center justify-between px-4">
        <h1 className="font-display text-[20px] text-[#2A2D35] leading-none">Ma semaine</h1>
        <span className="text-[13px] text-[#2A2D35]/60">17-23 mai</span>
      </header>

      {/* Day pills */}
      <div className="bg-white pt-2 pb-4 px-4">
        <div className="flex items-center justify-between gap-2 py-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    ? "bg-[#E8F0EE] text-[#2A2D35] w-11 h-16 shadow-md ring-2 ring-[#5B8579]"
                    : "bg-[#F0F4F3] text-[#2A2D35]/60 w-10 h-14",
                )}
              >
                <span className={cn("font-display leading-none", active ? "text-[20px] font-bold" : "text-[15px]")}>
                  {num}
                </span>
                <span className={cn("mt-1 leading-none", active ? "text-[10px] font-semibold" : "text-[10px]")}>
                  {weekday}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meals */}
      <div className="pt-3 pb-2">
        {day.meals.map((original, i) => {
          const meal = getDisplayMeal(day.key, original);
          const isFirstDay = day.key === DAYS[0].key;
          const showHint = isFirstDay && i === 0 && !dismissedHint;
          return (
            <div key={i} className="w-[calc(100%-32px)] mx-4 mb-5">
              <SwipeableMealCard
                meal={meal}
                onOpen={() => setRecipeOpen(true)}
                onSwipeLeft={() => cycleAlt(day.key, original.type, 1)}
                onSwipeRight={() => cycleAlt(day.key, original.type, -1)}
              />
              {showHint && (
                <div className="text-center text-[12px] text-[#A8C5BC] mt-2">
                  ← Glisse pour decouvrir d'autres options →
                </div>
              )}
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
      <RecipeSheet open={recipeOpen} onClose={() => setRecipeOpen(false)} />
    </div>
  );
};

export default Semaine;