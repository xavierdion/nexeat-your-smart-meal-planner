import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, X, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { NutriScoreBadge } from "@/components/ui/nutri-score-badge";

type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";
type Source = "nexeat" | "favori";
type Score = "A" | "B" | "C" | "D" | "E";

interface Alt {
  name: string;
  prep: string;
  score: Score;
  source: Source;
}

const ALTS_BY_TYPE: Record<MealType, Alt[]> = {
  DÉJEUNER: [
    { name: "Bol açaï-granola-banane", prep: "8 min", score: "A", source: "nexeat" },
    { name: "Tartines avocat-œuf poché", prep: "12 min", score: "B", source: "favori" },
    { name: "Yogourt grec-fruits-miel", prep: "5 min", score: "A", source: "nexeat" },
    { name: "Smoothie bowl mangue-coco", prep: "7 min", score: "A", source: "nexeat" },
    { name: "Pain doré aux bleuets", prep: "15 min", score: "C", source: "favori" },
    { name: "Gruau pommes-cannelle-amandes", prep: "10 min", score: "A", source: "nexeat" },
  ],
  DÎNER: [
    { name: "Riz sauté tofu-légumes-gingembre", prep: "18 min", score: "A", source: "nexeat" },
    { name: "Salade quinoa-pois chiches-feta", prep: "15 min", score: "A", source: "favori" },
    { name: "Wrap poulet-légumes grillés", prep: "12 min", score: "B", source: "nexeat" },
    { name: "Buddha bowl patate douce-kale", prep: "20 min", score: "A", source: "nexeat" },
    { name: "Soupe miso-nouilles-edamames", prep: "14 min", score: "B", source: "favori" },
    { name: "Tacos poisson-chou-lime", prep: "16 min", score: "B", source: "nexeat" },
  ],
  SOUPER: [
    { name: "Pâtes pesto-tomates cerises-parmesan", prep: "20 min", score: "B", source: "favori" },
    { name: "Curry lentilles-épinards-riz basmati", prep: "25 min", score: "A", source: "nexeat" },
    { name: "Saumon teriyaki-edamames-riz", prep: "22 min", score: "A", source: "nexeat" },
    { name: "Chili végétarien-maïs-haricots", prep: "30 min", score: "A", source: "nexeat" },
    { name: "Poulet rôti-légumes racines", prep: "35 min", score: "B", source: "favori" },
    { name: "Risotto champignons-thym", prep: "28 min", score: "C", source: "nexeat" },
  ],
};

const CONTEXT_COPY: Record<string, string> = {
  "examen": "Avant ton examen, on vise léger et soutenu pour rester concentré·e.",
  "session": "Session d'étude longue ? Ce repas tient l'énergie stable sans lourdeur.",
  "travail": "Travail d'équipe à l'horizon — repas simple et rapide avant de partir.",
  "soir": "Ce soir, on privilégie un repas digeste et réconfortant.",
};

const getContextLine = (label?: string): string => {
  if (!label) return "Choisi pour ton jour, pour ton moment.";
  const lower = label.toLowerCase();
  if (lower.includes("examen")) return CONTEXT_COPY["examen"];
  if (lower.includes("session") || lower.includes("étude")) return CONTEXT_COPY["session"];
  if (lower.includes("travail") || lower.includes("équipe")) return CONTEXT_COPY["travail"];
  return CONTEXT_COPY["soir"];
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
  "Smoothie bowl mangue-coco": ["vegan-ok"],
  "Pain doré aux bleuets": ["animal", "dairy"],
  "Gruau pommes-cannelle-amandes": ["vegan-ok"],
  "Buddha bowl patate douce-kale": ["vegan-ok"],
  "Soupe miso-nouilles-edamames": ["vegan-ok"],
  "Tacos poisson-chou-lime": ["fish"],
  "Chili végétarien-maïs-haricots": ["vegan-ok"],
  "Poulet rôti-légumes racines": ["animal"],
  "Risotto champignons-thym": ["dairy"],
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", cb);
    return () => mq.removeEventListener?.("change", cb);
  }, []);
  return reduced;
};

const STACK_LAYOUT = [
  { scale: 1, ty: 0, opacity: 1, z: 30 },
  { scale: 0.94, ty: 18, opacity: 0.5, z: 20 },
  { scale: 0.88, ty: 32, opacity: 0.25, z: 10 },
];

const vibrate = (ms: number) => {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(ms);
    } catch {
      /* noop */
    }
  }
};

interface CardProps {
  alt: Alt;
  stackIndex: 0 | 1 | 2;
  calendarEventLabel?: string;
  reducedMotion: boolean;
  nudge: boolean;
  onCommit?: (dir: "left" | "right") => void;
}

