import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingShellProps {
  step: number;
  totalSteps?: number;
  backTo?: string | null;
  children: React.ReactNode;
  cta: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  skipLabel?: string;
  onSkip?: () => void;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  step,
  totalSteps = 8,
  backTo,
  children,
  cta,
  skipLabel,
  onSkip,
}) => {
  const navigate = useNavigate();
  const progressPct = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col pb-28">
        {backTo !== null && (
          <button
            type="button"
            aria-label="Retour"
            onClick={() => backTo && navigate(backTo)}
            className="absolute top-4 left-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-150 z-10"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <div className="mt-[60px] px-6 flex items-center gap-3">
          <div className="flex-1 h-[3px] rounded-full bg-primary/15 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-muted-foreground tabular-nums">
            {step + 1} / {totalSteps}
          </span>
        </div>

        <div className="flex-1 flex flex-col">{children}</div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-6 pt-4 bg-background backdrop-blur-sm border-t border-border/30 shadow-[0_-6px_24px_rgba(42,45,53,0.07)] flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={cta.onClick}
            disabled={cta.disabled}
            className={cn(
              "w-full h-[52px] rounded-xl bg-[hsl(var(--coral))] text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--coral))]/90 transition-colors",
              cta.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {cta.label}
          </button>
          {skipLabel && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-foreground/40"
            >
              {skipLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingShell;