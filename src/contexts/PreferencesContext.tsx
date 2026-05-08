import { createContext, useContext, useState, ReactNode } from "react";

interface PreferencesContextValue {
  restrictions: string[];
  budget: number;
  planAccepted: boolean;
  setRestrictions: (v: string[]) => void;
  setBudget: (v: number) => void;
  setPlanAccepted: (v: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [budget, setBudget] = useState<number>(85);
  const [planAccepted, setPlanAccepted] = useState<boolean>(false);

  return (
    <PreferencesContext.Provider
      value={{ restrictions, budget, planAccepted, setRestrictions, setBudget, setPlanAccepted }}
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