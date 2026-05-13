import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const Generation = () => {
  const navigate = useNavigate();
  const { restrictions, groceryStores, calendarConnected } = usePreferences();
  const [revealedLines, setRevealedLines] = useState(0);

  const narrative = [
    calendarConnected
      ? "Lecture de ton calendrier… 4 événements importants détectés cette semaine."
      : "Mode démo activé · plan exemple en cours.",
    restrictions.length > 0
      ? `Restrictions ${restrictions.slice(0, 2).join(", ").toLowerCase()} respectées.`
      : "Aucune restriction — plein éventail de recettes disponibles.",
    groceryStores.length > 0
      ? `Rabais ${groceryStores.slice(0, 2).join(" + ")} intégrés au budget.`
      : "Plan budgétaire standard appliqué.",
    "Plan composé.",
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealedLines(1), 600),
      setTimeout(() => setRevealedLines(2), 1500),
      setTimeout(() => setRevealedLines(3), 2400),
      setTimeout(() => setRevealedLines(4), 3300),
      setTimeout(() => navigate("/semaine"), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate, groceryStores, restrictions, calendarConnected]);

  const progressPct = (revealedLines / narrative.length) * 100;

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col px-6 pt-[80px] pb-12">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 text-[12px] text-foreground/35 font-medium hover:text-foreground/60 transition-colors"
        >
          Annuler
        </button>
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          COMPOSITION EN COURS
        </p>
        <h1 className="font-display text-display-xl italic text-foreground mt-1 leading-tight">
          Ta semaine,
          <br />
          en construction.
        </h1>

        <div className="mt-10 flex flex-col gap-4">
          {narrative.map((line, i) => (
            <p
              key={i}
              className={cn(
                "text-sm text-foreground/80 leading-relaxed transition-opacity duration-500",
                revealedLines > i ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="text-[hsl(var(--coral))] font-semibold">▸</span>{" "}
              {line}
            </p>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="h-1 rounded-full bg-secondary/30 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generation;