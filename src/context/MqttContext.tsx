
import React, { createContext, useContext, useState } from "react";
import { useMqttClient } from "@/hooks/useMqttClient";
import { mqttService } from "@/services/MqttService";

// Create a context for MQTT
const MqttContext = createContext<typeof mqttService | undefined>(undefined);

export interface MqttProviderProps {
  children: React.ReactNode;
  brokerUrl?: string;
  username?: string;
  password?: string;
}

export const MqttProvider: React.FC<MqttProviderProps> = ({ 
  children, 
  brokerUrl,
  username,
  password
}) => {
  // Use our hook that sets up the MQTT connection
  const mqttClient = useMqttClient({ brokerUrl, username, password });
  
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
