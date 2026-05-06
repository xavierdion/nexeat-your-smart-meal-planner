import { useEffect } from "react";
import { X, Calendar, Salad } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const INGREDIENTS = [
  { name: "Riz cuit", qty: "180 g" },
  { name: "Carottes rapees", qty: "60 g" },
  { name: "Épinards", qty: "50 g" },
  { name: "Oeuf", qty: "1" },
  { name: "Sauce gochujang", qty: "1 c. a soupe" },
  { name: "Huile de sesame", qty: "1 c. a the" },
  { name: "Graines de sesame", qty: "1 c. a the" },
];

const STEPS = [
  "Faire cuire le riz et le laisser tiedir. Preparer les légumes : raper les carottes, faire sauter les epinards 2 min a feu vif avec un filet d'huile.",
  "Faire un oeuf au plat ou brouille selon ta preference. Disposer le riz dans un bol, puis arranger les légumes et l'oeuf par-dessus.",
  "Ajouter la sauce gochujang et l'huile de sesame. Garnir de graines de sesame. Melanger avant de manger.",
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#2A2D35] mt-5 mb-3 px-4">
    {children}
  </h3>
);

const RecipeSheet = ({ open, onClose }: Props) => {
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
          <div className="w-8 h-1 rounded-full bg-[#E8E8E4]" />
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Photo area */}
          <div className="relative w-full h-[200px] bg-[#F0F4F3] flex items-center justify-center">
            <Salad size={56} className="text-[#4A6670]" style={{ opacity: 0.3 }} strokeWidth={1.8} />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"
              aria-label="Fermer"
            >
              <X size={18} className="text-[#2A2D35]" />
            </button>
          </div>

          {/* Header block */}
          <div className="px-4 pt-5">
            <div className="flex items-center justify-between">
              <span className="inline-block text-[11px] bg-[#F0F4F3] text-[#4A6670] rounded-md px-2.5 py-[3px]">
                Végétarien
              </span>
              <span
                className="text-[11px] font-semibold rounded-md px-[7px] py-[3px]"
                style={{ background: "#3E8B3E", color: "#FFFFFF" }}
              >
                A
              </span>
            </div>
            <h2 className="font-display text-[22px] text-[#2A2D35] mt-2 leading-snug">
              Bol coreen bibimbap vegetarien
            </h2>
            <p className="mt-2 text-[13px] text-[#2A2D35]/60">
              25 min · 1 portion · 540 kcal
            </p>
          </div>

          {/* Macro pills 2x2 */}
          <div className="grid grid-cols-2 gap-2 mx-4 mt-4">
            {[
              { label: "Calories", value: "540 kcal" },
              { label: "Protéines", value: "22 g" },
              { label: "Glucides", value: "68 g" },
              { label: "Lipides", value: "16 g" },
            ].map((p) => (
              <div key={p.label} className="bg-[#F0F4F3] rounded-xl px-4 py-3">
                <div className="text-[11px] text-[#2A2D35]/50">{p.label}</div>
                <div className="text-[15px] font-semibold text-[#2A2D35] mt-0.5">{p.value}</div>
              </div>
            ))}
          </div>

          {/* Pourquoi ce repas */}
          <SectionLabel>Pourquoi ce repas ?</SectionLabel>
          <div className="mx-4 bg-[#F0F4F3] rounded-xl px-4 py-[14px] flex gap-3">
            <Calendar size={16} className="text-[#4A6670] shrink-0 mt-[3px]" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#2A2D35] leading-relaxed">
                Examen IFT-2008 ce soir a 18h. NexEat a choisi un repas riche en proteines complexes pour maintenir ta concentration sur la duree sans pic glycemique.
              </p>
              <p className="text-[11px] text-[#A8C5BC] mt-2">
                Base sur ton calendrier Google · lun. 17 mai
              </p>
            </div>
          </div>

          {/* Ingredients */}
          <SectionLabel>Ingredients</SectionLabel>
          <div className="px-4 flex flex-col gap-[10px]">
            {INGREDIENTS.map((ing) => (
              <div key={ing.name} className="flex items-center justify-between">
                <span className="text-[14px] text-[#2A2D35]">{ing.name}</span>
                <span className="text-[14px] text-[#2A2D35]/60">{ing.qty}</span>
              </div>
            ))}
          </div>

          {/* Preparation */}
          <SectionLabel>Preparation</SectionLabel>
          <div className="px-4 flex flex-col gap-4 pb-8">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4A6670] text-white text-[13px] font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-[14px] text-[#2A2D35] leading-[1.5] flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSheet;
