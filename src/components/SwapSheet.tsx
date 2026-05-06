import { useEffect, useState } from "react";
import { X, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Score = "A" | "B" | "C" | "D" | "E";

export interface Alternative {
  name: string;
  category: string;
  score: Score;
  prep: string;
  calories: string;
  proteines: string;
  glucides: string;
  lipides: string;
}

const ALTS: Alternative[] = [
  { name: "Riz sauté tofu-légumes-sauce gingembre", category: "Végétarien", score: "A", prep: "18 min", calories: "520 kcal", proteines: "22 g", glucides: "68 g", lipides: "14 g" },
  { name: "Pâtes au pesto et tomates cerises", category: "Végétarien", score: "B", prep: "15 min", calories: "560 kcal", proteines: "18 g", glucides: "82 g", lipides: "18 g" },
  { name: "Bol lentilles-carottes-vinaigrette moutarde", category: "Végétarien", score: "A", prep: "10 min", calories: "430 kcal", proteines: "20 g", glucides: "58 g", lipides: "10 g" },
];

const SCORE_STYLES: Record<Score, { bg: string; text: string }> = {
  A: { bg: "#3E8B3E", text: "#FFFFFF" },
  B: { bg: "#85BB2F", text: "#FFFFFF" },
  C: { bg: "#FFCC00", text: "#2A2D35" },
  D: { bg: "#EE8100", text: "#FFFFFF" },
  E: { bg: "#E63312", text: "#FFFFFF" },
};

interface Props {
  open: boolean;
  onClose: () => void;
  contextLabel: string; // e.g. "DÎNER LUNDI 17"
  onConfirm?: (alt: Alternative) => void;
}

const SwapSheet = ({ open, onClose, contextLabel, onConfirm }: Props) => {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setDrag(0);
    }
  }, [open]);

  if (!open) return null;

  const current = ALTS[index];
  const exhausted = index >= ALTS.length;

  const confirm = () => {
    if (!current) return;
    onConfirm?.(current);
    toast("Repas mis a jour", {
      style: { background: "#4A6670", color: "#fff", border: "none" },
      duration: 2000,
    });
    onClose();
  };

  const skip = () => setIndex((i) => i + 1);

  const onPointerDown = (e: React.PointerEvent) => {
    setStartX(e.clientX);
    setAnimating(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX === null) return;
    setDrag(e.clientX - startX);
  };
  const onPointerUp = () => {
    if (startX === null) return;
    const threshold = 100;
    if (drag > threshold) {
      setAnimating(true);
      setDrag(500);
      setTimeout(confirm, 180);
    } else if (drag < -threshold) {
      setAnimating(true);
      setDrag(-500);
      setTimeout(() => {
        setDrag(0);
        skip();
      }, 180);
    } else {
      setAnimating(true);
      setDrag(0);
    }
    setStartX(null);
  };

  const rotation = drag / 20;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        className="relative w-full max-w-[390px] bg-white rounded-t-[20px] animate-[slide-in-up_0.3s_ease-out]"
        style={{ height: "78vh" }}
      >
        <style>{`@keyframes slide-in-up { from { transform: translateY(100%);} to { transform: translateY(0);} }`}</style>

        {/* Drag handle */}
        <div className="pt-3 flex justify-center">
          <div className="w-8 h-1 rounded-full bg-[#E8E8E4]" />
        </div>

        {/* Header */}
        <div className="px-4 pt-5 flex items-start justify-between">
          <span className="text-[11px] uppercase tracking-wide text-[#2A2D35]/50 font-semibold">
            ALTERNATIVES — {contextLabel}
          </span>
          <button onClick={onClose} className="text-[#2A2D35] -mt-1">
            <X size={24} />
          </button>
        </div>

        <p className="mt-3 px-6 text-center text-[13px] text-[#2A2D35]/60">
          Swipe a droite pour garder, a gauche pour passer
        </p>

        {/* Card area */}
        <div className="relative mt-6 flex justify-center" style={{ height: 360 }}>
          {exhausted ? (
            <div className="flex flex-col items-center justify-center px-8 text-center gap-4">
              <p className="text-[14px] text-[#2A2D35]/60">
                Aucune autre alternative disponible
              </p>
              <button
                onClick={onClose}
                className="px-5 h-11 rounded-xl border-[1.5px] border-[#4A6670] text-[#4A6670] text-[14px] font-semibold"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="absolute left-6 right-6 bg-white rounded-[20px] p-6 select-none touch-none"
              style={{
                boxShadow: "0 8px 32px rgba(42,45,53,0.15)",
                transform: `translateX(${drag}px) rotate(${rotation}deg)`,
                transition: animating ? "transform 180ms ease-out" : "none",
              }}
            >
              <span className="inline-block text-[11px] bg-[#F0F4F3] text-[#4A6670] rounded-md px-2.5 py-[3px]">
                {current.category}
              </span>

              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-[14px] bg-[#F0F4F3] flex items-center justify-center">
                  <ImageIcon size={32} className="text-[#4A6670]/40" />
                </div>
                <h3 className="font-display text-[20px] text-[#2A2D35] text-center leading-snug px-2">
                  {current.name}
                </h3>
                <p className="text-[13px] text-[#2A2D35]/60">{current.prep}</p>
                <span
                  className="text-[11px] font-semibold rounded-md px-[7px] py-[3px]"
                  style={{ background: SCORE_STYLES[current.score].bg, color: SCORE_STYLES[current.score].text }}
                >
                  {current.score}
                </span>
              </div>

              <div className="mt-5 flex justify-center gap-2">
                {[
                  { label: "Calories", value: current.calories },
                  { label: "Protéines", value: current.proteines },
                  { label: "Glucides", value: current.glucides },
                  { label: "Lipides", value: current.lipides },
                ].map((p) => (
                  <div key={p.label} className="bg-[#F0F4F3] rounded-lg px-3 py-1.5 text-center">
                    <div className="text-[11px] text-[#2A2D35]/50 leading-tight">{p.label}</div>
                    <div className="text-[13px] font-semibold text-[#2A2D35] leading-tight mt-0.5">{p.value}</div>
                  </div>
                ))}
              </div>

              {/* Drag hint badges */}
              <div
                className="absolute top-6 left-6 px-2 py-1 rounded-md border-2 border-[#E07A5F] text-[#E07A5F] text-[12px] font-bold rotate-[-12deg]"
                style={{ opacity: Math.min(Math.max(-drag / 100, 0), 1) }}
              >
                PASSER
              </div>
              <div
                className="absolute top-6 right-6 px-2 py-1 rounded-md border-2 border-[#3E8B3E] text-[#3E8B3E] text-[12px] font-bold rotate-[12deg]"
                style={{ opacity: Math.min(Math.max(drag / 100, 0), 1) }}
              >
                GARDER
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!exhausted && (
          <div className="mt-2 flex justify-center gap-4">
            <button
              onClick={skip}
              className="w-[52px] h-[52px] rounded-full bg-white border-[1.5px] border-[#E8E8E4] flex items-center justify-center"
              aria-label="Passer"
            >
              <X size={22} className="text-[#2A2D35]/60" />
            </button>
            <button
              onClick={confirm}
              className="w-[52px] h-[52px] rounded-full bg-[#E07A5F] flex items-center justify-center"
              aria-label="Garder"
            >
              <Check size={22} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapSheet;
