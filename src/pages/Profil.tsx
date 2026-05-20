import { useState } from "react";
import { ChevronRight, Check, Minus, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { NutriScoreBadge } from "@/components/ui/nutri-score-badge";
import { usePreferences, Lifestyle, FallbackMeal } from "@/contexts/PreferencesContext";
import CalendarStatusModule from "@/components/CalendarStatusModule";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
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

const LIFESTYLES: { value: Exclude<Lifestyle, null>; label: string; desc: string }[] = [
  { value: "solo", label: "Solo", desc: "1 portion par repas" },
  { value: "coloc", label: "Coloc", desc: "1 portion, on flag les batchs" },
  { value: "famille", label: "Famille / couple", desc: "2+ portions par repas" },
];

const EQUIPMENT = [
  { id: "cuisinière", label: "Cuisinière" },
  { id: "four", label: "Four" },
  { id: "frigo", label: "Frigo" },
  { id: "micro-ondes", label: "Micro-ondes" },
  { id: "air-fryer", label: "Air fryer" },
  { id: "instant-pot", label: "Instant Pot" },
  { id: "blender", label: "Blender" },
  { id: "rice-cooker", label: "Rice cooker" },
];

const STORES = [
  { id: "maxi", label: "Maxi" },
  { id: "iga", label: "IGA" },
  { id: "super-c", label: "Super C" },
  { id: "metro", label: "Metro" },
  { id: "provigo", label: "Provigo" },
  { id: "costco", label: "Costco" },
];

const FALLBACKS: { id: Exclude<FallbackMeal, null>; label: string }[] = [
  { id: "delivery", label: "Pizza / livraison" },
  { id: "leftovers", label: "Restants du frigo" },
  { id: "quick-sandwich", label: "Sandwich rapide (5 min)" },
  { id: "snacks", label: "Snacks" },
  { id: "skip", label: "Je saute le repas" },
];

const SCORE_LINES: { score: "a" | "b" | "c" | "d" | "e"; label: string; text: string }[] = [
  { score: "a", label: "A", text: "Recette très équilibrée" },
  { score: "b", label: "B", text: "Recette bien équilibrée" },
  { score: "c", label: "C", text: "Équilibre moyen" },
  { score: "d", label: "D", text: "Choix occasionnel" },
  { score: "e", label: "E", text: "Recette plaisir" },
];

const Profil = () => {
  const {
    restrictions, setRestrictions,
    budget, setBudget,
    lifestyle, setLifestyle,
    portions, setPortions,
    kitchenEquipment, setKitchenEquipment,
    groceryStores, setGroceryStores,
    fallbackMeal, setFallbackMeal,
  } = usePreferences();
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

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

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, id: string) => {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  const restrictionsSummary =
    restrictions.length === 0
      ? "Aucune"
      : restrictions.includes(NONE)
      ? "Aucune"
      : `${restrictions.length} active${restrictions.length > 1 ? "s" : ""}`;

  const lifestyleLabel = LIFESTYLES.find((l) => l.value === lifestyle)?.label ?? "Non défini";
  const equipSummary = `${kitchenEquipment.length} item${kitchenEquipment.length > 1 ? "s" : ""}`;
  const storesSummary =
    groceryStores.length === 0
      ? "Aucune"
      : groceryStores.length === 1
      ? STORES.find((s) => s.id === groceryStores[0])?.label ?? "1"
      : `${groceryStores.length} épiceries`;
  const fallbackSummary = FALLBACKS.find((f) => f.id === fallbackMeal)?.label ?? "Non défini";

  return (
    <div className="flex flex-col pb-24 bg-surface-warm min-h-full">
      {/* Header éditorial */}
      <header className="bg-white px-4 pt-6 pb-5 border-b border-border">
        <p className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">
          Tes préférences
        </p>
        <h1 className="font-display text-display-xl text-foreground mt-1 leading-tight">
          Ton profil
        </h1>
        <p className="text-[13px] text-foreground/55 mt-2">
          Tout ce qu'on a appris pendant l'onboarding — ajustable à tout moment.
        </p>
      </header>

      {/* Hub de préférences en accordion */}
      <section className="mx-4 mt-4 bg-white rounded-2xl shadow-card overflow-hidden">
        <Accordion type="multiple" className="w-full">
          {/* Mode de vie */}
          <AccordionItem value="lifestyle" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Mode de vie</span>
                <span className="text-[15px] text-foreground mt-0.5">{lifestyleLabel}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-2">
                {LIFESTYLES.map((l) => {
                  const active = lifestyle === l.value;
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setLifestyle(l.value)}
                      className={cn(
                        "rounded-xl border-[1.5px] px-4 py-3 text-left flex items-center justify-between transition-colors",
                        active ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{l.label}</span>
                        <span className={cn("text-xs mt-0.5", active ? "text-primary-foreground/70" : "text-foreground/50")}>{l.desc}</span>
                      </div>
                      {active && <Check size={18} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Portions */}
          <AccordionItem value="portions" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Portions par repas</span>
                <span className="text-[15px] text-foreground mt-0.5">{portions} {portions > 1 ? "portions" : "portion"}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex items-center justify-between bg-surface-warm rounded-xl px-4 py-3">
                <button
                  type="button"
                  onClick={() => setPortions(Math.max(1, portions - 1))}
                  className="w-10 h-10 rounded-full border-[1.5px] border-border bg-white inline-flex items-center justify-center disabled:opacity-30"
                  disabled={portions <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="font-display text-display-md text-primary tabular-nums">{portions}</div>
                <button
                  type="button"
                  onClick={() => setPortions(Math.min(8, portions + 1))}
                  className="w-10 h-10 rounded-full border-[1.5px] border-border bg-white inline-flex items-center justify-center disabled:opacity-30"
                  disabled={portions >= 8}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="mt-3 text-[12px] text-foreground/55">Les quantités d'ingrédients s'ajustent automatiquement.</p>
            </AccordionContent>
          </AccordionItem>

          {/* Restrictions */}
          <AccordionItem value="restrictions" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Restrictions alimentaires</span>
                <span className="text-[15px] text-foreground mt-0.5">{restrictionsSummary}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {RESTRICTIONS.map((chip) => {
                  const isActive = restrictions.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggle(chip)}
                      className={cn(
                        "px-3.5 py-2 rounded-[20px] text-[13px] transition-colors",
                        isActive ? "bg-primary text-primary-foreground border-[1.5px] border-primary" : "bg-white text-foreground border-[1.5px] border-border",
                      )}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Équipement */}
          <AccordionItem value="kitchen" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Équipement de cuisine</span>
                <span className="text-[15px] text-foreground mt-0.5">{equipSummary}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT.map((eq) => {
                  const active = kitchenEquipment.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleArr(kitchenEquipment, setKitchenEquipment, eq.id)}
                      className={cn(
                        "rounded-xl border-[1.5px] px-3 py-2.5 text-left text-sm relative transition-colors",
                        active ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border",
                      )}
                    >
                      {active && <Check size={12} strokeWidth={2.5} className="absolute top-1.5 right-1.5" />}
                      <span className="pr-4">{eq.label}</span>
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Épiceries */}
          <AccordionItem value="stores" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Épiceries préférées</span>
                <span className="text-[15px] text-foreground mt-0.5">{storesSummary}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {STORES.map((s) => {
                  const active = groceryStores.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleArr(groceryStores, setGroceryStores, s.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-[20px] text-[13px] transition-colors",
                        active ? "bg-primary text-primary-foreground border-[1.5px] border-primary" : "bg-white text-foreground border-[1.5px] border-border",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Plan B */}
          <AccordionItem value="fallback" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Plan B — quand t'es brûlé</span>
                <span className="text-[15px] text-foreground mt-0.5">{fallbackSummary}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-2">
                {FALLBACKS.map((f) => {
                  const active = fallbackMeal === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFallbackMeal(f.id)}
                      className={cn(
                        "rounded-xl border-[1.5px] px-4 py-3 text-left flex items-center justify-between text-sm transition-colors",
                        active ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border",
                      )}
                    >
                      <span className="font-medium">{f.label}</span>
                      {active && <Check size={16} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Budget */}
          <AccordionItem value="budget" className="border-b border-border last:border-0 px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex flex-col items-start text-left">
                <span className="text-[11px] uppercase tracking-[1.5px] text-foreground/40 font-semibold">Budget hebdomadaire</span>
                <span className="text-[15px] text-foreground mt-0.5">{budget} $/sem</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="text-center font-display text-[36px] leading-none text-primary tabular-nums">
                {budget} $
              </div>
              <div className="mt-4">
                <Slider
                  value={[budget]}
                  min={40}
                  max={200}
                  step={5}
                  onValueChange={(v) => setBudget(v[0])}
                  className="[&_[data-orientation=horizontal]]:h-1.5 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_.bg-secondary]:bg-[#E8E8E4] [&_.bg-primary]:bg-primary"
                />
              </div>
              <p className="mt-3 text-[12px] text-foreground/55">Modifié → impact dès cette semaine.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Google Calendar */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-4">
        <CalendarStatusModule
          email="xavier@ulaval.ca"
          isConnected={true}
          lastSyncAt={new Date(Date.now() - 23 * 60 * 1000)}
          eventsThisWeek={12}
          nextSyncAt={new Date(Date.now() + (3 * 60 + 37) * 60 * 1000)}
          onDisconnect={() => console.log("disconnect TODO")}
        />
      </section>

      {/* Comprendre le score */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card p-4">
        <p className="text-eyebrow uppercase text-primary/70">ÉQUILIBRE CULINAIRE</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {SCORE_LINES.map(({ score, label, text }) => (
            <li key={score} className="flex items-center gap-3">
              <NutriScoreBadge score={label as "A" | "B" | "C" | "D" | "E"} />
              <span className="text-[14px] text-foreground">{text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-[hsl(var(--text-subtle))]">
          Indice agrégé à partir des ingrédients via Open Food Facts.
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--text-subtle))]">
          Indice descriptif basé sur Open Food Facts. NexEat n'est pas un service de nutrition et ne remplace pas un avis professionnel.
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

      {/* Mes données */}
      <section className="mx-4 mt-3 bg-white rounded-2xl shadow-card overflow-hidden">
        <p className="px-4 pt-4 text-eyebrow uppercase text-primary/70">MES DONNÉES</p>
        <h2 className="px-4 pb-3 font-display text-display-md text-foreground mt-1">
          Gérer mes informations
        </h2>
        <button
          type="button"
          onClick={() => console.log("export TODO")}
          className="w-full flex items-center justify-between px-4 py-[14px] border-b border-border text-left"
        >
          <span className="text-[14px] text-foreground">Exporter mes données (JSON)</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
        <button
          type="button"
          onClick={() => console.log("nav privacy TODO")}
          className="w-full flex items-center justify-between px-4 py-[14px] border-b border-border text-left"
        >
          <span className="text-[14px] text-foreground">Politique de confidentialité</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
        <button
          type="button"
          onClick={() => console.log("consult TODO")}
          className="w-full flex items-center justify-between px-4 py-[14px] text-left"
        >
          <span className="text-[14px] text-foreground">Consulter mes données</span>
          <ChevronRight size={18} className="text-foreground/40" />
        </button>
      </section>

      {/* Zone dangereuse */}
      <section className="mx-4 mt-6 bg-white rounded-2xl shadow-card overflow-hidden border border-destructive/20">
        <p className="px-4 pt-4 text-eyebrow uppercase text-destructive">ZONE DANGEREUSE</p>
        <button
          type="button"
          onClick={() => setDeleteAccountOpen(true)}
          className="w-full flex items-center justify-between px-4 py-[14px] text-left"
        >
          <div>
            <p className="text-[14px] text-destructive font-medium">Supprimer mon compte</p>
            <p className="text-[12px] text-[hsl(var(--text-subtle))] mt-0.5">
              Action irréversible — toutes tes données seront effacées
            </p>
          </div>
          <ChevronRight size={18} className="text-destructive/60" />
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

      <DeleteAccountDialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen} />
    </div>
  );
};

export default Profil;
