
import { Motor, Schedule } from '@/context/MotorContext';
import mqtt from 'mqtt';

// Map for day of week number to ScheduleDay
const dowToScheduleDay = (dow: number): string => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return dow >= 0 && dow <= 6 ? days[dow] : "Monday";
};

// Define the interface for motor service
interface MotorService {
  motors: Array<Motor>;
  updateSchedule: (schedule: Schedule) => void;
  addSchedule: (schedule: Omit<Schedule, "id">) => void;
  deleteSchedule: (scheduleId: string) => void;
  toggleMotor: (id: string) => void;
}

interface MqttConfig {
  brokerUrl: string;
  username: string;
  password: string;
  clientId: string;
}

export class MqttService {
  private motorService: MotorService | null = null;
  private client: mqtt.MqttClient | null = null;
  private config: MqttConfig = {
    brokerUrl: '', // Will be set when connect() is called
    username: '',  // Will be set when connect() is called
    password: '',  // Will be set when connect() is called
    clientId: `mqttjs_${Math.random().toString(16).slice(2, 10)}` // Generate a random client ID
  };
  private isConnected: boolean = false;
  
  constructor() {
    // This will be initialized when setMotorService is called
  }

  // This should be called after both providers are initialized
  setMotorService(motorService: MotorService) {
    this.motorService = motorService;
    console.log('[MQTT] Service initialized and connected to motor service');
    
    // Subscribe to relevant topics if already connected
    if (this.isConnected && this.client) {
      this.setupSubscriptions();
    }
  }

  connect(config?: Partial<MqttConfig>) {
    // Update configuration if provided
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    // Ensure we have the necessary connection details
    if (!this.config.brokerUrl) {
      console.error('[MQTT] Broker URL not provided');
      return;
    }

    // Clean up any existing connection
    if (this.client) {
      this.disconnect();
    }
    
    console.log(`[MQTT] Connecting to broker: ${this.config.brokerUrl}`);

    // Setup connection options
    const options: mqtt.IClientOptions = {
      clientId: this.config.clientId,
      clean: true,
      reconnectPeriod: 5000, // Automatic reconnect every 5 seconds
    };

    // Add authentication if provided
    if (this.config.username && this.config.password) {
      options.username = this.config.username;
      options.password = this.config.password;
    }

    try {
      // Create MQTT client
      this.client = mqtt.connect(this.config.brokerUrl, options);
      
      // Set up event handlers
      this.client.on('connect', this.handleConnect.bind(this));
      this.client.on('message', this.handleMessage.bind(this));
      this.client.on('error', this.handleError.bind(this));
      this.client.on('reconnect', () => console.log('[MQTT] Attempting to reconnect...'));
      this.client.on('close', () => {
        console.log('[MQTT] Connection closed');
        this.isConnected = false;
      });
      this.client.on('offline', () => console.log('[MQTT] Client is offline'));
    } catch (error) {
      console.error('[MQTT] Connection error:', error);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.isConnected = false;
      console.log('[MQTT] Disconnected from broker');
    }
  }

  private handleConnect() {
    console.log('[MQTT] Connected to broker');
    this.isConnected = true;
    
    // Set up subscriptions to relevant topics
    if (this.client) {
      this.setupSubscriptions();
    }
  }

  private setupSubscriptions() {
    if (!this.client) return;
    
    // Subscribe to topics
    this.client.subscribe('lights', { qos: 0 });
    this.client.subscribe('schedule', { qos: 0 });
    this.client.subscribe('pr', { qos: 0 });
    
    console.log('[MQTT] Subscribed to topics: lights, schedule, pr');
  }

  private handleMessage(topic: string, payload: Buffer) {
    const message = payload.toString();
    console.log(`[MQTT] Message received: ${topic} - ${message}`);
    
    // Process message using our existing logic
    this.processMessage(topic, message);
  }

  private handleError(error: Error) {
    console.error('[MQTT] Error:', error.message);
  }

