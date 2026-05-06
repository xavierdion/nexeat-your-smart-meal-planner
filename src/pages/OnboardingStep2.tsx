import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const QUICK_VALUES = [50, 85, 120, 150];

const OnboardingStep2 = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<number>(85);

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col pb-28">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/onboarding")}
          className="absolute top-4 left-2 w-11 h-11 inline-flex items-center justify-center text-foreground"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center justify-center gap-2 mt-[60px]">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-secondary" />
        </div>

        <div className="mt-8 px-6 text-center">
          <h1 className="font-display text-[28px] leading-tight text-foreground">
            Ton budget alimentaire ?
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Par semaine, épicerie incluse
          </p>
        </div>

        <div className="mt-10 px-4 text-center">
          <div className="font-display text-[48px] leading-none text-primary">
            {value} $⁄sem
          </div>
          <p className="mt-3 text-xs text-foreground/50">
            Typique pour un étudiant : 75–150 $
          </p>
        </div>

        <div className="mt-8 px-4">
          <Slider
            value={[value]}
            min={40}
            max={200}
            step={5}
            onValueChange={(v) => setValue(v[0])}
            className="[&_[data-orientation=horizontal]]:h-1.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_.bg-secondary]:bg-[#E8E8E4] [&_.bg-primary]:bg-primary"
          />
        </div>

        <div className="mt-8 px-4 flex flex-wrap gap-2 justify-center">
          {QUICK_VALUES.map((v) => {
            const isActive = value === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setValue(v)}
                className={cn(
                  "px-4 py-2.5 rounded-[20px] text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-[1.5px] border-primary"
                    : "bg-white text-foreground border-[1.5px] border-border"
                )}
              >
                {v} $
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-6 pt-4 bg-background">
          <button
            type="button"
            onClick={() => navigate("/onboarding/3")}
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

export default OnboardingStep2;