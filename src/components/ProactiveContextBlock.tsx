import * as React from "react";
import { ArrowRight, Calendar } from "lucide-react";

interface BannerProps {
  variant: "banner";
  eventTitle: string;
  eventTime: string;
  mealLabel: string;
  mealTime: string;
  rationale: string;
}

interface InlineProps {
  variant: "inline";
  text: string;
}

interface MarginaliaProps {
  variant: "marginalia";
  eventLabel: string;
  eventDay: string;
  eventTime: string;
  rationale?: string;
}

type Props = BannerProps | InlineProps | MarginaliaProps;

export const ProactiveContextBlock: React.FC<Props> = (props) => {
  if (props.variant === "marginalia") {
    return (
      <div className="relative -mx-5 pl-5 pr-5 py-3 bg-[hsl(var(--coral-wash))] border-l-2 border-accent">
        <p className="font-mono text-kicker-mono uppercase text-accent">
          ▸ {props.eventLabel} · {props.eventDay} {props.eventTime}
        </p>
        {props.rationale && (
          <p className="font-mono text-meta-mono text-mute mt-1.5">
            {props.rationale}
          </p>
        )}
      </div>
    );
  }

  if (props.variant === "inline") {
    return (
      <div className="flex gap-2 items-start bg-[hsl(var(--accent-soft))] rounded-[10px] px-3 py-2.5">
        <Calendar size={14} className="text-accent shrink-0 mt-0.5" />
        <span className="text-[12px] text-accent font-medium leading-[1.4]">
          {props.text}
        </span>
      </div>
    );
  }

  const { eventTitle, eventTime, mealLabel, mealTime, rationale } = props;

  return (
    <div className="bg-surface-cool rounded-2xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Calendar size={14} className="text-accent" />
        <span className="text-eyebrow uppercase text-accent">
          Contexte calendrier
        </span>
      </div>

      {/* Timeline */}
      <div className="flex items-stretch gap-0">
        <div className="flex-1 bg-white rounded-xl px-3 py-2.5">
          <p className="text-eyebrow uppercase text-foreground/50">
            {mealLabel} · {mealTime}
          </p>
          <p className="font-display text-display-sm text-foreground mt-0.5">
            Repas optimisé
          </p>
        </div>

        <div className="flex items-center justify-center px-1.5">
          <div className="relative w-6 h-[2px] bg-accent/40">
            <ArrowRight
              size={12}
              className="text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div
          className="flex-1 bg-[hsl(var(--accent-soft))] rounded-xl px-3 py-2.5"
          style={{ borderLeft: "3px solid #E07A5F" }}
        >
          <p className="text-[11px] uppercase tracking-wide font-semibold text-accent">
            Événement · {eventTime}
          </p>
          <p className="font-display text-display-sm text-foreground line-clamp-1 mt-0.5">
            {eventTitle}
          </p>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-[13px] text-foreground/70 leading-relaxed">{rationale}</p>

      {/* Footer */}
      <p className="text-[10px] text-foreground/40">
        Source : ton calendrier Google
      </p>
    </div>
  );
};

export default ProactiveContextBlock;
