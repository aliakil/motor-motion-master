
import { useEffect } from 'react';
import { useMotors } from '@/context/MotorContext';
import { useMqtt } from '@/context/MqttContext';

const MqttMotorConnector = () => {
  const motorHooks = useMotors();
  const mqttService = useMqtt();
  
  useEffect(() => {
    // Connect the MQTT service to the motor context
    mqttService.setMotorService(motorHooks);
    console.log('[MQTT] Connected to motor service');
    
    // No cleanup needed as this connection should persist
  }, [mqttService, motorHooks]);
  
  return null; // This component doesn't render anything
};

export default MqttMotorConnector;
