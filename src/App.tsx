
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotorProvider } from "./context/MotorContext";
import { MqttProvider } from "./context/MqttContext";
import MqttMotorConnector from "./components/MqttMotorConnector";
import Index from "./pages/Index";
import Motors from "./pages/Motors";
import Schedule from "./pages/Schedule";
import MotorSchedule from "./pages/MotorSchedule";
import NotFound from "./pages/NotFound";
import MqttStatus from "./components/MqttStatus";

const queryClient = new QueryClient();

// MQTT broker configuration - replace with your actual server details
const MQTT_CONFIG = {
  brokerUrl: "mqtt://your-mqtt-broker:1883", // Replace with your broker URL
  username: "your-username",                  // Replace with your username
  password: "your-password"                   // Replace with your password
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotorProvider>
      <MqttProvider 
        brokerUrl={MQTT_CONFIG.brokerUrl}
        username={MQTT_CONFIG.username}
        password={MQTT_CONFIG.password}
      >
        <MqttMotorConnector />
        <MqttStatus />
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
      </MqttProvider>
    </MotorProvider>
  </QueryClientProvider>
);

export default App;
