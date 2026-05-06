import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Utensils } from "lucide-react";

const MESSAGES = [
  "Analyse de ton horaire…",
  "Optimisation des repas…",
  "Calcul de ton épicerie…",
  "Presque prêt !",
];

const Generation = () => {
  const navigate = useNavigate();
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setProgress(100));
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 800);
    const navTimer = setTimeout(() => navigate("/semaine"), 3000);
    return () => {
      cancelAnimationFrame(t);
      clearInterval(msgTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-background flex justify-center animate-fade-in">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col items-center justify-center px-8">
        <div
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center"
          style={{ animation: "nexeat-pulse 1.2s ease-in-out infinite" }}
        >
          <Utensils size={32} className="text-white" />
        </div>

        <h1 className="mt-6 font-display text-[28px] text-foreground text-center">
          On prépare ta semaine
        </h1>

        <p className="mt-3 text-sm text-foreground/60 text-center min-h-[20px]">
          {MESSAGES[msgIndex]}
        </p>

        <div
          className="mt-8 h-1 rounded-full overflow-hidden"
          style={{ width: "calc(100% - 32px)", backgroundColor: "#E8E8E4" }}
        >
          <div
            className="h-full bg-primary"
            style={{
              width: `${progress}%`,
              transition: "width 3s linear",
            }}
          />
        </div>

        <style>{`
          @keyframes nexeat-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Generation;