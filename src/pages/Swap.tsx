import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, X, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";
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

const Swap = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { restrictions } = usePreferences();

  const dayLabel = params.get("dayLabel") ?? "AUJOURD'HUI";
  const mealTypeParam = (params.get("mealType") ?? "DÎNER") as MealType;
  const mealType: MealType = (["DÉJEUNER", "DÎNER", "SOUPER"] as MealType[]).includes(mealTypeParam)
    ? mealTypeParam
    : "DÎNER";
  const calendarEventLabel = params.get("calendarEventLabel") ?? undefined;

  const [index, setIndex] = useState(0);

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

  const next = () => setIndex((i) => (i + 1) % Math.max(total, 1));
  const choose = () => {
    toast("Repas mis à jour", {
      style: { background: "#4A6670", color: "#fff", border: "none" },
      duration: 2500,
    });
    navigate(-1);
  };

  const visible = hasAlts
    ? [0, 1, 2].map((offset) => alts[(index + offset) % total])
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
        {hasAlts ? (
          <div className="relative w-full max-w-[360px]" style={{ height: 460 }}>
            {visible.map((alt, i) => {
              const styles = [
                { scale: 1, ty: 0, opacity: 1, z: 30 },
                { scale: 0.94, ty: 18, opacity: 0.5, z: 20 },
                { scale: 0.88, ty: 32, opacity: 0.25, z: 10 },
              ][i];
              return (
                <article
                  key={`${alt.name}-${i}`}
                  aria-hidden={i !== 0}
                  className="absolute inset-x-0 top-0 bg-white shadow-float p-4"
                  style={{
                    borderRadius: "var(--radius-card)",
                    transform: `translateY(${styles.ty}px) scale(${styles.scale})`,
                    opacity: styles.opacity,
                    pointerEvents: i === 0 ? "auto" : "none",
                    zIndex: styles.z,
                    transition: "transform 240ms ease, opacity 240ms ease",
                  }}
                >
                  {/* Photo */}
                  <div
                    className="relative w-full"
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
                        style={{
                          background: "hsl(var(--accent))",
                          padding: "8px 12px",
                        }}
                      >
                        ▸ {calendarEventLabel}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="px-2 pt-4 pb-2">
                    <h2 className="font-display text-2xl text-foreground leading-snug">
                      {alt.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{alt.prep}</span>
                      <span aria-hidden="true">·</span>
                      <NutriScoreBadge score={alt.score} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
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
        )}

        {/* Counter */}
        {hasAlts && (
          <p className="mt-6 text-sm text-foreground/60" style={{ paddingTop: 24 - 24 }}>
            Option {index + 1} sur {total}
          </p>
        )}
      </div>

      {/* Bottom bar */}
      {hasAlts && (
        <div className="flex gap-3 pt-5">
          <button
            type="button"
            onClick={next}
            className="flex-1 h-14 rounded-full bg-white border border-border text-foreground text-sm font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Autre option
          </button>
          <button
            type="button"
            onClick={choose}
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
