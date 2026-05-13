import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const DEFAULTS = ["cuisinière", "four", "frigo", "micro-ondes"];

const EQUIPMENT = [
  { id: "cuisinière", label: "Cuisinière", desc: "Plaque + ronds" },
  { id: "four", label: "Four", desc: "Conventionnel" },
  { id: "frigo", label: "Frigo", desc: "Standard" },
  { id: "micro-ondes", label: "Micro-ondes", desc: "Réchauffage rapide" },
  { id: "air-fryer", label: "Air fryer", desc: "Recettes croustillantes" },
  { id: "instant-pot", label: "Instant Pot", desc: "Mijotage rapide" },
  { id: "blender", label: "Blender", desc: "Smoothies, soupes" },
  { id: "rice-cooker", label: "Rice cooker", desc: "Riz, quinoa" },
];

const OnboardingKitchen = () => {
  const navigate = useNavigate();
  const { setKitchenEquipment } = usePreferences();
  const [selected, setSelected] = useState<string[]>(DEFAULTS);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <OnboardingShell
      step={3}
      backTo="/onboarding/fit"
      cta={{
        label: "Continuer",
        onClick: () => {
          setKitchenEquipment(selected);
          navigate("/onboarding/groceries");
        },
      }}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          TON ÉQUIPEMENT
        </p>
        <h1 className="font-display text-display-lg text-foreground mt-1 leading-tight">
          Qu'est-ce que t'as
          <br />
          dans ta cuisine ?
        </h1>
        <p className="mt-3 text-sm text-foreground/60">
          On a pré-coché le setup étudiant typique. Ajoute ce que t'as en plus.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {EQUIPMENT.map((eq) => {
            const isActive = selected.includes(eq.id);
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggle(eq.id)}
                className={cn(
                  "rounded-xl border-[1.5px] px-3 py-3 text-left transition-colors relative",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                )}
              >
                {isActive && (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="absolute top-2 right-2"
                  />
                )}
                <p className="font-medium text-sm pr-5">{eq.label}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    isActive ? "text-primary-foreground/70" : "text-foreground/50"
                  )}
                >
                  {eq.desc}
                </p>
              </button>
            );
          })}
        </div>

        {selected.includes("air-fryer") && (
          <p className="mt-6 text-[11px] uppercase tracking-wide text-[hsl(var(--coral))] font-semibold">
            ▸ Tes suggestions intégreront des recettes air fryer.
          </p>
        )}
      </div>
    </OnboardingShell>
  );
};

export default OnboardingKitchen;