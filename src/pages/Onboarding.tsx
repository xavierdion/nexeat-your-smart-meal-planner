import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-background flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col px-6 pt-16 pb-10">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
            <Sparkles className="text-primary" size={28} />
          </div>
          <h1 className="font-display text-4xl text-foreground leading-tight">
            Bienvenue sur NexEat
          </h1>
          <p className="text-foreground/70 text-base max-w-xs">
            Ton assistant proactif de planification de repas, adapté à ton horaire universitaire.
          </p>
        </div>
        <Button
          onClick={() => navigate("/semaine")}
          className="w-full h-12 rounded-xl bg-[hsl(var(--coral))] hover:bg-[hsl(var(--coral))]/90 text-white font-medium text-base"
        >
          Commencer
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;