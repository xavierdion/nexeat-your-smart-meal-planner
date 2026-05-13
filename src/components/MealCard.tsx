import * as React from "react";
import { motion, type PanInfo } from "framer-motion";
import { Calendar, Clock, Coffee, Salad, Utensils, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NutriScoreBadge, NUTRI_SCORE_TEXT } from "@/components/ui/nutri-score-badge";

type Score = "A" | "B" | "C" | "D" | "E";
type MealType = "DÉJEUNER" | "DÎNER" | "SOUPER";

function ScorePillWithTooltip({ score }: { score: Score }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    const t = setTimeout(() => document.addEventListener("click", handler), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handler);
    };
  }, [open]);
  return (
    <span
      className="relative inline-flex"
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
    >
      <NutriScoreBadge score={score} />
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 whitespace-nowrap bg-foreground text-background text-[11px] rounded-lg px-3 py-2">
          {NUTRI_SCORE_TEXT[score]}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid hsl(var(--foreground))",
            }}
          />
        </span>
      )}
    </span>
  );
}

export interface MealCardProps {
  variant?: "full" | "compact";
  mealType: MealType;
  time?: string;
  title: string;
  category: string;
  isNew?: boolean;
  prep: string;
  score: Score;
  portions?: string;
  imageUrl?: string;
  proactiveContext?: string;
  status?: { label: string; tone: "done" | "active" | "queued" };
  onClick?: () => void;
  draggable?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

function InfoBanner({
  prep,
  portions,
  score,
}: {
  prep: string;
  portions: string;
  score: Score;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/90 backdrop-blur-sm flex items-center px-3 gap-2 text-[11px] text-foreground">
      <Clock size={12} className="text-foreground" strokeWidth={2} />
      <span>{prep}</span>
      <span className="text-foreground/30">·</span>
      <Utensils size={12} className="text-foreground" strokeWidth={2} />
      <span>{portions}</span>
      <span className="text-foreground/30">·</span>
      <ScorePillWithTooltip score={score} />
    </div>
  );
}

const MEAL_ICONS: Record<MealType, LucideIcon> = {
  DÉJEUNER: Coffee,
  DÎNER: Salad,
  SOUPER: Utensils,
};

const PLACEHOLDER_BG =
  "linear-gradient(135deg, hsl(var(--photo-placeholder-from)) 0%, hsl(var(--photo-placeholder-to)) 100%)";

function PhotoPlaceholder({
  mealType,
  iconSize = 56,
  rounded,
}: {
  mealType: MealType;
  iconSize?: number;
  rounded: string;
}) {
  const Icon = MEAL_ICONS[mealType];
  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", rounded)}
      style={{ background: PLACEHOLDER_BG }}
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {/* DOC: strokeWidth={1.5} — placeholder décoratif (PhotoPlaceholder), trait fin volontaire */}
        <Icon size={iconSize} className="text-foreground" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: NonNullable<MealCardProps["status"]> }) {
  const styles =
    status.tone === "done"
      ? "bg-secondary/20 text-primary"
      : status.tone === "active"
      ? "bg-accent text-white"
      : "bg-[#E8E8E4] text-foreground/60";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] text-[11px] leading-none font-semibold px-[10px] py-[3px] whitespace-nowrap",
        styles,
      )}
    >
      {status.label}
    </span>
  );
}

export const MealCard = React.forwardRef<HTMLDivElement, MealCardProps>(
  (
    {
      variant = "full",
      mealType,
      time,
      title,
      category,
      isNew,
      prep,
      score,
      portions = "1 portion",
      imageUrl,
      proactiveContext,
      status,
      onClick,
      draggable,
      onSwipeLeft,
      onSwipeRight,
      className,
    },
    ref,
  ) => {
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          onClick={onClick}
          className={cn(
            "flex gap-3 p-3 bg-white rounded-2xl shadow-card",
            onClick && "cursor-pointer",
            className,
          )}
        >
          <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <PhotoPlaceholder mealType={mealType} iconSize={28} rounded="rounded-xl" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {status && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <StatusPill status={status} />
              </div>
            )}
            <p className={cn("text-eyebrow uppercase text-foreground/50", status && "mt-1.5")}>
              {mealType}
              {time ? ` · ${time}` : ""}
            </p>
            <h3 className="font-display text-display-sm text-foreground line-clamp-2 mt-0.5">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-foreground">
              <Clock size={12} strokeWidth={2} />
              <span>{prep}</span>
              <span className="text-foreground/30">·</span>
              <Utensils size={12} strokeWidth={2} />
              <span>{portions}</span>
              <span className="text-foreground/30">·</span>
              <ScorePillWithTooltip score={score} />
            </div>
          </div>
        </div>
      );
    }

    // FULL
    const hasDragged = React.useRef(false);

    const content = (
      <div
        className={cn(
          "rounded-2xl shadow-card bg-white overflow-hidden",
          onClick && !draggable && "cursor-pointer",
          className,
        )}
      >
        {/* Photo hero */}
        <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <PhotoPlaceholder mealType={mealType} iconSize={56} rounded="" />
          )}
          <InfoBanner prep={prep} portions={portions} score={score} />
        </div>

        {/* Body */}
        <div className="bg-white px-4 py-4">
          {proactiveContext && (
            <div className="flex items-center gap-2 bg-[hsl(var(--accent-soft))] text-accent rounded-[10px] px-3 py-2.5 mb-3">
              <Calendar size={14} className="shrink-0" />
              <span className="text-[12px] font-medium leading-tight">{proactiveContext}</span>
            </div>
          )}
          <p className="text-eyebrow uppercase text-foreground/50">{mealType}</p>
          <h3 className="font-display text-display-md text-foreground line-clamp-2 mt-1">
            {title}
          </h3>
        </div>
      </div>
    );

    if (draggable) {
      return (
        <motion.div
          ref={ref}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragStart={() => {
            hasDragged.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 8) hasDragged.current = true;
          }}
          onDragEnd={(_, info: PanInfo) => {
            if (info.offset.x < -100) onSwipeLeft?.();
            else if (info.offset.x > 100) onSwipeRight?.();
          }}
          onClick={() => {
            if (!hasDragged.current) onClick?.();
          }}
          className="mb-5"
        >
          {content}
        </motion.div>
      );
    }

    return (
      <div ref={ref} onClick={onClick} className="mb-5">
        {content}
      </div>
    );
  },
);
MealCard.displayName = "MealCard";

export default MealCard;
