import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import AppShell from "./components/AppShell";
import Onboarding from "./pages/Onboarding";
import OnboardingStep2 from "./pages/OnboardingStep2";
import OnboardingConnect from "./pages/OnboardingConnect";
import OnboardingDemo from "./pages/OnboardingDemo";
import Generation from "./pages/Generation";
import Semaine from "./pages/Semaine";
import Aujourdhui from "./pages/Aujourdhui";
import Epicerie from "./pages/Epicerie";
import Profil from "./pages/Profil";
import Recettes from "./pages/Recettes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/2" element={<OnboardingStep2 />} />
          <Route path="/onboarding/demo" element={<OnboardingDemo />} />
          <Route path="/onboarding/connect" element={<OnboardingConnect />} />
          <Route path="/onboarding/3" element={<OnboardingConnect />} />
          <Route path="/generation" element={<Generation />} />
          <Route element={<AppShell />}>
            <Route path="/semaine" element={<Semaine />} />
            <Route path="/aujourd-hui" element={<Aujourdhui />} />
            <Route path="/epicerie" element={<Epicerie />} />
            <Route path="/recettes" element={<Recettes />} />
            <Route path="/profil" element={<Profil />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
