import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Soup, Plus, Shuffle, X, ChevronRight, Coffee, Salad, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import RecipeSheet from "@/components/RecipeSheet";
import TinderSwapSheet from "@/components/TinderSwapSheet";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { NutriScoreBadge } from "@/components/ui/nutri-score-badge";
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
  cookingMinutes: number;
}

const DAYS: Day[] = [
  {
    key: "lun", label: "Lun 17",
    cookingMinutes: 35,
    meals: [
      { type: "DÉJEUNER", name: "Smoothie bowl mangue-kefir-granola", category: "Végétarien", score: "A", prep: "10 min" },
      { type: "DÎNER", name: "Bol coréen bibimbap végétarien", category: "Nouveau pour toi", score: "A", prep: "25 min", badge: "Examen IFT-2008 ce soir — repas soutenu et digeste", isNew: true },
      { type: "SOUPER", name: "Soupe thaï aux lentilles", category: "Végétarien", score: "A", prep: "35 min", badge: "Examen dans 2h — repas léger et digeste", batchId: "thai", batchPortions: 4 },
    ],
  },
  {
    key: "mar", label: "Mar 18",
    cookingMinutes: 15,
    meals: [
      { type: "DÉJEUNER", name: "Pancakes sarrasin-bleuets-sirop d'érable", category: "Sans viande", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Soupe thaï aux lentilles", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "thai", name: "Soupe thaï aux lentilles" } },
      { type: "SOUPER", name: "Burrito bowl poulet-salsa-crème sure", category: "Protéines", score: "B", prep: "25 min", badge: "Session d'étude 6h ce soir — repas copieux avant de commencer" },
    ],
  },
  {
    key: "mer", label: "Mer 19",
    cookingMinutes: 50,
    meals: [
      { type: "DÉJEUNER", name: "Açaï bowl amandes-banane-noix de coco", category: "Nouveau pour toi", score: "A", prep: "8 min", isNew: true },
      { type: "DÎNER", name: "Soupe thaï aux lentilles", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "thai", name: "Soupe thaï aux lentilles" } },
      { type: "SOUPER", name: "Cari pois chiches-épinards-lait de coco", category: "Végétarien", score: "A", prep: "30 min", badge: "Travail d'équipe IFT-2007 à 17h — souper avant 16h30" },
    ],
  },
  {
    key: "jeu", label: "Jeu 20",
    cookingMinutes: 10,
    meals: [
      { type: "DÉJEUNER", name: "Œufs bénédictine végé sur muffin anglais", category: "Protéines", score: "B", prep: "20 min" },
      { type: "DÎNER", name: "Ramen végétarien bouillon miso", category: "Végétarien", score: "B", prep: "25 min" },
      { type: "SOUPER", name: "Dal de lentilles corail", category: "Végétarien", score: "A", prep: "30 min", batchId: "dal", batchPortions: 2 },
    ],
  },
  {
    key: "ven", label: "Ven 21",
    cookingMinutes: 40,
    meals: [
      { type: "DÉJEUNER", name: "French toast cannelle-compote de pommes", category: "Sans viande", score: "B", prep: "15 min", badge: "Examen STT-1000 ce soir — bien démarrer la journée" },
      { type: "DÎNER", name: "Dal de lentilles corail", category: "Restes", score: "A", prep: "5 min", restOf: { batchId: "dal", name: "Dal de lentilles corail" } },
      { type: "SOUPER", name: "Bol soba-tofu-sauce tahini-concombre", category: "Végétarien", score: "A", prep: "20 min", badge: "Examen dans 2h30 — énergie stable" },
    ],
  },
  {
    key: "sam", label: "Sam 22",
    cookingMinutes: 25,
    meals: [
      { type: "DÉJEUNER", name: "Crêpes sarrasin-compote-sirop d'érable", category: "Sans viande", score: "B", prep: "25 min" },
      { type: "DÎNER", name: "Buddha bowl quinoa-légumes rôtis-tahini", category: "Végétarien", score: "A", prep: "20 min" },
      { type: "SOUPER", name: "Pizza maison pâte mince-légumes-fromage", category: "Sans viande", score: "C", prep: "30 min" },
    ],
  },
  {
    key: "dim", label: "Dim 23",
    cookingMinutes: 55,
    meals: [
      { type: "DÉJEUNER", name: "Granola maison-yogourt grec-fruits frais", category: "Végétarien", score: "A", prep: "5 min" },
      { type: "DÎNER", name: "Souvlaki poulet-légumes grillés-riz", category: "Protéines", score: "B", prep: "30 min" },
      { type: "SOUPER", name: "Soupe lentilles-légumes-pain de seigle", category: "Végétarien", score: "A", prep: "25 min" },
    ],
  },
];

