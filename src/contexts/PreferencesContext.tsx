import * as React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    try {
      const stored = localStorage.getItem(`nexeat_${key}`);
      return stored !== null ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try { localStorage.setItem(`nexeat_${key}`, JSON.stringify(v)); } catch {}
  };
  return [value, set] as const;
}

export type Lifestyle = "solo" | "coloc" | "famille" | null;
export type FallbackMeal =
  | "delivery"
  | "leftovers"
  | "quick-sandwich"
  | "snacks"
  | "skip"
  | null;

export interface SavedRecipe {
  id: string;
  title: string;
  prep: string;
  portions: string;
  score: "A" | "B" | "C" | "D" | "E";
}

interface PreferencesContextValue {
  restrictions: string[];
  budget: number;
  planAccepted: boolean;
  calendarConnected: boolean;
  lifestyle: Lifestyle;
  portions: number;
  kitchenEquipment: string[];
  groceryStores: string[];
  fallbackMeal: FallbackMeal;
  onboardingCompleted: boolean;
  savedRecipes: SavedRecipe[];
  setRestrictions: (v: string[]) => void;
  setBudget: (v: number) => void;
  setPlanAccepted: (v: boolean) => void;
  setCalendarConnected: (v: boolean) => void;
  setLifestyle: (v: Lifestyle) => void;
  setPortions: (v: number) => void;
  setKitchenEquipment: (v: string[]) => void;
  setGroceryStores: (v: string[]) => void;
  setFallbackMeal: (v: FallbackMeal) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setSavedRecipes: (v: SavedRecipe[]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [restrictions, setRestrictions] = usePersisted<string[]>("restrictions", []);
  const [budget, setBudget] = usePersisted<number>("budget", 100);
  const [planAccepted, setPlanAccepted] = usePersisted<boolean>("planAccepted", false);
  const [calendarConnected, setCalendarConnected] = usePersisted<boolean>("calendarConnected", false);
  const [lifestyle, setLifestyle] = usePersisted<Lifestyle>("lifestyle", null);
  const [portions, setPortions] = usePersisted<number>("portions", 1);
  const [kitchenEquipment, setKitchenEquipment] = useState<string[]>([
    "cuisinière",
    "four",
    "frigo",
    "micro-ondes",
  ]);
  const [groceryStores, setGroceryStores] = usePersisted<string[]>("groceryStores", []);
  const [fallbackMeal, setFallbackMeal] = usePersisted<FallbackMeal>("fallbackMeal", null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  return (
    <PreferencesContext.Provider
      value={{
        restrictions,
        budget,
        planAccepted,
        calendarConnected,
        lifestyle,
        portions,
        kitchenEquipment,
        groceryStores,
        fallbackMeal,
        onboardingCompleted,
        savedRecipes,
        setRestrictions,
        setBudget,
        setPlanAccepted,
        setCalendarConnected,
        setLifestyle,
        setPortions,
        setKitchenEquipment,
        setGroceryStores,
        setFallbackMeal,
        setOnboardingCompleted,
        setSavedRecipes,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
};