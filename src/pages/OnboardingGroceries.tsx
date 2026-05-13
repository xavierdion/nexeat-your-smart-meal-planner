import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const STORES = [
  { id: "maxi", label: "Maxi", teaser: "Saumon à 8,99 $ / lb cette sem." },
  { id: "iga", label: "IGA", teaser: "Avocats 3 / 5 $" },
  { id: "super-c", label: "Super C", teaser: "Riz brun 5 lb à 6,49 $" },
  { id: "metro", label: "Metro", teaser: "Tofu BIO à 50 % off" },
  { id: "provigo", label: "Provigo", teaser: "Pâtes à 1,99 $" },
  { id: "costco", label: "Costco", teaser: "Quinoa 2 kg à 12,99 $" },
];

const OnboardingGroceries = () => {
  const navigate = useNavigate();
  const { setGroceryStores } = usePreferences();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <OnboardingShell
      step={4}
      backTo="/onboarding/kitchen"
      cta={{
        label:
          selected.length > 0
            ? `Continuer · ${selected.length} épicerie${selected.length > 1 ? "s" : ""}`
            : "Continuer",
        onClick: () => {
          setGroceryStores(selected);
          navigate("/onboarding/budget");
        },
        disabled: selected.length === 0,
      }}
      skipLabel="Je choisirai plus tard →"
      onSkip={() => {
        setGroceryStores([]);
        navigate("/onboarding/budget");
      }}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          OÙ TU FAIS TON ÉPICERIE
        </p>
        <h1 className="font-display text-display-lg italic text-foreground mt-1 leading-tight">
          On intègre
          <br />
          les rabais.
        </h1>
        <p className="mt-3 text-sm text-foreground/60">
          Dis-nous où tu magasines, et chaque plan sera optimisé pour les promos.{" "}
          <span className="text-foreground font-medium">Économie moyenne : 18 $ / sem.</span>
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {STORES.map((s) => {
            const isActive = selected.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={cn(
                  "rounded-xl border-[1.5px] px-4 py-3.5 text-left transition-colors relative",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border"
                )}
              >
                {isActive && (
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className="absolute top-3 right-3"
                  />
                )}
                <p className="font-medium text-sm pr-6">{s.label}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    isActive
                      ? "text-primary-foreground/70"
                      : "text-[hsl(var(--coral))]"
                  )}
                >
                  ▸ {s.teaser}
                </p>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <p className="mt-6 text-[11px] uppercase tracking-wide text-[hsl(var(--coral))] font-semibold">
            ▸ Économies potentielles cette semaine : ~{selected.length * 6} $ — {selected.length * 11} $.
          </p>
        )}
      </div>
    </OnboardingShell>
  );
};

export default OnboardingGroceries;