import { Calendar, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Pill } from "@/components/ui/pill";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const RESTRICTIONS = [
  "Sans gluten",
  "Végétarien",
  "Végétalien",
  "Sans produits laitiers",
  "Sans noix",
  "Sans fruits de mer",
  "Halal",
  "Casher",
  "Aucune restriction",
];

const NONE = "Aucune restriction";

const SCORE_LINES: { score: "a" | "b" | "c" | "d" | "e"; label: string; text: string }[] = [
  { score: "a", label: "A", text: "Recette très équilibrée" },
  { score: "b", label: "B", text: "Recette bien équilibrée" },
  { score: "c", label: "C", text: "Équilibre moyen" },
  { score: "d", label: "D", text: "À garder pour les occasions" },
  { score: "e", label: "E", text: "À garder rare" },
];

const Profil = () => {
  const { restrictions, setRestrictions, budget, setBudget } = usePreferences();

  const toggle = (chip: string) => {
    if (chip === NONE) {
      setRestrictions(restrictions.includes(NONE) ? [] : [NONE]);
      return;
    }
    const without = restrictions.filter((c) => c !== NONE);
    setRestrictions(
      without.includes(chip) ? without.filter((c) => c !== chip) : [...without, chip],
    );
  };

  return (
    <div className="flex flex-col pb-24 bg-surface-warm min-h-full">
      {/* Header éditorial */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-border">
        <h1 className="font-display text-display-xl text-foreground">
          Tes préférences
        </h1>
        <p className="text-[14px] text-foreground/60 mt-1">Ajuste tout en tout temps</p>
      </header>

      {/* Restrictions */}
      <section className="mx-4 mt-4 bg-surface-warm rounded-2xl p-4 shadow-card">
        <p className="text-eyebrow uppercase text-primary/70">ALIMENTATION</p>
        <h2 className="font-display text-display-md text-foreground mt-1">
          Ce que tu évites
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {RESTRICTIONS.map((chip) => {
            const isActive = restrictions.includes(chip);
            return (
              <button
                key={chip}
                type="button"
                onClick={() => toggle(chip)}
                className={cn(
                  "px-4 py-2.5 rounded-[20px] text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-[1.5px] border-primary"
                    : "bg-white text-foreground border-[1.5px] border-border",
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </section>

      {/* Budget */}
      <section className="mx-4 mt-3 bg-surface-cool rounded-2xl p-4 shadow-card">
        <p className="text-eyebrow uppercase text-primary/70">BUDGET</p>
        <h2 className="font-display text-display-md text-foreground mt-1">Par semaine</h2>
        <div className="mt-4 text-center">
          <div className="font-display text-[40px] leading-none text-primary">
            {budget} $/sem
          </div>
        </div>
        <div className="mt-5">
          <Slider
            value={[budget]}
            min={40}
            max={200}
            step={5}
            onValueChange={(v) => setBudget(v[0])}
            className="[&_[data-orientation=horizontal]]:h-1.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_.bg-secondary]:bg-[#E8E8E4] [&_.bg-primary]:bg-primary"
          />
        </div>
        <p className="mt-3 text-[12px] text-foreground/60">
          Modifié → impact appliqué dès cette semaine
        </p>
      </section>

      {/* Google Calendar */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-4">
        <p className="text-eyebrow uppercase text-primary/70">CALENDRIER</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-[hsl(var(--sage))]/30 inline-flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-[hsl(var(--sage))]" strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-foreground">Connecté</p>
            <p className="text-[12px] text-foreground/60 truncate">xavier@ulaval.ca</p>
          </div>
          <button
            type="button"
            className="px-3 h-9 rounded-lg border-[1.5px] border-primary text-[13px] text-primary font-medium"
          >
            Déconnecter
          </button>
        </div>
      </section>

      {/* Comprendre le score */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-4">
        <p className="text-eyebrow uppercase text-primary/70">ÉQUILIBRE CULINAIRE</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {SCORE_LINES.map(({ score, label, text }) => (
            <li key={score} className="flex items-center gap-3">
              <Pill variant={`score-${score}` as any}>{label}</Pill>
              <span className="text-[14px] text-foreground">{text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-[hsl(var(--text-subtle))]">
          Indice agrégé à partir des ingrédients via Open Food Facts.
        </p>
      </section>

      {/* Aide */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-[14px] border-b border-border text-left"
        >
          <span className="text-[14px] text-foreground">Envoyer du feedback</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-[14px] text-left"
        >
          <span className="text-[14px] text-foreground">Conditions d'utilisation</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
      </section>

      {/* Logout */}
      <div className="mx-4 mt-6 mb-6">
        <button
          type="button"
          className="w-full h-[52px] rounded-xl border-[1.5px] border-foreground/40 text-foreground font-medium text-base"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Profil;
