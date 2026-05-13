import { useEffect } from "react";
import { toast } from "sonner";
import { X, Salad, Clock, Users, Utensils, Heart } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import { usePreferences } from "@/contexts/PreferencesContext";

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
  onSwap?: () => void;
  context?: "plan" | "library";
}

const INGREDIENTS = [
  { name: "Riz cuit", qty: "180 g" },
  { name: "Carottes râpées", qty: "60 g" },
  { name: "Épinards", qty: "50 g" },
  { name: "Œuf", qty: "1" },
  { name: "Sauce gochujang", qty: "1 c. à soupe" },
  { name: "Huile de sésame", qty: "1 c. à thé" },
  { name: "Graines de sésame", qty: "1 c. à thé" },
];

const STEPS = [
  "Faire cuire le riz et le laisser tiédir. Préparer les légumes : râper les carottes, faire sauter les épinards 2 min à feu vif avec un filet d'huile.",
  "Faire un œuf au plat ou brouillé selon ta préférence. Disposer le riz dans un bol, puis arranger les légumes et l'œuf par-dessus.",
  "Ajouter la sauce gochujang et l'huile de sésame. Garnir de graines de sésame. Mélanger avant de manger.",
];

type NutrientLevel = "low" | "moderate" | "high";

const NUTRIENT_BREAKDOWN: {
  name: string;
  level: NutrientLevel;
  percent: string;
  whatToKnow: string;
  recommendationTitle: string;
  recommendation: string[];
  source: string;
}[] = [
  {
    name: "Matières grasses",
    level: "low",
    percent: "3.33 %",
    whatToKnow:
      "Une consommation élevée de gras, surtout saturés, peut augmenter le cholestérol et les risques de maladies cardiaques.",
    recommendationTitle: "Limiter la consommation de gras et de gras saturés",
    recommendation: ["Choisis des produits à plus faible teneur en matières grasses."],
    source: "National Health Service UK (NHS) — Fat: the facts",
  },
  {
    name: "Gras saturés",
    level: "low",
    percent: "1.67 %",
    whatToKnow:
      "Trop de gras saturés peut élever le cholestérol et augmenter le risque de maladies cardiovasculaires.",
    recommendationTitle: "Limiter la consommation de gras saturés",
    recommendation: ["Privilégie les produits à plus faible teneur en gras saturés."],
    source: "National Health Service UK (NHS) — Fat: the facts",
  },
  {
    name: "Sucres",
    level: "moderate",
    percent: "8.4 %",
    whatToKnow:
      "Une consommation élevée de sucre peut entraîner une prise de poids, des caries et augmenter le risque de diabète de type 2.",
    recommendationTitle: "Limiter la consommation de sucre et de boissons sucrées",
    recommendation: [
      "Limite les boissons sucrées (sodas, jus, nectars) à un verre par jour maximum.",
      "Choisis des produits avec moins de sucres ajoutés.",
    ],
    source: "National Health Service UK (NHS) — Sugar: the facts",
  },
  {
    name: "Sel",
    level: "low",
    percent: "0.42 %",
    whatToKnow:
      "Trop de sel (sodium) peut augmenter la pression artérielle et les risques cardiovasculaires.",
    recommendationTitle: "Limiter la consommation de sel",
    recommendation: [
      "Réduis le sel ajouté à la cuisson et à table.",
      "Limite les snacks salés et choisis des produits moins salés.",
    ],
    source: "Organisation mondiale de la Santé (OMS) — Salt reduction",
  },
];

const LEVEL_LABEL: Record<NutrientLevel, string> = {
  low: "en faible quantité",
  moderate: "en quantité modérée",
  high: "en quantité élevée",
};

