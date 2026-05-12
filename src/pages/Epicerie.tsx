import { useState } from "react";
import { toast } from "sonner";
import { Check, AlertCircle, Apple, Beef, Wheat, Milk, Package, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/pill";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

interface Item {
  name: string;
  qty: string;
  price: string;
}

const CATEGORIES: { name: string; items: Item[] }[] = [
  {
    name: "Fruits et légumes",
    items: [
      { name: "Épinards", qty: "150 g", price: "1,99 $" },
      { name: "Mangue", qty: "2x", price: "3,49 $" },
      { name: "Avocats", qty: "3x", price: "4,49 $" },
      { name: "Tomates cerises", qty: "250 g", price: "2,99 $" },
      { name: "Concombre", qty: "1x", price: "1,29 $" },
      { name: "Bleuets", qty: "250 g", price: "3,99 $" },
    ],
  },
  {
    name: "Protéines",
    items: [
      { name: "Poulet poitrines", qty: "500 g", price: "7,99 $" },
      { name: "Thon en conserve", qty: "2x", price: "3,49 $" },
      { name: "Tofu ferme", qty: "400 g", price: "3,29 $" },
      { name: "Oeufs", qty: "12x", price: "4,49 $" },
      { name: "Pois chiches", qty: "540 ml", price: "1,69 $" },
    ],
  },
  {
    name: "Grains et féculés",
    items: [
      { name: "Pâtes soba", qty: "250 g", price: "3,49 $" },
      { name: "Riz basmati", qty: "1 kg", price: "3,99 $" },
      { name: "Muffins anglais", qty: "6x", price: "3,29 $" },
      { name: "Pain de seigle", qty: "1x", price: "3,49 $" },
    ],
  },
  {
    name: "Produits laitiers et substituts",
    items: [
      { name: "Yogourt kefir", qty: "500 ml", price: "4,49 $" },
      { name: "Crème sure", qty: "250 ml", price: "2,49 $" },
      { name: "Parmesan", qty: "100 g", price: "4,49 $" },
    ],
  },
  {
    name: "Épicerie sèche",
    items: [
      { name: "Lait de coco", qty: "400 ml", price: "2,49 $" },
      { name: "Pesto", qty: "190 ml", price: "4,49 $" },
      { name: "Tahini", qty: "250 g", price: "4,99 $" },
      { name: "Sauce soya", qty: "300 ml", price: "2,99 $" },
    ],
  },
  {
    name: "Herbes et condiments",
    items: [
      { name: "Ail", qty: "1 tete", price: "0,99 $" },
      { name: "Gingembre frais", qty: "1x", price: "1,49 $" },
    ],
  },
];

const totalItems = CATEGORIES.reduce((s, c) => s + c.items.length, 0);

const CATEGORY_ICONS: Record<string, typeof Apple> = {
  "Fruits et légumes": Apple,
  "Protéines": Beef,
  "Grains et féculés": Wheat,
  "Produits laitiers et substituts": Milk,
  "Épicerie sèche": Package,
  "Herbes et condiments": Leaf,
};

const BUDGET_TARGET = 85;
const BUDGET_CURRENT = 94;

const ADJUSTMENTS = [
  { id: "tofu", label: "Remplacer poulet 500g par tofu 400g", saving: "-3,50 $" },
  { id: "saumon", label: "Réduire la portion de saumon", saving: "-2,00 $" },
  { id: "pesto", label: "Pesto maison au lieu d'acheté", saving: "-1,50 $" },
];

const Epicerie = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustSelected, setAdjustSelected] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((c) => ({ ...c, [key]: !c[key] }));

  const toggleCategory = (cat: { name: string; items: Item[] }) => {
    const allChecked = cat.items.every((it) => checked[`${cat.name}-${it.name}`]);
    setChecked((prev) => {
      const next = { ...prev };
      cat.items.forEach((it) => {
        next[`${cat.name}-${it.name}`] = !allChecked;
      });
      return next;
    });
  };

  const applyAdjustments = () => {
    setAdjustOpen(false);
    toast(`Budget ajusté à ${BUDGET_TARGET} $`, {
      style: { background: "#4A6670", color: "#fff", border: "none" },
      duration: 3000,
    });
  };

  const overBudget = BUDGET_CURRENT > BUDGET_TARGET;

  return (
    <div className="flex flex-col">
      {/* Header éditorial */}
      <header className="bg-white px-4 pt-6 pb-4 border-b border-border">
        <p className="text-eyebrow uppercase text-primary/70">SEMAINE DU 17 MAI</p>
        <h1 className="font-display text-display-xl text-foreground mt-1">Ton épicerie</h1>
        <p className="text-[14px] text-foreground/60 mt-1">
          {totalItems} articles · {CATEGORIES.length} catégories
        </p>
      </header>

      {/* Budget card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-card p-4 flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-eyebrow uppercase text-primary/70">Budget hebdo</p>
          <p className="font-display text-display-xl text-primary mt-1 leading-none">94 $</p>
          <div className="mt-2 flex items-center gap-1">
            <AlertCircle size={12} className="text-accent" strokeWidth={2.5} />
            <span className="text-[12px] text-accent">
              Au-dessus de ton budget de 85 $ (+9 $)
            </span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end">
          <div className="w-20 h-2 rounded-full bg-secondary/15 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${Math.min((94 / 85) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-foreground/50 mt-1">94/85</span>
        </div>
      </div>

      {overBudget && (
        <div className="mx-4 mt-3">
          <button
            type="button"
            onClick={() => setAdjustOpen(true)}
            className="w-full h-11 rounded-xl border-[1.5px] border-primary bg-white text-primary text-[14px] font-semibold"
          >
            Suggérer des ajustements
          </button>
        </div>
      )}

      {/* List */}
      <div className="px-4 pb-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mt-5 mb-3">
              <div className="flex items-center gap-1.5">
                {(() => {
                  const Icon = CATEGORY_ICONS[cat.name];
                  return Icon ? <Icon size={14} strokeWidth={2} color="#5B8579" /> : null;
                })()}
                <Pill variant="category">{cat.name}</Pill>
              </div>
              {(() => {
                const allChecked = cat.items.every(
                  (it) => checked[`${cat.name}-${it.name}`],
                );
                return (
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="ml-auto text-[12px] text-primary underline"
                  >
                    {allChecked ? "Tout décocher" : "Tout cocher"}
                  </button>
                );
              })()}
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {cat.items.map((item, i) => {
                const key = `${cat.name}-${item.name}`;
                const isChecked = !!checked[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left",
                      i !== cat.items.length - 1 && "border-b border-secondary/15",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors",
                        isChecked
                          ? "bg-primary"
                          : "border-[1.5px] border-border bg-white",
                      )}
                    >
                      {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                    </span>
                    <span className="flex-1 flex items-baseline gap-2 min-w-0">
                      <span
                        className={cn(
                          "text-[15px] text-foreground truncate",
                          isChecked && "line-through opacity-40",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="text-[13px] text-foreground/60 shrink-0">{item.qty}</span>
                    </span>
                    <span className="text-[13px] text-primary font-medium shrink-0">{item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 py-3 bg-background z-40">
        <button className="w-full h-12 rounded-xl border-[1.5px] border-primary bg-white text-primary text-[15px] font-semibold">
          Partager la liste
        </button>
      </div>
      <div className="h-24" aria-hidden />

      <Sheet open={adjustOpen} onOpenChange={setAdjustOpen}>
        <SheetContent side="bottom" className="rounded-t-[20px] max-h-[80vh] bg-white">
          <SheetTitle className="font-display text-display-md text-foreground">
            3 ajustements possibles
          </SheetTitle>
          <p className="text-[13px] text-foreground/60 mt-1">
            Pour rentrer dans ton budget de {BUDGET_TARGET} $
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {ADJUSTMENTS.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-3 bg-white rounded-xl border border-border px-3 py-3 cursor-pointer"
              >
                <Checkbox
                  checked={!!adjustSelected[a.id]}
                  onCheckedChange={(v) =>
                    setAdjustSelected((prev) => ({ ...prev, [a.id]: !!v }))
                  }
                />
                <span className="flex-1 text-[14px] text-foreground leading-snug">
                  {a.label}
                </span>
                <span className="text-[13px] text-accent font-semibold shrink-0">
                  {a.saving}
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={applyAdjustments}
            className="mt-5 w-full h-12 rounded-xl bg-accent text-white font-semibold text-[15px] shadow-cta"
          >
            Appliquer la sélection
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Epicerie;
