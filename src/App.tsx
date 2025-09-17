import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Irrigation from "./pages/Irrigation";
import Fertilizer from "./pages/Fertilizer";
import Pest from "./pages/Pest";
import Yield from "./pages/Yield";
import Alerts from "./pages/Alerts";
import Planning from "./pages/Planning";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/fertilizer" element={<Fertilizer />} />
            <Route path="/pest" element={<Pest />} />
            <Route path="/yield" element={<Yield />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
