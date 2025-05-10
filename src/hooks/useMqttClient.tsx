
import { useEffect } from 'react';
import { useMotors } from '@/context/MotorContext';
import { mqttService } from '@/services/MqttService';

export const useMqttClient = () => {
  const motorHooks = useMotors();
  
  useEffect(() => {
    // Initialize MQTT service with access to the motor context
    mqttService.connect(motorHooks);
    
    // No cleanup needed as this is a singleton service
    // that should persist throughout the app lifecycle
  }, []);
  
  return mqttService;
};
