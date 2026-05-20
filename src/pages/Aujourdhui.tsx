import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RecipeSheet from "@/components/RecipeSheet";
import SwapSheet from "@/components/SwapSheet";
import { Bell, ChevronRight, Coffee, Salad, Utensils, GraduationCap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";

interface MealItem {
  kind: "meal";
  type: MealType;
  hour: number;
  time: string;
  name: string;
  prep: string;
  prepMin: number;
  score: Score;
  cost: string;
}

interface EventItem {
  kind: "event";
  hour: number;
  time: string;
  label: string;
  icon: "course" | "exam";
}

type DayItem = MealItem | EventItem;

const DAY: DayItem[] = [
  { kind: "meal", type: "DÉJEUNER", hour: 7.5, time: "7h30", name: "Gruau aux pommes", prep: "8 min", prepMin: 8, score: "A", cost: "~2,10 $" },
  { kind: "meal", type: "DÎNER", hour: 12, time: "12h00", name: "Salade de lentilles express", prep: "15 min", prepMin: 15, score: "A", cost: "~3,50 $" },
  { kind: "event", hour: 14, time: "14h00", label: "Examen IFT-2008", icon: "exam" },
  { kind: "event", hour: 16, time: "16h00", label: "Cours GLO-2100", icon: "course" },
  { kind: "meal", type: "SOUPER", hour: 18, time: "18h00", name: "Soupe miso et légumes", prep: "12 min", prepMin: 12, score: "A", cost: "~4,20 $" },
];

// Mock data : minutes de cuisine prévues par jour de la semaine (L à D)
const WEEK_COOKING_MIN = [
  { day: "L", min: 0 },
  { day: "M", min: 35 },
  { day: "M", min: 20 },
  { day: "J", min: 15 },
  { day: "V", min: 0 },
  { day: "S", min: 45 },
  { day: "D", min: 60 },
];

const MEAL_ICONS = { DÉJEUNER: Coffee, DÎNER: Salad, SOUPER: Utensils };

function formatCountdown(hoursAway: number): string {
  if (hoursAway < 0) return "Passé";
  if (hoursAway < 1) return `Dans ${Math.max(1, Math.round(hoursAway * 60))} min`;
  const h = Math.floor(hoursAway);
  const m = Math.round((hoursAway - h) * 60);
  if (m === 0) return `Dans ${h}h`;
  return `Dans ${h}h${String(m).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  const jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const mois = ["jan.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${jours[d.getDay()]} · ${d.getDate()} ${mois[d.getMonth()]}`;
}

const Aujourdhui = () => {
  const navigate = useNavigate();
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  const now = new Date();
  const nowHour = now.getHours() + now.getMinutes() / 60;

  // Prochain repas à venir (premier meal dont l'heure n'est pas passée)
  const meals = DAY.filter((it): it is MealItem => it.kind === "meal");
  const nextMeal = meals.find((m) => m.hour > nowHour) ?? meals[meals.length - 1];
  const HeroIcon = MEAL_ICONS[nextMeal.type];
  const countdown = formatCountdown(nextMeal.hour - nowHour);

  // Autres items du jour (tout sauf le hero), triés par heure
  const otherItems = DAY.filter((it) => it !== nextMeal).sort((a, b) => a.hour - b.hour);

  // Semaine : totaux pour la week card
  const totalWeekMin = WEEK_COOKING_MIN.reduce((s, d) => s + d.min, 0);
  const maxMin = Math.max(...WEEK_COOKING_MIN.map((d) => d.min), 1);
  const todayIdx = (now.getDay() + 6) % 7; // L=0 ... D=6

  return (
    <div className="flex flex-col pb-6 bg-background min-h-full">
      {/* 1 · Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-foreground">
          {formatDate(now)}
        </span>
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-[10px] bg-white border border-border flex items-center justify-center"
        >
          <Bell size={16} className="text-foreground" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-[1.5px] ring-white" />
        </button>
      </div>

      {/* 2 · Hero "Pourquoi maintenant" */}
      <div className="mx-4 mt-2 bg-white border border-border rounded-2xl px-4 py-3.5">
        <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-foreground/40 mb-1.5">
          Pourquoi maintenant
        </p>
        <p className="font-display text-[18px] font-bold text-foreground leading-snug">
          Avant ton exam de 14h, vise léger et soutenu.
        </p>
      </div>

      {/* 3 · Carte prochain repas (hero visuel) */}
      <button
        type="button"
        onClick={() => setRecipeOpen(true)}
        className="mx-4 mt-3 bg-white border border-border rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform"
      >
        <div
          className="relative h-32 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--photo-placeholder-from)) 0%, hsl(var(--photo-placeholder-to)) 100%)",
          }}
        >
          <HeroIcon size={48} className="text-foreground/30" strokeWidth={1.5} />
          <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {nextMeal.type === "DÉJEUNER" ? "Déjeuner" : nextMeal.type === "DÎNER" ? "Dîner" : "Souper"} · {countdown}
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="font-display text-[18px] font-bold text-foreground leading-tight">
            {nextMeal.name}
          </p>
          <div className="flex items-center gap-2 mt-1.5 text-[12px] text-foreground/50">
            <span>{nextMeal.prep}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-foreground/20" />
            <span>Nutri {nextMeal.score}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-foreground/20" />
            <span>{nextMeal.cost}</span>
          </div>
        </div>
      </button>

      {/* 4 · CTA primaire */}
      <button
        type="button"
        onClick={() => setRecipeOpen(true)}
        className="mx-4 mt-3 h-12 rounded-xl bg-accent text-white text-[14px] font-semibold active:opacity-90"
      >
        Voir la recette
      </button>

      {/* 5 · Lien secondaire */}
      <button
        type="button"
        onClick={() => setSwapOpen(true)}
        className="mx-auto mt-2.5 text-[13px] text-foreground/60 border-b border-border pb-px"
      >
        Changer ce repas
      </button>

      {/* 6 · Aussi aujourd'hui */}
      <p className="px-4 mt-5 mb-2 text-[11px] uppercase tracking-[0.12em] font-semibold text-foreground/40">
        Aussi aujourd'hui
      </p>

      {/* 7 · Liste compacte mixte (repas + événements) */}
      <div className="mx-4 bg-white border border-border rounded-xl overflow-hidden">
        {otherItems.map((it, i) => {
          const past = it.hour < nowHour;
          const isEvent = it.kind === "event";
          const EventIcon = isEvent ? (it.icon === "exam" ? GraduationCap : BookOpen) : null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => !isEvent && setRecipeOpen(true)}
              disabled={isEvent}
              className={cn(
                "w-full flex items-center gap-3 px-4 h-11 text-left",
                i !== otherItems.length - 1 && "border-b border-border/60",
              )}
            >
              <span className="text-[12px] text-foreground/50 w-12 shrink-0 tabular-nums">
                {it.time}
              </span>
              {isEvent && EventIcon && (
                <EventIcon size={13} className="text-primary shrink-0" strokeWidth={2} />
              )}
              <span
                className={cn(
                  "flex-1 text-[14px] truncate",
                  past && !isEvent && "line-through text-foreground/30",
                  isEvent ? "text-primary font-medium" : "text-foreground",
                )}
              >
                {isEvent ? it.label : it.name}
              </span>
              {!isEvent && (
                <ChevronRight size={14} className="text-foreground/30 shrink-0" strokeWidth={2} />
              )}
            </button>
          );
        })}
      </div>

      {/* 8 · Ta semaine — graphique temps de cuisine */}
      <div className="mx-4 mt-4 bg-white border border-border rounded-2xl px-4 py-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[14px] font-semibold text-foreground">
            Ta semaine en cuisine
          </span>
          <button
            type="button"
            onClick={() => navigate("/semaine")}
            className="text-[12px] text-foreground/60 border-b border-border pb-px"
          >
            Voir ma semaine →
          </button>
        </div>
        <p className="text-[12px] text-foreground/50 mb-3">
          <span className="font-bold text-foreground">{totalWeekMin} min</span> de cuisine prévues cette semaine
        </p>
        {/* Bar chart */}
        <div className="flex items-end justify-between gap-1.5 h-20">
          {WEEK_COOKING_MIN.map((d, i) => {
            const heightPct = (d.min / maxMin) * 100;
            const isToday = i === todayIdx;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex-1 flex items-end">
                  {d.min === 0 ? (
                    <div className="w-full h-[2px] rounded-full bg-border" />
                  ) : (
                    <div
                      className={cn(
                        "w-full rounded-md",
                        isToday ? "bg-accent" : "bg-primary/70",
                      )}
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                      title={`${d.min} min`}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    isToday ? "text-accent" : "text-foreground/40",
                  )}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <RecipeSheet
        open={recipeOpen}
        onClose={() => setRecipeOpen(false)}
        onSwap={() => setSwapOpen(true)}
      />
      <SwapSheet
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        contextLabel={`${nextMeal.type} AUJOURD'HUI`}
      />
    </div>
  );
};

export default Aujourdhui;