const LEVEL_COLOR: Record<NutrientLevel, string> = {
  low: "#3D9970",
  moderate: "#F4C430",
  high: "hsl(var(--accent))",
};

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-eyebrow uppercase text-primary/70 ${className}`}>{children}</p>
);

const RecipeSheet = ({ open, onClose, imageUrl, onSwap, context = "plan" }: Props) => {
  const { savedRecipes, setSavedRecipes } = usePreferences();
  const currentRecipe = {
    id: "bibimbap",
    title: "Bol coréen bibimbap végétarien",
    prep: "25 min",
    portions: "1 portion",
    score: "A" as const,
  };
  const isLiked = savedRecipes.some((r) => r.id === currentRecipe.id);
  const toggleLike = () => {
    if (isLiked) {
      setSavedRecipes(savedRecipes.filter((r) => r.id !== currentRecipe.id));
    } else {
      setSavedRecipes([...savedRecipes, currentRecipe]);
    }
  };
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className="relative w-full max-w-[390px] bg-white rounded-t-[24px] overflow-hidden animate-[slide-up_0.3s_ease-out] flex flex-col"
        style={{ height: "92vh" }}
      >
        <style>{`@keyframes slide-up { from { transform: translateY(100%);} to { transform: translateY(0);} }`}</style>

        {/* Drag handle */}
        <div className="absolute top-0 left-0 right-0 pt-3 flex justify-center z-20">
          <div className="w-8 h-1 rounded-full bg-white/60" />
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Photo hero */}
          <div className="relative w-full h-[280px] overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{
                  background:
                    // DOC: dégradé décoratif placeholder hero recipe — stops tokenisés (beige clair → beige doré → sage). #C9B895 = mid-stop décoratif sans équivalent dans la palette canonique.
                    "linear-gradient(135deg, hsl(var(--photo-placeholder-from)) 0%, #C9B895 50%, hsl(var(--secondary)) 100%)",
                }}
              >
                {/* DOC: hero placeholder — size={80} et strokeWidth={1.5} décoratifs, hors grille standard */}
                <Salad size={80} className="text-foreground" style={{ opacity: 0.25 }} strokeWidth={1.5} />
              </div>
            )}
            {/* Bottom gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(42,45,53,0.4) 100%)",
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center z-10"
              aria-label="Fermer"
            >
              <X size={18} className="text-foreground" />
            </button>
            <button
              onClick={toggleLike}
              aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="absolute top-4 right-16 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-transform active:scale-110"
            >
              {isLiked ? (
                <Heart size={18} fill="currentColor" className="text-accent" />
              ) : (
                <Heart size={18} strokeWidth={2} className="text-foreground/50" />
              )}
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/90 backdrop-blur-sm flex items-center px-3 gap-2 text-[11px] text-foreground">
              <Clock size={12} strokeWidth={2} />
              <span>25 min</span>
              <span className="text-foreground/30">·</span>
              <Utensils size={12} strokeWidth={2} />
              <span>1 portion</span>
              <span className="text-foreground/30">·</span>
              <Pill variant="score-a">A</Pill>
            </div>
          </div>

          {/* Header block */}
          <div className="px-4 pt-5">
            <p className="text-[11px] text-foreground/50 mt-1">
              Recette très équilibrée · via Open Food Facts
            </p>
            <p className="text-eyebrow uppercase text-foreground/50">DÎNER · 12H30</p>
            <h2 className="font-display text-display-lg text-foreground mt-1 leading-snug">
              Bol coréen bibimbap végétarien
            </h2>
            <div className="flex gap-3 items-center text-[13px] text-foreground/60 mt-2">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-primary/60" />
                25 min
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users size={14} className="text-primary/60" />
                1 portion
              </span>
              <span>·</span>
              <span>540 kcal</span>
            </div>
          </div>

          {/* Macros */}
          <div className="mx-4 mt-5">
            <Eyebrow className="mb-2">Par portion</Eyebrow>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Calories", value: "540 kcal" },
                { label: "Protéines", value: "22 g" },
                { label: "Glucides", value: "68 g" },
                { label: "Lipides", value: "16 g" },
              ].map((p) => (
                <div key={p.label} className="bg-surface-paper rounded-xl px-4 py-3">
                  <div className="text-[11px] text-foreground/50 uppercase tracking-wide">
                    {p.label}
                  </div>
                  <div className="font-display text-display-sm text-foreground mt-0.5">
                    {p.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mt-5">
            <Eyebrow className="mb-3 px-4">Ingrédients · {INGREDIENTS.length} éléments</Eyebrow>
            <div className="bg-surface-paper rounded-xl mx-4 px-4 py-1">
              {INGREDIENTS.map((ing, i) => (
                <div
                  key={ing.name}
                  className={`flex items-center justify-between py-2.5 ${
                    i !== INGREDIENTS.length - 1 ? "border-b border-secondary/15" : ""
                  }`}
                >
                  <span className="text-[14px] text-foreground">{ing.name}</span>
                  <span className="text-[14px] text-foreground/60">{ing.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Préparation */}
          <div className="mt-5">
            <Eyebrow className="mb-3 px-4">Préparation · {STEPS.length} étapes</Eyebrow>
            <div className="px-4 flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white font-display text-[13px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[14px] text-foreground leading-[1.6] flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pourquoi ce Nutri-Score */}
          <div className="mt-6 pb-12">
            <Eyebrow className="mb-1 px-4">Pourquoi un Nutri-Score A ?</Eyebrow>
            <p className="px-4 text-[12px] text-foreground/60 leading-relaxed">
              Le Nutri-Score est calculé à partir des nutriments clés pour 100 g. Voici le détail
              pour cette recette :
            </p>
            <div className="mx-4 mt-3 flex flex-col gap-2">
              {NUTRIENT_BREAKDOWN.map((n) => (
                <details
                  key={n.name}
                  className="bg-surface-paper rounded-xl px-3 py-2.5 group"
                >
                  <summary className="flex items-center gap-2.5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: LEVEL_COLOR[n.level] }}
                    />
                    <span className="text-[13px] font-semibold text-foreground flex-1">
                      {n.name} {LEVEL_LABEL[n.level]} ({n.percent})
                    </span>
                    <span className="text-foreground/40 text-[10px] group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-3 pl-5 flex flex-col gap-2.5">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
                        Ce qu'il faut savoir
                      </p>
                      <p className="text-[13px] text-foreground/80 leading-relaxed mt-1">
                        {n.whatToKnow}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
                        Recommandation
                      </p>
                      <p className="text-[13px] text-foreground/80 leading-relaxed mt-1">
                        {n.recommendationTitle}
                      </p>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {n.recommendation.map((r, i) => (
                          <li
                            key={i}
                            className="text-[13px] text-foreground/70 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-foreground/40"
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[11px] italic text-foreground/50">Source : {n.source}</p>
                  </div>
                </details>
              ))}
            </div>
            <p className="px-4 mt-3 text-[11px] text-foreground/45 leading-relaxed">
              Données issues d'Open Food Facts. NexEat n'est pas un service de nutrition et ne
              remplace pas un avis professionnel.
            </p>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-white border-t border-border px-4 py-3">
          {context === "library" ? (
            <button
              onClick={() => {
                toast.success("Ajouté au dîner de mardi", {
                  description: "Contexte étude respecté · Modifier →",
                });
                onClose();
              }}
              className="w-full h-12 rounded-xl bg-accent text-white text-[16px] font-semibold shadow-cta"
            >
              Ajouter à ma semaine
            </button>
          ) : onSwap ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSwap();
                  onClose();
                }}
                className="flex-1 h-12 rounded-xl border-[1.5px] border-primary bg-white text-primary text-[16px] font-semibold"
              >
                Changer ce repas
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-accent text-white text-[16px] font-semibold shadow-cta"
              >
                Fermer
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-accent text-white text-[16px] font-semibold shadow-cta"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSheet;
