
import React, { createContext, useContext, useEffect } from "react";
import { useMqttClient } from "@/hooks/useMqttClient";
import { mqttService } from "@/services/MqttService";

// Create a context for MQTT
const MqttContext = createContext<typeof mqttService | undefined>(undefined);

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our hook that sets up the MQTT connection
  const mqttClient = useMqttClient();
  
  return (
    <MqttContext.Provider value={mqttClient}>
      {children}
    </MqttContext.Provider>
  );
};

// Hook to use the MQTT context
export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
};
