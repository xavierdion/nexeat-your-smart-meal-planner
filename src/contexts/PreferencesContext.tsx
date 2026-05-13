import { createContext, useContext, useState, ReactNode } from "react";

export type Lifestyle = "solo" | "coloc" | "famille" | null;
export type FallbackMeal =
  | "delivery"
  | "leftovers"
  | "quick-sandwich"
  | "snacks"
  | "skip"
  | null;

interface PreferencesContextValue {
  restrictions: string[];
  budget: number;
  planAccepted: boolean;
  calendarConnected: boolean;
  lifestyle: Lifestyle;
  kitchenEquipment: string[];
  groceryStores: string[];
  fallbackMeal: FallbackMeal;
  onboardingCompleted: boolean;
  setRestrictions: (v: string[]) => void;
  setBudget: (v: number) => void;
  setPlanAccepted: (v: boolean) => void;
  setCalendarConnected: (v: boolean) => void;
  setLifestyle: (v: Lifestyle) => void;
  setKitchenEquipment: (v: string[]) => void;
  setGroceryStores: (v: string[]) => void;
  setFallbackMeal: (v: FallbackMeal) => void;
  setOnboardingCompleted: (v: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(100);
  const [planAccepted, setPlanAccepted] = useState<boolean>(false);
  const [calendarConnected, setCalendarConnected] = useState<boolean>(false);
  const [lifestyle, setLifestyle] = useState<Lifestyle>(null);
  const [kitchenEquipment, setKitchenEquipment] = useState<string[]>([
    "cuisinière",
    "four",
    "frigo",
    "micro-ondes",
  ]);
  const [groceryStores, setGroceryStores] = useState<string[]>([]);
  const [fallbackMeal, setFallbackMeal] = useState<FallbackMeal>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  return (
    <PreferencesContext.Provider
      value={{
        restrictions,
        budget,
        planAccepted,
        calendarConnected,
        lifestyle,
        kitchenEquipment,
        groceryStores,
        fallbackMeal,
        onboardingCompleted,
        setRestrictions,
        setBudget,
        setPlanAccepted,
        setCalendarConnected,
        setLifestyle,
        setKitchenEquipment,
        setGroceryStores,
        setFallbackMeal,
        setOnboardingCompleted,
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