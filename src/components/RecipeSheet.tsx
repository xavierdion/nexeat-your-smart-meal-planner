import { useEffect } from "react";
import { X, Salad, Clock, Users } from "lucide-react";
import { Pill } from "@/components/ui/pill";
import ScoreTooltip from "@/components/ScoreTooltip";
import ProactiveContextBlock from "@/components/ProactiveContextBlock";

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl?: string;
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

const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-eyebrow uppercase text-[#4A6670]/70 ${className}`}>{children}</p>
);

const RecipeSheet = ({ open, onClose, imageUrl }: Props) => {
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
                    "linear-gradient(135deg, #E8E2D8 0%, #C9B895 50%, #A8C5BC 100%)",
                }}
              >
                <Salad size={80} className="text-[#2A2D35]" style={{ opacity: 0.25 }} strokeWidth={1.5} />
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
              <X size={18} className="text-[#2A2D35]" />
            </button>
            <span className="absolute bottom-3 left-4 inline-flex items-center rounded-[6px] text-[11px] leading-none font-medium px-[10px] py-[3px] bg-white/95 backdrop-blur-sm text-[#4A6670]">
              Végétarien
            </span>
            <div className="absolute bottom-3 right-4">
              <ScoreTooltip score="A" />
            </div>
          </div>

          {/* Header block */}
          <div className="px-4 pt-5">
            <p className="text-eyebrow uppercase text-[#2A2D35]/50">DÎNER · 12H30</p>
            <h2 className="font-display text-display-lg text-[#2A2D35] mt-1 leading-snug">
              Bol coréen bibimbap végétarien
            </h2>
            <div className="flex gap-3 items-center text-[13px] text-[#2A2D35]/60 mt-2">
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-[#4A6670]/60" />
                25 min
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users size={14} className="text-[#4A6670]/60" />
                1 portion
              </span>
              <span>·</span>
              <span>540 kcal</span>
            </div>
          </div>

          {/* Pourquoi ce repas */}
          <div className="mx-4 mt-5">
            <Eyebrow className="mb-2">Pourquoi ce repas ?</Eyebrow>
            <ProactiveContextBlock
              variant="banner"
              eventTitle="Examen IFT-2008"
              eventTime="18h"
              mealLabel="Dîner"
              mealTime="12h30"
              rationale="Bibimbap végétarien — protéines complexes (œuf + tofu) pour soutenir ta concentration sans pic glycémique. Léger sur l'estomac avant l'examen."
            />
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
                  <div className="text-[11px] text-[#2A2D35]/50 uppercase tracking-wide">
                    {p.label}
                  </div>
                  <div className="font-display text-display-sm text-[#2A2D35] mt-0.5">
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
                    i !== INGREDIENTS.length - 1 ? "border-b border-[#F0F4F3]" : ""
                  }`}
                >
                  <span className="text-[14px] text-[#2A2D35]">{ing.name}</span>
                  <span className="text-[14px] text-[#2A2D35]/60">{ing.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Préparation */}
          <div className="mt-5 pb-12">
            <Eyebrow className="mb-3 px-4">Préparation · {STEPS.length} étapes</Eyebrow>
            <div className="px-4 flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4A6670] text-white font-display text-[13px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-[14px] text-[#2A2D35] leading-[1.6] flex-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-white border-t border-[#E8E8E4] px-4 py-3">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-[#E07A5F] text-white text-[16px] font-semibold shadow-[0_4px_16px_rgba(224,122,95,0.25)]"
          >
            C'est parti !
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeSheet;
