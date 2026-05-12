import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Utensils, Bookmark, Plus, X, Loader2, Camera, Pencil, Link2, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

type Score = "A" | "B" | "C" | "D" | "E";
interface Recipe {
  id: string;
  title: string;
  prep: string;
  portions: string;
  score: Score;
}

const SAVED_MOCK: Recipe[] = [
  { id: "s1", title: "Bol coréen bibimbap végétarien", prep: "25 min", portions: "2 portions", score: "A" },
  { id: "s2", title: "Curry de pois chiches au lait de coco", prep: "30 min", portions: "4 portions", score: "B" },
  { id: "s3", title: "Salade tiède de quinoa et patate douce", prep: "20 min", portions: "2 portions", score: "A" },
  { id: "s4", title: "Pâtes au pesto de basilic et noix", prep: "15 min", portions: "3 portions", score: "C" },
];

const IMPORTED_MOCK: Recipe = {
  id: `imp-${Date.now()}`,
  title: "Soupe thaï aux lentilles",
  prep: "35 min",
  portions: "4 portions",
  score: "B",
};

function ScorePill({ score }: { score: Score }) {
  return (
    <Pill variant={`score-${score.toLowerCase()}` as "score-a"}>{score}</Pill>
  );
}

function RecipeCard({ recipe, saved }: { recipe: Recipe; saved?: boolean }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card flex flex-col">
      <div className="relative h-[120px] bg-[#A8C5BC] rounded-t-xl">
        {saved && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
            <Heart size={14} className="text-[#E07A5F]" fill="#E07A5F" strokeWidth={2} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/90 backdrop-blur-sm flex items-center px-2 gap-1.5 text-[10px] text-[#2A2D35]">
          <Clock size={10} strokeWidth={2} />
          <span>{recipe.prep}</span>
          <span className="text-[#2A2D35]/30">·</span>
          <Utensils size={10} strokeWidth={2} />
          <span>{recipe.portions}</span>
          <span className="ml-auto"><ScorePill score={recipe.score} /></span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-[13px] font-medium text-[#2A2D35] leading-snug line-clamp-2">
          {recipe.title}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  cta,
}: {
  title: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-10">
      <div className="w-20 h-20 rounded-full bg-[#A8C5BC]/40 flex items-center justify-center mb-4">
        <Bookmark size={32} className="text-[#4A6670]" strokeWidth={1.75} />
      </div>
      <p className="text-[14px] text-[#2A2D35]/60 max-w-[280px]">{title}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}

const Recettes = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"saved" | "mine">("saved");
  const [saved] = useState<Recipe[]>(SAVED_MOCK);
  const [mine, setMine] = useState<Recipe[]>([]);

  const [addOpen, setAddOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Write form
  const [name, setName] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState("");

  // Import URL
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);

  // Camera capture
  const [capturing, setCapturing] = useState(false);

  const resetWrite = () => {
    setName("");
    setCookTime("");
    setServings("");
    setIngredients("");
  };

  const handleSaveWritten = () => {
    if (!name.trim()) return;
    setMine((prev) => [
      {
        id: `w-${Date.now()}`,
        title: name.trim(),
        prep: cookTime ? `${cookTime} min` : "—",
        portions: servings ? `${servings} portions` : "—",
        score: "B",
      },
      ...prev,
    ]);
    resetWrite();
    setWriteOpen(false);
  };

  const handleImport = () => {
    if (!url.trim()) return;
    setImporting(true);
    setTimeout(() => {
      setMine((prev) => [{ ...IMPORTED_MOCK, id: `imp-${Date.now()}` }, ...prev]);
      setImporting(false);
      setUrl("");
      setUrlOpen(false);
    }, 2000);
  };

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      setMine((prev) => [{ ...IMPORTED_MOCK, id: `cam-${Date.now()}` }, ...prev]);
      setCapturing(false);
      setCameraOpen(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-surface-warm pb-6">
      {/* Header */}
      <header className="bg-white px-4 pt-6 pb-0 border-b border-[#E8E8E4]">
        <h1 className="font-display text-[24px] text-[#2A2D35]">Mes Recettes</h1>
        <div className="flex gap-6 mt-3">
          {[
            { id: "saved", label: "Sauvegardées" },
            { id: "mine", label: "Mes recettes" },
          ].map((t) => {
            const active = tab === (t.id as "saved" | "mine");
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "saved" | "mine")}
                className={cn(
                  "pb-3 text-[14px] font-medium transition-colors relative",
                  active ? "text-[#4A6670]" : "text-[#2A2D35]/50",
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#4A6670] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div className="mt-4">
        {tab === "saved" ? (
          saved.length === 0 ? (
            <EmptyState
              title="Explore les suggestions du jour pour sauvegarder tes coups de cœur"
              cta={
                <button
                  onClick={() => navigate("/aujourd-hui")}
                  className="text-[14px] font-semibold text-[#4A6670]"
                >
                  Voir les suggestions →
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4">
              {saved.map((r) => (
                <RecipeCard key={r.id} recipe={r} saved />
              ))}
            </div>
          )
        ) : mine.length === 0 ? (
          <div className="px-4">
            <EmptyState title="Aucune recette pour l'instant" />
            <button
              onClick={() => setAddOpen(true)}
              className="mt-6 w-full h-12 rounded-xl bg-[#E07A5F] text-white text-[15px] font-medium flex items-center justify-center gap-2"
            >
              <Plus size={18} strokeWidth={2.5} />
              Ajouter une recette
            </button>
          </div>
        ) : (
          <div className="px-4">
            <div className="grid grid-cols-2 gap-3">
              {mine.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="mt-5 w-full h-12 rounded-xl bg-[#E07A5F] text-white text-[15px] font-medium flex items-center justify-center gap-2"
            >
              <Plus size={18} strokeWidth={2.5} />
              Ajouter une recette
            </button>
          </div>
        )}
      </div>

      {/* Add options sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 max-w-[390px] mx-auto">
          <SheetHeader className="px-5 pt-5 pb-2 text-left">
            <SheetTitle className="font-display text-[20px] text-[#2A2D35]">
              Ajouter une recette
            </SheetTitle>
          </SheetHeader>
          <div className="px-3 pb-6">
            {[
              { icon: Pencil, label: "Écrire une recette", onClick: () => { setAddOpen(false); setTimeout(() => setWriteOpen(true), 200); } },
              { icon: Link2, label: "Importer par lien", onClick: () => { setAddOpen(false); setTimeout(() => setUrlOpen(true), 200); } },
              { icon: Camera, label: "Scanner une recette", onClick: () => { setAddOpen(false); setTimeout(() => setCameraOpen(true), 200); } },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={opt.onClick}
                className="w-full flex items-center gap-3 px-3 py-4 rounded-xl hover:bg-[#F5F5F0] transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#A8C5BC]/40 flex items-center justify-center">
                  <opt.icon size={18} className="text-[#4A6670]" strokeWidth={2} />
                </div>
                <span className="text-[15px] font-medium text-[#2A2D35]">{opt.label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Write recipe sheet */}
      <Sheet open={writeOpen} onOpenChange={setWriteOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 max-w-[390px] mx-auto max-h-[90vh] overflow-y-auto">
          <SheetHeader className="px-5 pt-5 pb-2 text-left">
            <SheetTitle className="font-display text-[20px] text-[#2A2D35]">
              Écrire une recette
            </SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-6 flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la recette"
              className="h-12 px-3 rounded-xl border border-[#A8C5BC] bg-white text-[14px] text-[#2A2D35] placeholder:text-[#2A2D35]/40 focus:outline-none focus:border-[#4A6670]"
            />
            <input
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="Temps de cuisson (min)"
              className="h-12 px-3 rounded-xl border border-[#A8C5BC] bg-white text-[14px] text-[#2A2D35] placeholder:text-[#2A2D35]/40 focus:outline-none focus:border-[#4A6670]"
            />
            <input
              value={servings}
              onChange={(e) => setServings(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="Nombre de portions"
              className="h-12 px-3 rounded-xl border border-[#A8C5BC] bg-white text-[14px] text-[#2A2D35] placeholder:text-[#2A2D35]/40 focus:outline-none focus:border-[#4A6670]"
            />
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
              placeholder={"1 tasse de lentilles\n2 tomates..."}
              className="px-3 py-2.5 rounded-xl border border-[#A8C5BC] bg-white text-[14px] text-[#2A2D35] placeholder:text-[#2A2D35]/40 focus:outline-none focus:border-[#4A6670] resize-none"
            />
            <button
              onClick={handleSaveWritten}
              disabled={!name.trim()}
              className="mt-2 w-full h-12 rounded-xl bg-[#E07A5F] text-white text-[15px] font-medium disabled:opacity-50"
            >
              Sauvegarder
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Import URL sheet */}
      <Sheet open={urlOpen} onOpenChange={(o) => { if (!importing) setUrlOpen(o); }}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 max-w-[390px] mx-auto">
          <SheetHeader className="px-5 pt-5 pb-2 text-left">
            <SheetTitle className="font-display text-[20px] text-[#2A2D35]">
              Importer par lien
            </SheetTitle>
          </SheetHeader>
          <div className="px-5 pb-6 flex flex-col gap-3">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.ricardocuisine.com/..."
              className="h-12 px-3 rounded-xl border border-[#A8C5BC] bg-white text-[14px] text-[#2A2D35] placeholder:text-[#2A2D35]/40 focus:outline-none focus:border-[#4A6670]"
            />
            <button
              onClick={handleImport}
              disabled={!url.trim() || importing}
              className="w-full h-12 rounded-xl bg-[#E07A5F] text-white text-[15px] font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {importing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Import en cours…
                </>
              ) : (
                "Importer"
              )}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Camera fullscreen */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] bg-[#1a1a1a] flex flex-col items-center justify-between py-10 max-w-[390px] mx-auto left-1/2 -translate-x-1/2">
          <button
            onClick={() => { if (!capturing) setCameraOpen(false); }}
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
            aria-label="Retour"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center w-full px-8">
            <div className="relative w-full aspect-[3/4] border-2 border-white/80 rounded-2xl">
              <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-2xl" />
              <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-2xl" />
              <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-2xl" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-2xl" />
              {capturing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-[13px] font-medium">Analyse en cours…</span>
                </div>
              )}
            </div>
            <p className="text-white/80 text-[13px] mt-6">Pointez vers la recette</p>
          </div>
          <button
            onClick={handleCapture}
            disabled={capturing}
            className="w-16 h-16 rounded-full bg-white border-4 border-white/30 active:scale-95 transition-transform disabled:opacity-60"
            aria-label="Capturer"
          />
        </div>
      )}
    </div>
  );
};

export default Recettes;
