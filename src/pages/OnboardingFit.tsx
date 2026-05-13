import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { usePreferences, Lifestyle } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const LIFESTYLES = [
  { value: "solo", label: "Solo", desc: "1 portion par repas" },
  { value: "coloc", label: "Coloc", desc: "1 portion, on flag les batchs" },
  { value: "famille", label: "Famille / couple", desc: "2+ portions par repas" },
] as const;

const RESTRICTIONS = [
  "Sans gluten",
  "Végétarien",
  "Végétalien",
  "Sans produits laitiers",
  "Sans noix",
  "Sans fruits de mer",
  "Halal",
  "Casher",
];

const OnboardingFit = () => {
  const navigate = useNavigate();
  const { setRestrictions, setLifestyle } = usePreferences();
  const [selectedLifestyle, setSelectedLifestyle] =
    useState<Exclude<Lifestyle, null>>("solo");
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  const toggleRestriction = (r: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const handleNext = () => {
    setLifestyle(selectedLifestyle);
    setRestrictions(selectedRestrictions);
    navigate("/onboarding/kitchen");
  };

  return (
    <OnboardingShell
      step={2}
      backTo="/onboarding/connect"
      cta={{ label: "Continuer", onClick: handleNext }}
    >
      <div className="px-6 mt-8">
        {/* Section 1 — Mode de vie */}
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          QUI MANGE
        </p>
        <h1 className="font-display text-display-lg italic text-foreground mt-1">
          Tu manges seul, ou pas ?
        </h1>

        <div className="mt-6 flex flex-col gap-2">
          {LIFESTYLES.map((l) => {
            const isActive = selectedLifestyle === l.value;
            return (
              <button
                key={l.value}
                type="button"
                onClick={() => setSelectedLifestyle(l.value)}
                className={cn(
                  "rounded-xl border-[1.5px] px-4 py-3.5 text-left flex items-center justify-between gap-3 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{l.label}</span>
                  <span
                    className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-primary-foreground/70" : "text-foreground/50"
                    )}
                  >
                    {l.desc}
                  </span>
                </div>
                {isActive && <Check size={18} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* Section 2 — Restrictions */}
        <div className="mt-10">
          <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
            CE QUE TU ÉVITES
          </p>
          <h2 className="font-display text-display-md italic text-foreground mt-1">
            Des contraintes ?
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Tape sur tout ce qui s'applique. Si rien — tape juste sur «&nbsp;Continuer&nbsp;».
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {RESTRICTIONS.map((r) => {
              const isActive = selectedRestrictions.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRestriction(r)}
                  className={cn(
                    "px-4 py-2.5 rounded-[20px] text-sm transition-colors border-[1.5px]",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border"
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Micro-rationale conditionnel */}
        {selectedRestrictions.length > 0 && (
          <p className="mt-6 text-[11px] uppercase tracking-wide text-[hsl(var(--coral))] font-semibold">
            ▸ On éliminera {selectedRestrictions.length} type
            {selectedRestrictions.length > 1 ? "s" : ""} d'ingrédients de tes suggestions.
          </p>
        )}
      </div>
    </OnboardingShell>
  );
};

export default OnboardingFit;