const SwapCard = ({ alt, stackIndex, calendarEventLabel, reducedMotion, nudge, onCommit }: CardProps) => {
  const isActive = stackIndex === 0;
  const layout = STACK_LAYOUT[stackIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], reducedMotion ? [0, 0, 0] : [-9, 0, 9]);
  const cardOpacity = useTransform(x, [-300, -120, 0, 120, 300], [0, 1, 1, 1, 0]);

  const rightOpacity = useTransform(x, [0, 40, 140], [0, 0.3, 0.9]);
  const leftOpacity = useTransform(x, [-140, -40, 0], [0.9, 0.3, 0]);

  const [exitTo, setExitTo] = useState<null | "left" | "right">(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isActive) return;
    const threshold = (typeof window !== "undefined" ? window.innerWidth : 390) * 0.35;
    const dx = info.offset.x;
    const vx = info.velocity.x;
    if (dx > threshold || vx > 500) {
      setExitTo("right");
      onCommit?.("right");
    } else if (dx < -threshold || vx < -500) {
      setExitTo("left");
      onCommit?.("left");
    } else {
      // spring back handled by animate prop reset
      x.set(0);
    }
  };

  return (
    <motion.article
      aria-hidden={!isActive}
      drag={isActive && !reducedMotion ? "x" : false}
      dragElastic={0.6}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: isActive ? cardOpacity : layout.opacity,
        zIndex: layout.z,
        pointerEvents: isActive ? "auto" : "none",
        borderRadius: "var(--radius-card)",
        touchAction: isActive ? "pan-y" : "auto",
      }}
      initial={false}
      animate={
        exitTo
          ? {
              x: exitTo === "right" ? 600 : -600,
              opacity: 0,
              rotate: reducedMotion ? 0 : exitTo === "right" ? 18 : -18,
              transition: reducedMotion
                ? { duration: 0.15 }
                : { duration: 0.35, ease: "easeOut" },
            }
          : nudge && !reducedMotion
          ? {
              x: [0, 20, 0],
              scale: layout.scale,
              y: layout.ty,
              transition: { duration: 0.8, ease: "easeOut", delay: 0.6 },
            }
          : {
              x: 0,
              scale: layout.scale,
              y: layout.ty,
              transition: reducedMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 300, damping: 30 },
            }
      }
      className="absolute inset-x-0 top-0 bg-white shadow-float p-4 select-none"
    >
      {/* Photo */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          borderRadius: "var(--radius-photo)",
          background:
            "linear-gradient(135deg, hsl(var(--photo-placeholder-from)), hsl(var(--photo-placeholder-to)))",
        }}
        role="img"
        aria-label={alt.name}
      >
        {calendarEventLabel && (
          <span
            className="absolute bottom-3 left-3 shadow-soft text-white text-xs uppercase tracking-wide rounded-full"
            style={{ background: "hsl(var(--accent))", padding: "8px 12px" }}
          >
            ▸ {calendarEventLabel}
          </span>
        )}

        {/* Drag overlays (active card only) */}
        {isActive && !reducedMotion && (
          <>
            <motion.div
              style={{
                opacity: rightOpacity,
                background: "hsl(var(--accent))",
                borderRadius: "var(--radius-photo)",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-white font-display text-2xl flex items-center gap-2">
                <Check size={24} /> Choisir
              </span>
            </motion.div>
            <motion.div
              style={{
                opacity: leftOpacity,
                background: "hsl(var(--primary) / 0.85)",
                borderRadius: "var(--radius-photo)",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="text-white font-display text-2xl flex items-center gap-2">
                <RefreshCw size={22} /> Autre
              </span>
            </motion.div>
          </>
        )}
      </div>

      {/* Meta */}
      <div className="px-2 pt-4 pb-2">
        <h2 className="font-display text-2xl text-foreground leading-snug">{alt.name}</h2>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{alt.prep}</span>
          <span aria-hidden="true">·</span>
          <NutriScoreBadge score={alt.score} />
        </div>
      </div>
    </motion.article>
  );
};

const Swap = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { restrictions } = usePreferences();
  const reducedMotion = usePrefersReducedMotion();

  const dayLabel = params.get("dayLabel") ?? "AUJOURD'HUI";
  const mealTypeParam = (params.get("mealType") ?? "DÎNER") as MealType;
  const mealType: MealType = (["DÉJEUNER", "DÎNER", "SOUPER"] as MealType[]).includes(mealTypeParam)
    ? mealTypeParam
    : "DÎNER";
  const calendarEventLabel = params.get("calendarEventLabel") ?? undefined;

  const isAllowed = (name: string) => {
    const tags = MEAL_TAGS[name] ?? [];
    if (restrictions.includes("Végétalien") && (tags.includes("dairy") || tags.includes("animal") || tags.includes("fish"))) return false;
    if (restrictions.includes("Végétarien") && (tags.includes("animal") || tags.includes("fish"))) return false;
    if (restrictions.includes("Sans produits laitiers") && tags.includes("dairy")) return false;
    if (restrictions.includes("Sans fruits de mer") && tags.includes("fish")) return false;
    return true;
  };

  const alts = useMemo(
    () => ALTS_BY_TYPE[mealType].filter((a) => isAllowed(a.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mealType, restrictions]
  );

  const total = alts.length;
  const hasAlts = total > 0;

  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(1);
  const [didNudge, setDidNudge] = useState(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!reducedMotion && hasAlts) {
      const t = setTimeout(() => setDidNudge(true), 0);
      return () => clearTimeout(t);
    }
  }, [reducedMotion, hasAlts]);

  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const allViewed = hasAlts && seen > total;

  const goNext = () => {
    setIndex((i) => (i + 1) % total);
    setSeen((s) => s + 1);
  };

  const doChoose = () => {
    const previousIndex = index;
    vibrate(12);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => {
      navigate(-1);
    }, 4000);
    toast.success("Repas mis à jour", {
      duration: 4000,
      action: {
        label: "Annuler",
        onClick: () => {
          if (navTimeoutRef.current) {
            clearTimeout(navTimeoutRef.current);
            navTimeoutRef.current = null;
          }
          setIndex(previousIndex);
        },
      },
      style: { background: "#4A6670", color: "#fff", border: "none" },
    });
  };

  const handleCommit = (dir: "left" | "right") => {
    if (dir === "right") {
      doChoose();
    } else {
      vibrate(8);
      goNext();
    }
  };

  const currentAlt = hasAlts ? alts[index % total] : null;

  const visible = hasAlts && !allViewed
    ? ([0, 1, 2].map((offset) => alts[(index + offset) % total]) as Alt[])
    : [];

  return (
    <div
      className="bg-canvas-gradient flex flex-col"
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: "max(16px, env(safe-area-inset-top))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        minHeight: "100dvh",
      }}
    >
      {/* SR live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {currentAlt && !allViewed
          ? `Option ${index + 1} sur ${total} : ${currentAlt.name}`
          : allViewed
          ? "Tu as vu toutes les options"
          : ""}
      </div>

      {/* Top bar */}
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-foreground shrink-0"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex-1 text-center pt-1">
          <p className="text-xs uppercase tracking-wide text-foreground/70">{dayLabel}</p>
          <h1 className="font-display text-2xl text-foreground leading-tight">{mealType}</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Fermer"
          className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-foreground shrink-0"
        >
          <X size={22} />
        </button>
      </div>

      {/* Stack zone */}
      <div className="flex-1 flex flex-col items-center justify-center mt-12">
        {!hasAlts ? (
          <div className="text-center max-w-[320px]">
            <h2 className="font-display text-2xl text-foreground">
              Aucune option ne correspond à tes restrictions
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Ajuste tes préférences alimentaires pour voir d'autres suggestions.
            </p>
            <button
              type="button"
              onClick={() => navigate("/profil")}
              className="mt-6 h-12 px-5 rounded-full bg-white border border-border text-foreground text-sm"
            >
              Modifier mes restrictions
            </button>
          </div>
        ) : allViewed ? (
          <div className="text-center max-w-[320px]">
            <h2 className="font-display text-3xl text-foreground">Tu as tout vu</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Garde le repas actuel ou recommence depuis le début.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="h-12 px-5 rounded-full text-white text-sm font-semibold shadow-cta"
                style={{ background: "hsl(var(--accent))" }}
              >
                Garder le repas actuel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setSeen(1);
                }}
                className="h-12 px-5 rounded-full bg-white border border-border text-foreground text-sm"
              >
                Revoir les options
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-[360px]" style={{ height: 460 }}>
            <AnimatePresence initial={false}>
              {visible.map((alt, i) => (
                <SwapCard
                  key={`${index}-${i}-${alt.name}`}
                  alt={alt}
                  stackIndex={i as 0 | 1 | 2}
                  calendarEventLabel={calendarEventLabel}
                  reducedMotion={reducedMotion}
                  nudge={i === 0 && didNudge && index === 0}
                  onCommit={i === 0 ? handleCommit : undefined}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {hasAlts && !allViewed && (
          <p className="mt-6 text-sm text-foreground/60">
            Option {index + 1} sur {total}
          </p>
        )}
      </div>

      {/* Bottom bar — fallback accessibility */}
      {hasAlts && !allViewed && (
        <div className="flex gap-3 pt-5">
          <button
            type="button"
            onClick={() => {
              vibrate(8);
              goNext();
            }}
            className="flex-1 h-14 rounded-full bg-white border border-border text-foreground text-sm font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Autre option
          </button>
          <button
            type="button"
            onClick={doChoose}
            className="flex-1 h-14 rounded-full text-white text-sm font-semibold shadow-cta flex items-center justify-center gap-2"
            style={{ background: "hsl(var(--accent))" }}
          >
            <Check size={18} />
            Choisir ce repas
          </button>
        </div>
      )}
    </div>
  );
};

export default Swap;
