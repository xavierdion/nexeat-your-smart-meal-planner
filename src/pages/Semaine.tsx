import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RecipeSheet from "@/components/RecipeSheet";
import MealCard from "@/components/MealCard";
import { usePreferences } from "@/contexts/PreferencesContext";

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
      { type: "DÎNER", name: "Bol coréen bibimbap végétarien", category: "Nouveau pour toi", score: "A", prep: "25 min", badge: "Examen IFT-2008 ce soir — repas soutenu et digeste", isNew: true },
      { type: "SOUPER", name: "Soupe miso riz edamames", category: "Végétarien", score: "A", prep: "12 min", badge: "Examen dans 2h — repas léger et digeste" },
    ],
  },
  {
    key: "mar", label: "Mar 18",
    meals: [
      { type: "DÉJEUNER", name: "Pancakes sarrasin-bleuets-sirop d'érable", category: "Sans viande", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Salade thaï vermicelles-poulet-arachides", category: "Protéines", score: "B", prep: "20 min" },
      { type: "SOUPER", name: "Burrito bowl poulet-salsa-crème sure", category: "Protéines", score: "B", prep: "25 min", badge: "Session d'étude 6h ce soir — repas copieux avant de commencer" },
    ],
  },
  {
    key: "mer", label: "Mer 19",
    meals: [
      { type: "DÉJEUNER", name: "Açaï bowl amandes-banane-noix de coco", category: "Nouveau pour toi", score: "A", prep: "8 min", isNew: true },
      { type: "DÎNER", name: "Poke bowl thon-mangue-avocat", category: "Oméga-3", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Cari pois chiches-épinards-lait de coco", category: "Végétarien", score: "A", prep: "30 min", badge: "Travail d'équipe IFT-2007 à 17h — souper avant 16h30" },
    ],
  },
  {
    key: "jeu", label: "Jeu 20",
    meals: [
      { type: "DÉJEUNER", name: "Œufs bénédictine végé sur muffin anglais", category: "Protéines", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Ramen végétarien bouillon miso", category: "Végétarien", score: "B", prep: "25 min" },
      { type: "SOUPER", name: "Tacos haricots noirs-maïs-salsa verde", category: "Végétarien", score: "B", prep: "20 min" },
    ],
  },
  {
    key: "ven", label: "Ven 21",
    meals: [
      { type: "DÉJEUNER", name: "French toast cannelle-compote de pommes", category: "Sans viande", score: "B", prep: "15 min", badge: "Examen STT-1000 ce soir — bien démarrer la journée" },
      { type: "DÎNER", name: "Wrap méditerranéen falafel-tzatziki", category: "Végétarien", score: "B", prep: "15 min", badge: "Fenêtre dîner 30 min — repas express prévu" },
      { type: "SOUPER", name: "Bol soba-tofu-sauce tahini-concombre", category: "Végétarien", score: "A", prep: "20 min", badge: "Examen dans 2h30 — énergie stable" },
    ],
  },
  {
    key: "sam", label: "Sam 22",
    meals: [
      { type: "DÉJEUNER", name: "Crêpes sarrasin-compote-sirop d'érable", category: "Sans viande", score: "B", prep: "25 min" },
      { type: "DÎNER", name: "Buddha bowl quinoa-légumes rôtis-tahini", category: "Végétarien", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Pizza maison pâte mince-légumes-fromage", category: "Sans viande", score: "C", prep: "30 min" },
    ],
  },
  {
    key: "dim", label: "Dim 23",
    meals: [
      { type: "DÉJEUNER", name: "Granola maison-yogourt grec-fruits frais", category: "Végétarien", score: "A", prep: "5 min" },
      { type: "DÎNER", name: "Souvlaki poulet-légumes grillés-riz", category: "Protéines", score: "B", prep: "30 min" },
      { type: "SOUPER", name: "Soupe lentilles-légumes-pain de seigle", category: "Végétarien", score: "A", prep: "25 min" },
    ],
  },
];

const ALTERNATIVES: Record<MealType, Meal[]> = {
  DÉJEUNER: [
    { type: "DÉJEUNER", name: "Bol açaï-granola-banane", category: "Végétarien", score: "A", prep: "8 min" },
    { type: "DÉJEUNER", name: "Tartines avocat-œuf poché", category: "Protéines", score: "B", prep: "12 min" },
    { type: "DÉJEUNER", name: "Yogourt grec-fruits-miel", category: "Végétarien", score: "A", prep: "5 min" },
  ],
  DÎNER: [
    { type: "DÎNER", name: "Riz sauté tofu-légumes-sauce gingembre", category: "Végétarien", score: "A", prep: "18 min" },
    { type: "DÎNER", name: "Salade quinoa-pois chiches-feta", category: "Végétarien", score: "A", prep: "15 min" },
    { type: "DÎNER", name: "Wrap poulet-légumes grillés", category: "Protéines", score: "B", prep: "12 min" },
  ],
  SOUPER: [
    { type: "SOUPER", name: "Pâtes pesto-tomates cerises-parmesan", category: "Végétarien", score: "B", prep: "20 min" },
    { type: "SOUPER", name: "Curry lentilles-épinards-riz basmati", category: "Végétarien", score: "A", prep: "25 min" },
    { type: "SOUPER", name: "Saumon teriyaki-edamames-riz", category: "Oméga-3", score: "A", prep: "22 min" },
  ],
};

const Semaine = () => {
  const [activeKey, setActiveKey] = useState(DAYS[0].key);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [mealAlternatives, setMealAlternatives] = useState<Record<string, number>>({});
  const [dismissedHint, setDismissedHint] = useState(false);
  const navigate = useNavigate();
  const { planAccepted, setPlanAccepted } = usePreferences();
  const day = DAYS.find((d) => d.key === activeKey)!;

  const handleAccept = () => {
    if (planAccepted) return;
    setPlanAccepted(true);
    toast("Plan accepté pour la semaine", {
      description: "Rendez-vous dimanche prochain",
      duration: 5000,
      style: { background: "#4A6670", color: "#fff", border: "none" },
      action: {
        label: "Annuler",
        onClick: () => setPlanAccepted(false),
      },
    });
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

  const dayHasContext = day.meals.some((m) => m.badge);
  const contextMeal = day.meals.find((m) => m.badge);

  return (
    <div className="flex flex-col">
      {/* Header éditorial */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-[#E8E8E4]">
        <p className="text-eyebrow uppercase text-[#4A6670]/70">
          MA SEMAINE · 17–23 MAI
        </p>
        <h1 className="font-display text-display-xl text-[#2A2D35] mt-1">
          Cette semaine, mangé bien
        </h1>
        <p className="text-[14px] text-[#2A2D35]/60 mt-1">
          21 repas alignés sur tes cours et examens
        </p>
      </header>

      {/* Day pills */}
      <div className="bg-white px-3 pb-4">
        <div className="flex items-center justify-between gap-2 pt-3">
          {DAYS.map((d) => {
            const active = d.key === activeKey;
            const [weekday, num] = d.label.split(" ");
            return (
              <button
                key={d.key}
                onClick={() => setActiveKey(d.key)}
                className={cn(
                  "shrink-0 flex flex-col items-center justify-center rounded-full transition-all duration-200",
                  active
                    ? "bg-[#4A6670] w-12 h-16"
                    : "bg-[#F0F4F3] w-10 h-14",
                )}
              >
                <span
                  className={cn(
                    "font-display leading-none",
                    active
                      ? "text-[20px] font-bold text-white"
                      : "text-[15px] text-[#2A2D35]/60",
                  )}
                >
                  {num}
                </span>
                <span
                  className={cn(
                    "uppercase mt-1 leading-none text-[10px]",
                    active ? "text-white/80 font-semibold" : "text-[#2A2D35]/50",
                  )}
                >
                  {weekday}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day context strip */}
      <div
        className={cn(
          "mx-4 rounded-xl px-4 py-3 mt-4",
          dayHasContext ? "bg-surface-cool" : "bg-surface-warm",
        )}
      >
        {dayHasContext ? (
          <>
            <p className="text-[11px] uppercase tracking-wide font-semibold text-[#E07A5F]">
              Aujourd'hui en contexte
            </p>
            <p className="text-[13px] text-[#2A2D35] mt-1 leading-relaxed">
              {contextMeal?.badge}. Tes {day.meals.length} repas sont optimisés
              pour une énergie stable.
            </p>
          </>
        ) : (
          <>
            <p className="text-eyebrow uppercase text-[#4A6670]/70">
              Journée standard
            </p>
            <p className="text-[13px] text-[#2A2D35] mt-1 leading-relaxed">
              Aucun examen ou deadline détecté. Plan équilibré.
            </p>
          </>
        )}
      </div>

      {/* Meals */}
      <div className="pt-5 pb-2 px-4">
        {day.meals.map((original, i) => {
          const meal = getDisplayMeal(day.key, original);
          const isFirstDay = day.key === DAYS[0].key;
          const showHint = isFirstDay && i === 0 && !dismissedHint;
          return (
            <div key={i}>
              <MealCard
                variant="full"
                draggable
                mealType={meal.type}
                title={meal.name}
                category={meal.category}
                isNew={meal.isNew}
                prep={meal.prep}
                score={meal.score}
                proactiveContext={meal.badge}
                onClick={() => setRecipeOpen(true)}
                onSwipeLeft={() => cycleAlt(day.key, original.type, 1)}
                onSwipeRight={() => cycleAlt(day.key, original.type, -1)}
              />
              {showHint && (
                <div className="text-center text-[12px] text-[#A8C5BC] -mt-3 mb-5">
                  ← Glisse pour découvrir d'autres options →
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
            planAccepted
              ? "bg-[#A8C5BC] cursor-default"
              : "bg-[#E07A5F] shadow-[0_4px_16px_rgba(224,122,95,0.25)]",
          )}
        >
          {planAccepted ? "Plan accepté ✓" : "Tout accepter ce plan"}
        </button>
        {planAccepted && (
          <button
            onClick={() => navigate("/epicerie")}
            className="mt-2 w-full h-12 rounded-xl border-[1.5px] border-[#4A6670] bg-white text-[#4A6670] font-semibold text-[15px]"
          >
            Voir l'épicerie →
          </button>
        )}
      </div>
      <div className={cn(planAccepted ? "h-40" : "h-24")} aria-hidden />
      <RecipeSheet open={recipeOpen} onClose={() => setRecipeOpen(false)} />
    </div>
  );
};

export default Semaine;
