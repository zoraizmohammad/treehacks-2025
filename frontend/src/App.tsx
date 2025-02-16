
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WorkNight from "./pages/WorkNight";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin";
import TrustedLoans from "./pages/TrustedLoans";
import TrustedLoansAdmin from "./pages/TrustedLoansAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/worknight" element={<WorkNight />} />
          <Route path="/worknight/admin" element={<AdminDashboard />} />
          <Route path="/trustedloans" element={<TrustedLoans />} />
          <Route path="/trustedloans/admin" element={<TrustedLoansAdmin />} />
          <Route path="/form" element={<Form />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
