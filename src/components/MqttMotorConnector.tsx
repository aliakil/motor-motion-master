
import { useEffect } from 'react';
import { useMotors } from '@/context/MotorContext';
import { useMqtt } from '@/context/MqttContext';

const MqttMotorConnector = () => {
  const motorHooks = useMotors();
  const mqttService = useMqtt();
  
  useEffect(() => {
    // Connect the MQTT service to the motor context
    mqttService.setMotorService(motorHooks);
  }, [mqttService, motorHooks]);
  
  return null; // This component doesn't render anything
};

export default MqttMotorConnector;
