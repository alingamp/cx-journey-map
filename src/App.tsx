
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IndustryTrendAnalysis from "./pages/IndustryTrendAnalysis";
import Performance from "./pages/Performance";
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
          <Route path="/industry-trend-analysis" element={<IndustryTrendAnalysis />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/customer-insights" element={<CustomerInsights />} />
          <Route path="/settings" element={<Settings />} />
          {/* Legacy routes that redirect to new combined page */}
          <Route path="/industry-analysis" element={<IndustryTrendAnalysis />} />
          <Route path="/trend-analysis" element={<IndustryTrendAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