  publish(topic: string, message: string) {
    if (this.client && this.isConnected) {
      this.client.publish(topic, message, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(`[MQTT] Publish error: ${error.message}`);
        } else {
          console.log(`[MQTT] Published: ${topic} - ${message}`);
        }
      });
    } else {
      console.error('[MQTT] Cannot publish: not connected');
    }
  }

  // The following methods are kept from the previous implementation
  private handleLightsMessage(payload: string) {
    if (!this.motorService) {
      console.error('[MQTT] Motor service not initialized');
      return;
    }
    
    const parts = payload.split(',');
    
    if (parts.length !== 2) {
      console.error('[MQTT] Invalid lights message format:', payload);
      return;
    }
    
    const motorIndex = parseInt(parts[0]);
    const action = parseInt(parts[1]); // 0 = OFF, 1 = ON
    
    if (isNaN(motorIndex) || motorIndex < 1 || motorIndex > 8) {
      console.error('[MQTT] Invalid motor index:', motorIndex);
      return;
    }
    
    if (action !== 0 && action !== 1) {
      console.error('[MQTT] Invalid action:', action);
      return;
    }
    
    // Find the corresponding motor by index (using motorIndex - 1 to convert to 0-based)
    const motorId = this.motorService.motors[motorIndex - 1]?.id;
    
    if (!motorId) {
      console.error('[MQTT] Motor not found for index:', motorIndex);
      return;
    }
    
    // Toggle the motor
    this.motorService.toggleMotor(motorId);
    
    console.log(`[MQTT] Motor ${motorIndex} manual -> ${action === 1 ? 'ON' : 'OFF'}`);
  }
  
  private handleScheduleMessage(payload: string) {
    if (!this.motorService) {
      console.error('[MQTT] Motor service not initialized');
      return;
    }
    
    const parts = payload.split(',');
    
    if (parts.length !== 8) {
      console.error('[MQTT] Invalid schedule message format:', payload);
      return;
    }
    
    // Parse the message: "_,motorIndex,slot,hour,minute,dow,repeat,action"
    const motorIndex = parseInt(parts[1]);
    const slot = parseInt(parts[2]);
    const hour = parseInt(parts[3]);
    const minute = parseInt(parts[4]);
    const dow = parseInt(parts[5]);
    const repeat = parseInt(parts[6]) === 1;
    const action = parseInt(parts[7]) === 1; // 1 = ON, 0 = OFF
    
    // Validations
    if (isNaN(motorIndex) || motorIndex < 1 || motorIndex > 8) {
      console.error('[MQTT] Invalid motor index:', motorIndex);
      return;
    }
    
    if (isNaN(slot) || slot < 1 || slot > 5) {
      console.error('[MQTT] Invalid slot:', slot);
      return;
    }
    
    if (isNaN(hour) || hour < 0 || hour > 23) {
      console.error('[MQTT] Invalid hour:', hour);
      return;
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
      console.error('[MQTT] Invalid minute:', minute);
      return;
    }
    
    // Find the corresponding motor
    const motor = this.motorService.motors[motorIndex - 1];
    
    if (!motor) {
      console.error('[MQTT] Motor not found for index:', motorIndex);
      return;
    }
    
    // Format time strings with padding
    const startTimeHour = hour.toString().padStart(2, '0');
    const startTimeMinute = minute.toString().padStart(2, '0');
    const startTime = `${startTimeHour}:${startTimeMinute}`;
    
    // Calculate end time (for simplicity, we'll set it to 1 hour later)
    const endHour = (hour + 1) % 24;
    const endTimeHour = endHour.toString().padStart(2, '0');
    const endTime = `${endTimeHour}:${startTimeMinute}`;
    
    // Convert dow to ScheduleDay or handle special case 255 (any day)
    const days = dow === 255
      ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      : [dowToScheduleDay(dow)];
    
    // Create new schedule
    this.motorService.addSchedule({
      motorId: motor.id,
      days: days as any, // Type casting since the function returns string but we need ScheduleDay
      startTime: startTime,
      endTime: endTime,
      repeat: repeat,
      active: action // true for ON, false for OFF
    });
    
    console.log(`[MQTT] Motor ${motorIndex} slot ${slot} scheduled -> ${action ? 'ON' : 'OFF'} at ${startTimeHour}:${startTimeMinute} DOW ${dow === 255 ? 'All' : dow} (${repeat ? 'Repeats' : 'One-time'})`);
  }
  
  private handlePrMessage(payload: string) {
    if (!this.motorService) {
      console.error('[MQTT] Motor service not initialized');
      return;
    }
    
    const parts = payload.split(',');
    
    if (parts.length !== 3) {
      console.error('[MQTT] Invalid pr (delete) message format:', payload);
      return;
    }
    
    const motorIndex = parseInt(parts[1]);
    const slot = parseInt(parts[2]);
    
    if (isNaN(motorIndex) || motorIndex < 1 || motorIndex > 8) {
      console.error('[MQTT] Invalid motor index:', motorIndex);
      return;
    }
    
    if (isNaN(slot) || slot < 1 || slot > 5) {
      console.error('[MQTT] Invalid slot:', slot);
      return;
    }
    
    // Find the motor
    const motor = this.motorService.motors[motorIndex - 1];
    
    if (!motor) {
      console.error('[MQTT] Motor not found for index:', motorIndex);
      return;
    }
    
    // In our current system we don't have slot numbers for schedules,
    // so let's delete by index
    const schedulesToDelete = motor.schedules;
    
    if (schedulesToDelete.length >= slot) {
      // Delete the specific schedule at slot-1 (converting to 0-based)
      this.motorService.deleteSchedule(schedulesToDelete[slot-1].id);
      
      console.log(`[MQTT] Motor ${motorIndex} slot ${slot} deleted`);
    } else {
      console.error(`[MQTT] No schedule found for motor ${motorIndex} at slot ${slot}`);
    }
  }
  
  // Method to process incoming messages
  processMessage(topic: string, payload: string) {
    switch(topic) {
      case 'lights':
        this.handleLightsMessage(payload);
        break;
      case 'schedule':
        this.handleScheduleMessage(payload);
        break;
      case 'pr':
        this.handlePrMessage(payload);
        break;
      default:
        console.warn(`[MQTT] Unknown topic: ${topic}`);
    }
  }
  
  // For development/demo purposes: simulate incoming messages
  private simulateMessages() {
    if (!this.motorService) return;
    
    // Simulate turning on motor 3
    setTimeout(() => {
      this.processMessage('lights', '3,1');
    }, 5000);
    
    // Simulate adding a schedule to motor 2
    setTimeout(() => {
      this.processMessage('schedule', 'X,2,4,06,15,3,1,1');
    }, 10000);
    
    // Simulate deleting a schedule from motor 5
    setTimeout(() => {
      this.processMessage('pr', 'X,5,2');
    }, 15000);
  }
}

export const mqttService = new MqttService();
