import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import OnboardingShell from "@/components/OnboardingShell";
import { usePreferences } from "@/contexts/PreferencesContext";

const TRUST_POINTS = [
  "Lecture seule de tes événements",
  "Aucune donnée partagée à des tiers",
  "Déconnexion possible à tout moment",
];

const OnboardingConnect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setCalendarConnected } = usePreferences();

  const connect = () => {
    setLoading(true);
    setTimeout(() => {
      setCalendarConnected(true);
      navigate("/onboarding/fit");
    }, 1500);
  };

  return (
    <OnboardingShell
      step={1}
      backTo="/onboarding"
      cta={{
        label: loading ? "Connexion en cours…" : "Connecter Google Calendar",
        onClick: connect,
        disabled: loading,
      }}
      skipLabel="Explorer en mode démo"
      onSkip={() => navigate("/onboarding/fit")}
    >
      <div className="px-6 mt-8">
        <p className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">
          LA CONNEXION QUI CHANGE TOUT
        </p>
        <h1 className="font-display text-display-lg text-foreground mt-1 leading-tight">
          Ton calendrier
          <br />
          devient ton profil.
        </h1>
        <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
          C'est tout. Pas de questionnaire de 20 questions sur tes goûts.{" "}
          <span className="text-foreground font-medium">
            On lit ton horaire, on en déduit le reste.
          </span>
        </p>

        <ul className="mt-8 border-l-2 border-secondary/40 pl-4 flex flex-col gap-2">
          {TRUST_POINTS.map((p) => (
            <li
              key={p}
              className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold"
            >
              · {p}
            </li>
          ))}
        </ul>

        {loading && (
          <div className="mt-8 flex items-center gap-2 text-sm text-foreground/60">
            <Loader2 size={16} className="animate-spin" />
            <span>Authentification Google en cours…</span>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
};

export default OnboardingConnect;