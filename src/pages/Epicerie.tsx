import { useState, useEffect } from "react";
import { Check, AlertCircle, Apple, Beef, Wheat, Milk, Package, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

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

const Epicerie = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [toastState, setToastState] = useState<"hidden" | "in" | "out">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("planToastShown")) return;
    const t1 = setTimeout(() => {
      sessionStorage.setItem("planToastShown", "1");
      setToastState("in");
    }, 1000);
    const t2 = setTimeout(() => setToastState("out"), 1000 + 4000);
    const t3 = setTimeout(() => setToastState("hidden"), 1000 + 4000 + 300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const toggle = (key: string) =>
    setChecked((c) => ({ ...c, [key]: !c[key] }));

  return (
    <div className="-mt-11 flex flex-col">
      {toastState !== "hidden" && (
        <div
          className="fixed left-4 right-4 z-50"
          style={{
            top: "12px",
            background: "#4A6670",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 500,
            textAlign: "center",
            borderRadius: "12px",
            padding: "12px 16px",
            transition: toastState === "in" ? "transform 200ms ease-out, opacity 200ms ease-out" : "opacity 300ms ease-in",
            transform: toastState === "in" ? "translateY(0)" : "translateY(-8px)",
            opacity: toastState === "in" ? 1 : 0,
          }}
        >
          Plan de la semaine sauvegarde. Rendez-vous dimanche prochain ?
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-30 h-14 bg-white border-b border-[#E8E8E4] flex items-center justify-between px-4">
        <h1 className="font-display text-[20px] text-[#2A2D35] leading-none">Épicerie</h1>
        <span className="text-[13px] text-[#2A2D35]/60">Semaine du 17 mai</span>
      </header>

      {/* Budget summary */}
      <div className="bg-white border-b border-[#E8E8E4] px-4 py-3 flex items-start justify-between">
        <div className="text-[13px] text-[#2A2D35]">
          {totalItems} articles · {CATEGORIES.length} categories
        </div>
        <div className="text-right">
          <div className="text-[28px] font-bold text-[#4A6670] leading-none">94 $</div>
          <div className="text-[11px] text-[#2A2D35]/50 mt-1">Budget : 85 $</div>
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#E07A5F]">
            <AlertCircle size={11} strokeWidth={2.5} />
            Au-dessus du budget
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-1.5 mt-4 mb-2">
              {(() => {
                const Icon = CATEGORY_ICONS[cat.name];
                return Icon ? <Icon size={14} strokeWidth={2} color="#5B8579" /> : null;
              })()}
              <span className="text-[12px] uppercase font-semibold text-[#5B8579] tracking-wide">
                {cat.name}
              </span>
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
                      i !== cat.items.length - 1 && "border-b border-[#F0F4F3]",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors",
                        isChecked
                          ? "bg-[#4A6670]"
                          : "border-[1.5px] border-[#E8E8E4] bg-white",
                      )}
                    >
                      {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                    </span>
                    <span className="flex-1 flex items-baseline gap-2 min-w-0">
                      <span
                        className={cn(
                          "text-[15px] text-[#2A2D35] truncate",
                          isChecked && "line-through opacity-40",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="text-[13px] text-[#2A2D35]/60 shrink-0">{item.qty}</span>
                    </span>
                    <span className="text-[13px] text-[#2A2D35]/50 shrink-0">{item.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 py-3 bg-background z-40">
        <button className="w-full h-12 rounded-xl border-[1.5px] border-[#4A6670] bg-white text-[#4A6670] text-[15px] font-semibold">
          Partager la liste
        </button>
      </div>
      <div className="h-24" aria-hidden />
    </div>
  );
};

export default Epicerie;
