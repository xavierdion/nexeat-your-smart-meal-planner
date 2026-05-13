import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import { motion, type PanInfo } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";

type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";
type Source = "nexeat" | "favori";

export interface TinderAlt {
  name: string;
  prep: string;
  score: "A" | "B" | "C" | "D" | "E";
  source: Source;
}

const ALTS_BY_TYPE: Record<MealType, TinderAlt[]> = {
  DÉJEUNER: [
    { name: "Bol açaï-granola-banane", prep: "8 min", score: "A", source: "nexeat" },
    { name: "Tartines avocat-œuf poché", prep: "12 min", score: "B", source: "favori" },
    { name: "Yogourt grec-fruits-miel", prep: "5 min", score: "A", source: "nexeat" },
  ],
  DÎNER: [
    { name: "Riz sauté tofu-légumes-gingembre", prep: "18 min", score: "A", source: "nexeat" },
    { name: "Salade quinoa-pois chiches-feta", prep: "15 min", score: "A", source: "favori" },
    { name: "Wrap poulet-légumes grillés", prep: "12 min", score: "B", source: "nexeat" },
  ],
  SOUPER: [
    { name: "Pâtes pesto-tomates cerises-parmesan", prep: "20 min", score: "B", source: "favori" },
    { name: "Curry lentilles-épinards-riz basmati", prep: "25 min", score: "A", source: "nexeat" },
    { name: "Saumon teriyaki-edamames-riz", prep: "22 min", score: "A", source: "nexeat" },
  ],
};

const MEAL_TAGS: Record<string, string[]> = {
  "Pâtes pesto-tomates cerises-parmesan": ["dairy"],
  "Saumon teriyaki-edamames-riz": ["fish", "animal"],
  "Wrap poulet-légumes grillés": ["animal"],
  "Riz sauté tofu-légumes-gingembre": ["vegan-ok"],
  "Salade quinoa-pois chiches-feta": ["dairy"],
  "Curry lentilles-épinards-riz basmati": ["vegan-ok"],
  "Bol açaï-granola-banane": ["vegan-ok"],
  "Tartines avocat-œuf poché": ["animal"],
  "Yogourt grec-fruits-miel": ["dairy"],
};

interface Props {
  open: boolean;
  onClose: () => void;
  dayLabel: string;
  mealType: MealType;
  hasCalendarEvent?: boolean;
  calendarEventLabel?: string;
}

const TinderSwapSheet = ({
  open,
  onClose,
  dayLabel,
  mealType,
  hasCalendarEvent,
  calendarEventLabel,
}: Props) => {
  const { restrictions } = usePreferences();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  if (!open) return null;

  const isAllowed = (name: string) => {
    const tags = MEAL_TAGS[name] ?? [];
    if (restrictions.includes("Végétalien") && (tags.includes("dairy") || tags.includes("animal") || tags.includes("fish"))) return false;
    if (restrictions.includes("Végétarien") && (tags.includes("animal") || tags.includes("fish"))) return false;
    if (restrictions.includes("Sans produits laitiers") && tags.includes("dairy")) return false;
    if (restrictions.includes("Sans fruits de mer") && tags.includes("fish")) return false;
    return true;
  };

  const alts = ALTS_BY_TYPE[mealType].filter((alt) => isAllowed(alt.name));
  const safeAlts = alts.length > 0 ? alts : ALTS_BY_TYPE[mealType];
  const current = safeAlts[index % safeAlts.length];

  const dislike = () => setIndex((i) => i + 1);
  const like = () => {
    onClose();
    toast(`Repas mis à jour — ${current.name}`, {
      style: { background: "#4A6670", color: "#fff", border: "none" },
      duration: 3500,
      action: {
        label: "Annuler",
        onClick: () => {
          // The sheet was already closed; just notify cancellation
          toast("Modification annulée", {
            duration: 2000,
            style: { background: "#2A2D35", color: "#fff", border: "none" },
          });
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col" style={{ height: "100vh" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
            {dayLabel} · {mealType}
          </p>
          {hasCalendarEvent && calendarEventLabel && (
            <span className="inline-flex items-center mt-2 bg-[hsl(var(--accent-soft))] text-accent text-[11px] rounded-full px-3 py-1">
              ▸ {calendarEventLabel}
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-foreground -mt-1" aria-label="Fermer">
          <X size={22} />
        </button>
      </div>

      {/* Card */}
      <div className="mx-6 mt-4 flex-1">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          onDragEnd={(_, info: PanInfo) => {
            if (info.offset.x < -80) dislike();
            else if (info.offset.x > 80) like();
          }}
          className="relative w-full rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            height: 280,
            background:
              "linear-gradient(135deg, hsl(var(--photo-placeholder-from)) 0%, hsl(var(--photo-placeholder-to)) 100%)",
          }}
        >
          <span
            className={
              "absolute top-3 left-3 text-white text-[10px] rounded-full px-3 py-1 font-semibold " +
              (current.source === "nexeat" ? "bg-primary/90" : "bg-accent/90")
            }
          >
            {current.source === "nexeat" ? "▸ NexEat" : "♥ Coup de cœur"}
          </span>
        </motion.div>
        <h3 className="font-display text-xl text-foreground mt-3 leading-snug">
          {current.name}
        </h3>
        <p className="text-[13px] text-foreground/60 mt-1">
          {current.prep} · Score {current.score}
        </p>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-6 pb-8 flex justify-center gap-4">
        <button
          onClick={dislike}
          aria-label="Passer"
          className="w-[60px] h-[60px] rounded-full bg-white border-2 border-border flex items-center justify-center"
        >
          <X size={24} className="text-foreground/50" />
        </button>
        <button
          onClick={like}
          aria-label="Garder"
          className="w-[60px] h-[60px] rounded-full bg-accent flex items-center justify-center"
        >
          <Check size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default TinderSwapSheet;
