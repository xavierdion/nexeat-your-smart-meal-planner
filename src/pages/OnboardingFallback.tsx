import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

type FallbackOption =
  | "delivery"
  | "leftovers"
  | "quick-sandwich"
  | "snacks"
  | "skip";

const OPTIONS: Array<{
  id: FallbackOption;
  label: string;
  rationale: string;
}> = [
  {
    id: "delivery",
    label: "Pizza commandée / livraison",
    rationale:
      "On gardera une option livraison dans tes suggestions les soirs d'exam.",
  },
  {
    id: "leftovers",
    label: "Restants du frigo (on flag pour batch cooking)",
    rationale:
      "On augmentera la fréquence des recettes en batch dans ton plan.",
  },
  {
    id: "quick-sandwich",
    label: "Sandwich / wrap rapide (5 min max)",
    rationale:
      "On garantira un repas <5 min disponible chaque soir de pic.",
  },
  {
    id: "snacks",
    label: "Snacks / pas vraiment un repas",
    rationale:
      "On préparera des snacks salés satisfaisants pour ces moments.",
  },
  {
    id: "skip",
    label: "Je saute le repas (on te le dira jamais)",
    rationale:
      "OK. On ne juge pas. Tes suggestions resteront sur 2-3 repas certains jours.",
  },
];

const OnboardingFallback = () => {
  const navigate = useNavigate();
  const { setFallbackMeal, setOnboardingCompleted } = usePreferences();
  const [selected, setSelected] = useState<FallbackOption | null>(null);

  return (
    <OnboardingShell
      step={6}
      backTo="/onboarding/budget"
      cta={{
        label: "Terminer",
        onClick: () => {
          if (!selected) return;
          setFallbackMeal(selected);
          setOnboardingCompleted(true);
          navigate("/generation");
        },
        disabled: !selected,
      }}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          DERNIÈRE ÉTAPE — PROMIS
        </p>
        <h1 className="font-display text-display-xl text-foreground mt-1">
          Quand t'es brûlé.
        </h1>
        <p className="mt-3 text-sm text-foreground/60">
          On le sait, ça arrive. Un examen à 19h, t'as plus rien dans le tank.{" "}
          <span className="text-foreground font-medium">Ton plan B ?</span>
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "rounded-xl border-[1.5px] px-4 py-3.5 text-left flex items-center justify-between gap-3 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                )}
              >
                <span className="font-medium">{opt.label}</span>
                {isActive && (
                  <Check size={18} strokeWidth={2.5} className="shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <p className="mt-6 text-[11px] uppercase tracking-wide text-[hsl(var(--coral))] font-semibold leading-relaxed">
            ▸ {OPTIONS.find((o) => o.id === selected)?.rationale}
          </p>
        )}
      </div>
    </OnboardingShell>
  );
};

export default OnboardingFallback;