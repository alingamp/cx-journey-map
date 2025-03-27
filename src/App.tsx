
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IndustryAnalysis from "./pages/IndustryAnalysis";
import TrendAnalysis from "./pages/TrendAnalysis";
import Performance from "./pages/Performance";
import CompetitiveData from "./pages/CompetitiveData";
import CustomerInsights from "./pages/CustomerInsights";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/industry-analysis" element={<IndustryAnalysis />} />
          <Route path="/trend-analysis" element={<TrendAnalysis />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/competitive-data" element={<CompetitiveData />} />
          <Route path="/customer-insights" element={<CustomerInsights />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
