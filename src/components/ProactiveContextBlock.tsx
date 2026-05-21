import * as React from "react";

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

type Props = BannerProps | InlineProps;

export const ProactiveContextBlock: React.FC<Props> = (props) => {
  if (props.variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
        <span className="text-sm font-medium text-foreground">{props.text}</span>
      </div>
    );
  }

  const { eventTitle, eventTime, mealLabel, mealTime, rationale } = props;

  return (
    <div className="bg-[hsl(var(--accent)/0.06)] border border-[hsl(var(--accent)/0.18)] rounded-2xl p-4 flex flex-col gap-2">
      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] uppercase tracking-[0.08em] font-semibold px-2 py-0.5 rounded-full w-fit">
        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
        {eventTitle}
        {eventTime ? ` · ${eventTime}` : null}
      </span>

      <div>
        <p className="font-display text-[17px] font-semibold leading-snug text-foreground">
          {mealLabel}
        </p>
        {mealTime ? (
          <p className="text-sm text-muted-foreground mt-0.5">{mealTime}</p>
        ) : null}
      </div>

      {rationale ? (
        <div className="border-t border-[hsl(var(--accent)/0.12)] mt-3 pt-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{rationale}</p>
        </div>
      ) : null}
    </div>
  );
};

export default ProactiveContextBlock;
