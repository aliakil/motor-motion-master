
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotorProvider } from "./context/MotorContext";
import Index from "./pages/Index";
import Motors from "./pages/Motors";
import Schedule from "./pages/Schedule";
import MotorSchedule from "./pages/MotorSchedule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotorProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/motors" element={<Motors />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/motor/:motorId/schedule" element={<MotorSchedule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotorProvider>
  </QueryClientProvider>
);

export default App;
