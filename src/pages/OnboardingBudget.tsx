import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "@/components/OnboardingShell";
import { Slider } from "@/components/ui/slider";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const QUICK_VALUES = [75, 100, 125, 150];

const OnboardingBudget = () => {
  const navigate = useNavigate();
  const { setBudget } = usePreferences();
  const [value, setValue] = useState(100);

  const getLabel = () => {
    if (value < 75) return "Très serré — repas minimalistes privilégiés";
    if (value > 150) return "Variété maximale, batchs ambitieux possibles";
    return "Typique étudiant — équilibre coût / variété";
  };

  return (
    <OnboardingShell
      step={5}
      backTo="/onboarding/groceries"
      cta={{
        label: "Continuer",
        onClick: () => {
          setBudget(value);
          navigate("/onboarding/fallback");
        },
      }}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          TON BUDGET
        </p>
        <h1 className="font-display text-display-lg text-foreground mt-1">
          Combien par semaine ?
        </h1>
        <p className="mt-3 text-sm text-foreground/60">
          Épicerie incluse. Tu pourras ajuster en tout temps dans ton profil.
        </p>

        {/* Value display */}
        <div className="mt-8 text-center">
          <div className="font-display text-display-2xl text-primary tabular-nums">
            {value} $
          </div>
          <p className="text-xs text-foreground/50 mt-1">par semaine</p>
          <p className="mt-3 text-[11px] uppercase tracking-wide text-[hsl(var(--coral))] font-semibold">
            ▸ {getLabel()}
          </p>
        </div>

        {/* Slider */}
        <div className="mt-8">
          <Slider
            value={[value]}
            min={50}
            max={200}
            step={5}
            onValueChange={(v) => setValue(v[0])}
            className="[&_[data-orientation=horizontal]]:h-1.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_.bg-secondary]:bg-[#E8E8E4] [&_.bg-primary]:bg-primary"
          />
          <div className="flex justify-between mt-2 text-[11px] uppercase tracking-wide text-foreground/40 font-semibold">
            <span>50 $</span>
            <span>200 $</span>
          </div>
        </div>

        {/* Quick presets */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {QUICK_VALUES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setValue(v)}
              className={cn(
                "px-4 py-2.5 rounded-[20px] text-sm border-[1.5px] transition-colors",
                value === v
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white text-foreground border-border"
              )}
            >
              {v} $
            </button>
          ))}
        </div>

        {/* Source data — credibility marker */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-wide text-foreground/40 font-semibold">
          ▸ Données : sondage NexEat 2026 · n≈150
        </p>
      </div>
    </OnboardingShell>
  );
};

export default OnboardingBudget;