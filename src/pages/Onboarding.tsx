import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/contexts/PreferencesContext";

const RESTRICTIONS = [
  "Aucune restriction",
  "Sans gluten",
  "Végétarien",
  "Végétalien",
  "Sans produits laitiers",
  "Sans noix",
  "Sans fruits de mer",
  "Halal",
  "Casher",
];

const NONE = "Aucune restriction";

const Onboarding = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const { setRestrictions } = usePreferences();

  const toggle = (chip: string) => {
    setSelected((prev) => {
      if (chip === NONE) {
        return prev.includes(NONE) ? [] : [NONE];
      }
      const without = prev.filter((c) => c !== NONE);
      return without.includes(chip)
        ? without.filter((c) => c !== chip)
        : [...without, chip];
    });
  };

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col pb-28">
        <div className="flex items-center justify-center gap-2 mt-[60px]">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="w-2 h-2 rounded-full bg-secondary" />
        </div>
        <p className="text-center text-[11px] uppercase tracking-wide text-foreground/50 mt-2 font-semibold">
          Étape 1 sur 3
        </p>

        <div className="mt-8 px-6 text-center">
          <h1 className="font-display text-display-lg text-foreground">
            Qu'est-ce que tu évites ?
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Sélectionne tout ce qui s'applique
          </p>
        </div>

        <div className="mt-8 px-4 flex flex-wrap gap-2 justify-center">
          {RESTRICTIONS.map((chip) => {
            const isActive = selected.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggle(chip)}
                className={cn(
                  "px-4 py-2.5 rounded-[20px] text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-[1.5px] border-primary"
                    : "bg-white text-foreground border-[1.5px] border-border"
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-6 pt-4 bg-background">
          <button
            type="button"
            onClick={() => {
              setRestrictions(selected);
              navigate("/onboarding/2");
            }}
            className="w-full h-[52px] rounded-xl bg-[hsl(var(--coral))] text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--coral))]/90 transition-colors"
          >
            Continuer
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;