import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type StyleId = "express" | "varie" | "economique";

const STYLES: {
  id: StyleId;
  title: string;
  subtitle: string;
  tags: [string, string];
  dot: string;
}[] = [
  {
    id: "express",
    title: "Express",
    subtitle: "Rapide à préparer, ingrédients simples",
    tags: ["< 20 min", "Peu d'ingrédients"],
    dot: "#E07A5F",
  },
  {
    id: "varie",
    title: "Varié",
    subtitle: "Découverte culinaire, saveurs du monde",
    tags: ["Cuisine variée", "Nouvelles saveurs"],
    dot: "#4A6670",
  },
  {
    id: "economique",
    title: "Économique",
    subtitle: "Optimisé pour ton budget, zéro gaspillage",
    tags: ["Budget max", "Anti-gaspillage"],
    dot: "#A8C5BC",
  },
];

const ChoixStyle = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<StyleId>("varie");

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col pb-32">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-2 w-11 h-11 inline-flex items-center justify-center text-foreground"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="mt-[60px] px-6 text-center">
          <h1 className="font-display text-2xl text-foreground">
            Quel style de semaine ?
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Tu pourras changer plus tard
          </p>
        </div>

        <div className="mt-8 px-4 flex flex-col gap-3">
          {STYLES.map((s) => {
            const isActive = selected === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={cn(
                  "w-full text-left rounded-2xl p-5 shadow-card border-2 transition-colors",
                  isActive
                    ? "border-primary bg-[#F0F4F3]"
                    : "border-transparent bg-white"
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.dot }}
                  />
                  <span className="text-base font-semibold text-foreground">
                    {s.title}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-foreground/60">
                  {s.subtitle}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-background text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-6 pt-4 bg-background">
          <button
            type="button"
            onClick={() => navigate("/generation")}
            className="w-full h-[52px] rounded-xl bg-[hsl(var(--coral))] text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--coral))]/90 transition-colors"
          >
            Générer ma semaine
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoixStyle;