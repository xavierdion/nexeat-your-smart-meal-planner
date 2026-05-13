import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RecipeSheet from "@/components/RecipeSheet";
import MealCard from "@/components/MealCard";
import SwapSheet from "@/components/SwapSheet";
import ProactiveContextBlock from "@/components/ProactiveContextBlock";
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
  batchId?: string;
  batchPortions?: number;
  restOf?: { batchId: string; name: string };
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
      { type: "SOUPER", name: "Soupe thaï aux lentilles", category: "Végétarien", score: "A", prep: "35 min", badge: "Examen dans 2h — repas léger et digeste", batchId: "thai", batchPortions: 4 },
    ],
  },
  {
    key: "mar", label: "Mar 18",
    meals: [
      { type: "DÉJEUNER", name: "Pancakes sarrasin-bleuets-sirop d'érable", category: "Sans viande", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Soupe thaï aux lentilles", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "thai", name: "Soupe thaï aux lentilles" } },
      { type: "SOUPER", name: "Burrito bowl poulet-salsa-crème sure", category: "Protéines", score: "B", prep: "25 min", badge: "Session d'étude 6h ce soir — repas copieux avant de commencer" },
    ],
  },
  {
    key: "mer", label: "Mer 19",
    meals: [
      { type: "DÉJEUNER", name: "Açaï bowl amandes-banane-noix de coco", category: "Nouveau pour toi", score: "A", prep: "8 min", isNew: true },
      { type: "DÎNER", name: "Soupe thaï aux lentilles", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "thai", name: "Soupe thaï aux lentilles" } },
      { type: "SOUPER", name: "Cari pois chiches-épinards-lait de coco", category: "Végétarien", score: "A", prep: "30 min", badge: "Travail d'équipe IFT-2007 à 17h — souper avant 16h30" },
    ],
  },
  {
    key: "jeu", label: "Jeu 20",
    meals: [
      { type: "DÉJEUNER", name: "Œufs bénédictine végé sur muffin anglais", category: "Protéines", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Ramen végétarien bouillon miso", category: "Végétarien", score: "B", prep: "25 min" },
      { type: "SOUPER", name: "Dal de lentilles corail", category: "Végétarien", score: "A", prep: "30 min", batchId: "dal", batchPortions: 2 },
    ],
  },
  {
    key: "ven", label: "Ven 21",
    meals: [
      { type: "DÉJEUNER", name: "French toast cannelle-compote de pommes", category: "Sans viande", score: "B", prep: "15 min", badge: "Examen STT-1000 ce soir — bien démarrer la journée" },
      { type: "DÎNER", name: "Dal de lentilles corail", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "dal", name: "Dal de lentilles corail" } },
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

const TODAY_KEY = "lun";
const COMPLETED_DAY_KEYS: string[] = [];

// Mocked weekly calendar event count (≥3 → busy week)
const WEEK_EVENT_COUNT = 4;

const Semaine = () => {
  const [activeKey, setActiveKey] = useState(DAYS[0].key);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [mealAlternatives, setMealAlternatives] = useState<Record<string, number>>({});
  const [dismissedHint, setDismissedHint] = useState(false);
  const [removedRestes, setRemovedRestes] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { planAccepted, setPlanAccepted } = usePreferences();
  const day = DAYS.find((d) => d.key === activeKey)!;

  const TOTAL_MEALS = 21;
  const confirmedMeals = planAccepted ? TOTAL_MEALS : 14;
  const progressPct = (confirmedMeals / TOTAL_MEALS) * 100;
  const busyWeek = WEEK_EVENT_COUNT >= 3;

  const removeReste = (dayKey: string, idx: number) => {
    setRemovedRestes((prev) => {
      const next = new Set(prev);
      next.add(`${dayKey}-${idx}`);
      return next;
    });
    toast("Reste retiré du plan", {
      duration: 2000,
      style: { background: "#2A2D35", color: "#fff", border: "none" },
    });
  };

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

  const visibleMeals = day.meals
    .map((m, i) => ({ meal: m, idx: i }))
    .filter(({ idx }) => !removedRestes.has(`${day.key}-${idx}`));

  // Identify connection line range within the active day (source → last reste of same batch)
  const batchInDay = (() => {
    const source = visibleMeals.find((v) => v.meal.batchId);
    if (!source) return null;
    const lastReste = [...visibleMeals]
      .reverse()
      .find((v) => v.meal.restOf?.batchId === source.meal.batchId);
    if (!lastReste) return null;
    const sourcePos = visibleMeals.indexOf(source);
    const lastPos = visibleMeals.indexOf(lastReste);
    return sourcePos < lastPos ? { sourcePos, lastPos } : null;
  })();

  return (
    <div className="flex flex-col">
      {/* Header éditorial v2 — The Week As A Spread */}
      <header className="bg-background px-5 pt-6 pb-5">
        <p className="font-mono text-kicker-mono uppercase text-mute">
          SEM. 21 · 17 — 23 MAI
        </p>
        <h1 className="font-display text-display-3xl italic text-ink mt-1.5">
          Semaine.
        </h1>
        <p className="text-[13px] text-primary mt-4 leading-[1.55]">
          {TOTAL_MEALS} repas planifiés.{" "}
          <span className="text-accent font-medium">
            {DAYS.reduce((n, d) => n + d.meals.filter((m) => m.badge).length, 0)} ajustements proactifs
          </span>{" "}
          pour ta semaine.
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
                    ? "bg-primary w-12 h-16"
                    : "bg-secondary/15 min-w-[44px] w-11 h-14",
                )}
              >
                <span
                  className={cn(
                    "font-display leading-none",
                    active
                      ? "text-[20px] font-bold text-white"
                      : "text-[15px] text-foreground/60",
                  )}
                >
                  {num}
                </span>
                <span
                  className={cn(
                    "uppercase mt-1 leading-none text-[10px]",
                    active ? "text-white/80 font-semibold" : "text-foreground/50",
                  )}
                >
                  {weekday}
                </span>
                {(d.key === TODAY_KEY || COMPLETED_DAY_KEYS.includes(d.key)) && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {d.key === TODAY_KEY && (
                      <span
                        className={cn(
                          "w-1 h-1 rounded-full",
                          active ? "bg-white/80" : "bg-accent",
                        )}
                      />
                    )}
                    {COMPLETED_DAY_KEYS.includes(d.key) && (
                      <span
                        className={cn(
                          "w-1 h-1 rounded-full",
                          active ? "bg-white/80" : "bg-secondary",
                        )}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress bar — sous les day pills */}
      <div className="px-4 mt-3 flex items-center gap-2">
        <div className="flex-1 h-[3px] rounded-full bg-secondary/30 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-[11px] text-foreground/50 whitespace-nowrap">
          {confirmedMeals}/{TOTAL_MEALS}
        </span>
      </div>

      {/* Day context strip */}
      {dayHasContext && (
        <div className="mx-4 rounded-xl px-4 py-3 mt-4 bg-surface-cool">
          <p className="text-[11px] uppercase tracking-wide font-semibold text-accent">
            Aujourd'hui en contexte
          </p>
          <p className="text-[13px] text-foreground mt-1 leading-relaxed">
            {contextMeal?.badge}. Tes {day.meals.length} repas sont optimisés
            pour une énergie stable.
          </p>
          {busyWeek && (
            <span className="inline-flex items-center mt-3 rounded-full bg-accent text-white text-[11px] font-medium px-3 py-1">
              📅 Semaine chargée · Plan optimisé
            </span>
          )}
        </div>
      )}

      {/* Meals */}
      <div className="pt-5 pb-2 px-4 relative">
        {batchInDay && (
          <div
            className="absolute left-7 border-l border-dashed border-secondary/40 pointer-events-none"
            style={{
              top: `${batchInDay.sourcePos * 220 + 180}px`,
              height: `${(batchInDay.lastPos - batchInDay.sourcePos) * 220 - 80}px`,
            }}
          />
        )}
        {visibleMeals.map(({ meal: original, idx: i }) => {
          const meal = getDisplayMeal(day.key, original);
          const isFirstDay = day.key === DAYS[0].key;
          const showHint = isFirstDay && i === 0 && !dismissedHint;
          const altKey = `${day.key}-${original.type}`;
          const altIdx = mealAlternatives[altKey];
          const altLabel =
            altIdx === undefined
              ? null
              : altIdx === 0
              ? "Choix original"
              : `Alternative ${altIdx}/3`;
          const isReste = !!original.restOf;
          const isBatchSource = !!original.batchId;
          return (
            <div key={i}>
              <div className="relative">
                <MealCard
                  variant="full"
                  draggable
                  mealType={meal.type}
                  title={meal.name}
                  category={meal.category}
                  isNew={meal.isNew && !isReste && !isBatchSource}
                  prep={meal.prep}
                  score={meal.score}
                  proactiveContext={isReste ? undefined : meal.badge}
                  onClick={() => setRecipeOpen(true)}
                  onSwipeLeft={() =>
                    isReste ? removeReste(day.key, i) : cycleAlt(day.key, original.type, 1)
                  }
                  onSwipeRight={() =>
                    isReste ? removeReste(day.key, i) : cycleAlt(day.key, original.type, -1)
                  }
                />
                {isBatchSource && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-primary text-white text-[10px] font-bold px-3 py-1">
                    ×{original.batchPortions} portions
                  </span>
                )}
                {isReste && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-secondary text-foreground text-[10px] font-medium px-3 py-1">
                    🍱 Restes
                  </span>
                )}
              </div>
              {isReste && original.restOf && (
                <p className="text-[11px] italic text-foreground/55 -mt-3 mb-4 px-1">
                  Restes de {original.restOf.name}
                </p>
              )}
              {altLabel && (
                <div className="text-center text-[11px] uppercase tracking-wide text-primary -mt-3 mb-5">
                  {altLabel}
                </div>
              )}
              {showHint && (
                <div className="text-center text-[12px] text-secondary -mt-3 mb-5">
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
          onClick={planAccepted ? () => navigate("/epicerie") : handleAccept}
          className={cn(
            "w-full h-[52px] rounded-xl text-white text-[16px] font-semibold transition-colors duration-300",
            planAccepted
              ? "bg-primary"
              : "bg-accent shadow-cta",
          )}
        >
          {planAccepted ? "Plan accepté ✓ — Voir l'épicerie →" : "Tout accepter ce plan"}
        </button>
      </div>
      <div className="h-24" aria-hidden />
      <RecipeSheet
        open={recipeOpen}
        onClose={() => setRecipeOpen(false)}
        onSwap={() => setSwapOpen(true)}
      />
      <SwapSheet
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        contextLabel={`${day.label.toUpperCase()}`}
      />
    </div>
  );
};

export default Semaine;
