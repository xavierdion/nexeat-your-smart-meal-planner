import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { cn } from "@/lib/utils";

const OnboardingDemo = () => {
  const navigate = useNavigate();
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStep(1), 600),
      setTimeout(() => setRevealStep(2), 1800),
      setTimeout(() => setRevealStep(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <OnboardingShell
      step={0}
      backTo={null}
      cta={{
        label: "Commencer",
        onClick: () => navigate("/onboarding/connect"),
      }}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          VOICI POURQUOI
        </p>
        <h1 className="font-display text-display-lg text-foreground mt-1">
          NexEat existe.
        </h1>

        <div className="mt-8 flex flex-col items-stretch">
          {/* Card 1 — calendar event */}
          <div
            className={cn(
              "rounded-2xl bg-white border border-border p-4 transition-all duration-500",
              revealStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
              JEU. 14 MAI · 14H00
            </p>
            <p className="font-display text-lg text-foreground mt-1">
              Examen IFT-2008
            </p>
            <p className="text-sm text-foreground/60 mt-1">
              Pavillon Pouliot · 2h
            </p>
            <p className="text-[10px] uppercase tracking-wide text-foreground/40 font-semibold mt-3">
              DEPUIS TON CALENDRIER
            </p>
          </div>

          {/* Connector */}
          <div
            className={cn(
              "flex flex-col items-center py-3 transition-opacity duration-500",
              revealStep >= 2 ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-px h-6 bg-foreground/20" />
            <span className="text-[10px] uppercase tracking-wide text-foreground/50 font-semibold mt-2">
              NEXEAT SUGGÈRE
            </span>
          </div>

          {/* Card 2 — coral suggestion */}
          <div
            className={cn(
              "rounded-2xl border border-accent/20 p-4 bg-[hsl(var(--accent-soft))] transition-all duration-500",
              revealStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <p className="text-[11px] uppercase tracking-wide text-accent font-semibold">
              ▸ PRÉ-EXAM · JEU. 12H15
            </p>
            <p className="font-display text-lg text-foreground mt-1">
              Saumon, riz brun, brocoli vapeur
            </p>
            <p className="text-sm text-foreground/60 mt-1">
              Glucides lents · 87 $ avec rabais Maxi · 25 min
            </p>
          </div>

          {/* Rationale */}
          <p
            className={cn(
              "mt-6 text-sm text-foreground/70 leading-relaxed transition-opacity duration-500",
              revealStep >= 3 ? "opacity-100" : "opacity-0"
            )}
          >
            Pendant que tu étudies, on lit ton calendrier, on respecte tes restrictions et on intègre les rabais de la semaine.{" "}
            <span className="text-foreground font-medium">Tu n'as plus à y penser.</span>
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase tracking-wide text-foreground/40 font-semibold">
          ~90 SECONDES POUR DÉMARRER
        </p>
      </div>
    </OnboardingShell>
  );
};

export default OnboardingDemo;