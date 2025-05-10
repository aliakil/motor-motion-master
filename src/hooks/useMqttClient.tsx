
import { useEffect, useState } from 'react';
import { mqttService } from '@/services/MqttService';

// Default MQTT configuration can be overridden through this hook
export const useMqttClient = (config?: {
  brokerUrl?: string;
  username?: string;
  password?: string;
}) => {
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    // Initialize MQTT service without referencing the motor context
    if (config?.brokerUrl && !isConfigured) {
      mqttService.connect({
        brokerUrl: config.brokerUrl,
        username: config.username,
        password: config.password
      });
      setIsConfigured(true);
      console.log('[MQTT] Configured with provided broker URL');
    } else if (!isConfigured) {
      // Default connection (for development only)
      console.log('[MQTT] No broker URL provided, connection pending');
    }
    
    // No cleanup needed as this is a singleton service
    // that should persist throughout the app lifecycle
  }, [config, isConfigured]);
  
  return mqttService;
};