const TODAY_KEY = "lun";
const COMPLETED_DAY_KEYS: string[] = [];

const MEAL_TIMES: Record<MealType, string> = {
  DÉJEUNER: "7h30",
  DÎNER: "12h00",
  SOUPER: "18h30",
};
const MEAL_ICONS: Record<MealType, typeof Coffee> = {
  DÉJEUNER: Coffee,
  DÎNER: Salad,
  SOUPER: Utensils,
};
const WEEK_RANGE = "Du 17 au 23 mai";
const WEEK_COST = 92;

const Semaine = () => {
  const [activeKey, setActiveKey] = useState(DAYS[0].key);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [removedRestes, setRemovedRestes] = useState<Set<string>>(new Set());
  const [longPressSlot, setLongPressSlot] = useState<{ dayKey: string; mealIdx: number } | null>(null);
  const [deletedSlots, setDeletedSlots] = useState<Set<string>>(new Set());
  const [activeSlot, setActiveSlot] = useState<{ dayKey: string; mealIdx: number } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { planAccepted, setPlanAccepted } = usePreferences();
  const day = DAYS.find((d) => d.key === activeKey)!;

  const startLongPress = (dayKey: string, mealIdx: number) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      setLongPressSlot({ dayKey, mealIdx });
    }, 500);
  };
  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const markDeleted = () => {
    if (!longPressSlot) return;
    const k = `${longPressSlot.dayKey}-${longPressSlot.mealIdx}`;
    setDeletedSlots((prev) => {
      const next = new Set(prev);
      next.add(k);
      return next;
    });
    setLongPressSlot(null);
  };
  const reactivateSlot = (dayKey: string, mealIdx: number) => {
    setDeletedSlots((prev) => {
      const next = new Set(prev);
      next.delete(`${dayKey}-${mealIdx}`);
      return next;
    });
  };

  const TOTAL_MEALS = 21;
  const confirmedMeals = planAccepted ? TOTAL_MEALS : 14;
  const progressPct = (confirmedMeals / TOTAL_MEALS) * 100;
  const totalCookingMin = DAYS.reduce((s, d) => s + d.cookingMinutes, 0);
  const totalHours = Math.floor(totalCookingMin / 60);
  const totalMins = totalCookingMin % 60;
  const totalCookingLabel = totalMins
    ? `${totalHours}h${totalMins.toString().padStart(2, "0")} de cuisine`
    : `${totalHours}h de cuisine`;

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

  const visibleMeals = day.meals
    .map((m, i) => ({ meal: m, idx: i }))
    .filter(({ idx }) => !removedRestes.has(`${day.key}-${idx}`));

  return (
    <div className="flex flex-col">
      {/* Header éditorial — résumé de la semaine */}
      <header className="bg-white px-4 pt-6 pb-5 border-b border-border">
        <p className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">
          Ta semaine
        </p>
        <h1 className="font-display italic text-display-xl text-foreground mt-1 leading-tight">
          {WEEK_RANGE}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-[12px] text-foreground/55">
          <span>{TOTAL_MEALS} repas</span>
          <span className="w-[3px] h-[3px] rounded-full bg-foreground/20" />
          <span>{WEEK_COST} $ estimés</span>
          <span className="w-[3px] h-[3px] rounded-full bg-foreground/20" />
          <span>{totalCookingLabel}</span>
        </div>
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
                aria-label={`Voir les repas de ${d.label}`}
                aria-pressed={active}
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

      {/* Day summary */}
      <div className="flex items-baseline justify-between mt-4 px-4">
        <p className="text-[11px] uppercase tracking-[1.5px] font-bold text-foreground">
          {day.label}
        </p>
        <p className="text-[12px] text-foreground/45">
          {day.cookingMinutes} min de cuisine
        </p>
      </div>

      {/* Meals — compact slot cards */}
      <div className="pt-3 pb-2 px-4 flex flex-col gap-3">
        {visibleMeals.map(({ meal: original, idx: i }) => {
          const isReste = !!original.restOf;
          const isBatchSource = !!original.batchId;
          const slotKey = `${day.key}-${i}`;
          const MealIcon = MEAL_ICONS[original.type];
          if (deletedSlots.has(slotKey)) {
            return (
              <div
                key={i}
                className="rounded-2xl border-2 border-dashed border-border bg-transparent h-[88px] flex items-center justify-center gap-2 px-4"
              >
                <span className="text-[13px] text-foreground/40 italic">
                  {original.type} · Géré par toi
                </span>
                <button
                  type="button"
                  onClick={() => reactivateSlot(day.key, i)}
                  aria-label="Réactiver ce repas"
                  className="ml-1"
                >
                  <Plus size={16} className="text-foreground/30" />
                </button>
              </div>
            );
          }
          return (
            <div
              key={i}
              className="relative bg-white rounded-2xl border border-border shadow-card overflow-hidden"
              onMouseDown={() => startLongPress(day.key, i)}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={() => startLongPress(day.key, i)}
              onTouchEnd={cancelLongPress}
              onTouchMove={cancelLongPress}
              onTouchCancel={cancelLongPress}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveSlot({ dayKey: day.key, mealIdx: i });
                  setRecipeOpen(true);
                }}
                className="w-full text-left p-3 flex items-center gap-3"
              >
                {/* Photo placeholder */}
                <div className="w-[68px] h-[68px] rounded-xl bg-secondary/25 shrink-0 flex items-center justify-center">
                  <MealIcon size={24} strokeWidth={1.75} className="text-primary/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[1px] font-semibold text-foreground/50">
                      {original.type} · {MEAL_TIMES[original.type]}
                    </span>
                    {isBatchSource && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-primary text-white px-2 py-[2px] rounded-full">
                        ×{original.batchPortions}
                      </span>
                    )}
                    {isReste && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-foreground text-white px-2 py-[2px] rounded-full">
                        Restes
                      </span>
                    )}
                    {!isReste && original.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wide bg-accent text-white px-2 py-[2px] rounded-full line-clamp-1 max-w-[160px]">
                        {original.badge.split(" — ")[0]}
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] font-semibold text-foreground leading-snug mt-1 line-clamp-2 pr-7">
                    {original.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-foreground/50">
                    <span>{isReste ? "0 min · réchauffer" : original.prep}</span>
                    <span className="w-[3px] h-[3px] rounded-full bg-foreground/20" />
                    <NutriScoreBadge score={original.score} className="scale-90 origin-left" />
                  </div>
                </div>
                <ChevronRight size={16} className="text-foreground/30 shrink-0 self-center" />
              </button>
              {/* Swap / remove action — top right floating button */}
              {isReste ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReste(day.key, i);
                  }}
                  aria-label={`Retirer le reste de ${day.label}`}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-secondary/30 hover:bg-secondary/50 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <X size={13} strokeWidth={2.25} className="text-foreground/70" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlot({ dayKey: day.key, mealIdx: i });
                    setSwapOpen(true);
                  }}
                  aria-label={`Changer le repas ${original.type} de ${day.label}`}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-secondary/30 hover:bg-secondary/50 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Shuffle size={13} strokeWidth={2.25} className="text-primary" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky CTA above bottom nav */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 py-3 bg-background z-40"
        style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
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
      <div className="h-28" aria-hidden />
      <RecipeSheet
        open={recipeOpen}
        onClose={() => setRecipeOpen(false)}
        onSwap={() => setSwapOpen(true)}
      />
      {(() => {
        const slot = activeSlot ?? { dayKey: day.key, mealIdx: 0 };
        const slotDay = DAYS.find((d) => d.key === slot.dayKey) ?? day;
        const slotMeal = slotDay.meals[slot.mealIdx] ?? slotDay.meals[0];
        return (
          <TinderSwapSheet
            open={swapOpen}
            onClose={() => setSwapOpen(false)}
            dayLabel={slotDay.label}
            mealType={slotMeal.type}
            hasCalendarEvent={!!slotMeal.badge}
            calendarEventLabel={slotMeal.badge}
          />
        );
      })()}
      <Sheet open={!!longPressSlot} onOpenChange={(v) => !v && setLongPressSlot(null)}>
        <SheetContent side="bottom" className="rounded-t-[20px] bg-white">
          <SheetTitle className="font-display text-display-md text-foreground">
            Ce repas
          </SheetTitle>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (longPressSlot) setActiveSlot(longPressSlot);
                setLongPressSlot(null);
                setSwapOpen(true);
              }}
              className="w-full h-12 rounded-xl border-[1.5px] border-primary bg-white text-primary text-[15px] font-semibold"
            >
              Changer ce repas
            </button>
            <button
              type="button"
              onClick={markDeleted}
              className="w-full h-12 rounded-xl text-[15px] font-semibold"
              style={{
                background: "hsl(var(--warning-soft))",
                color: "hsl(var(--warning))",
              }}
            >
              Je mange ailleurs
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Semaine;
