import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Check, ChevronLeft, Loader2 } from "lucide-react";

const PERMISSIONS = [
  "Lecture seule de tes événements",
  "Aucune donnée partagée à des tiers",
  "Déconnexion possible à tout moment",
];

const OnboardingStep3 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goNext = () => navigate("/generation");

  const connect = () => {
    setLoading(true);
    setTimeout(goNext, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col pb-28">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/onboarding/2")}
          className="absolute top-4 left-2 w-11 h-11 inline-flex items-center justify-center text-foreground"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center justify-center gap-2 mt-[60px]">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
        </div>

        <div className="mt-10 flex justify-center">
          <div
            className="w-[120px] h-[120px] rounded-3xl flex items-center justify-center bg-secondary/15"
          >
            <Calendar size={48} className="text-primary" strokeWidth={1.75} />
          </div>
        </div>

        <div className="mt-8 px-6 text-center">
          <h1 className="font-display text-[28px] leading-tight text-foreground">
            Connecte ton horaire
          </h1>
          <p className="mt-2 text-sm text-foreground/60 mx-auto max-w-[280px]">
            NexEat lit ton Google Calendar pour suggérer les bons repas au bon moment
          </p>
        </div>

        <ul className="mt-8 px-6 flex flex-col gap-4">
          {PERMISSIONS.map((p) => (
            <li key={p} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-secondary inline-flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3} className="text-white" />
              </span>
              <span className="text-sm text-foreground">{p}</span>
            </li>
          ))}
        </ul>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 pb-6 pt-4 bg-background flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={connect}
            disabled={loading}
            className="w-full h-[52px] rounded-xl bg-[hsl(var(--coral))] text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-[hsl(var(--coral))]/90 transition-colors disabled:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-normal">Connexion en cours…</span>
              </>
            ) : (
              "Connecter Google Calendar"
            )}
          </button>
          <button
            type="button"
            onClick={goNext}
            className="text-sm text-foreground/60 underline"
          >
            Passer cette étape →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep3;