
import { useEffect } from 'react';
import { mqttService } from '@/services/MqttService';

export const useMqttClient = () => {
  useEffect(() => {
    // Initialize MQTT service without referencing the motor context
    mqttService.connect();
    
    // No cleanup needed as this is a singleton service
    // that should persist throughout the app lifecycle
  }, []);
  
  return mqttService;
};
