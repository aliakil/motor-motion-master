import React, { createContext, useContext, useState, useEffect } from "react";

export type ScheduleDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Schedule {
  id: string;
  motorId: string;
  days: ScheduleDay[];
  startTime: string;
  endTime: string;
  repeat: boolean;
  active: boolean;
}

export interface Motor {
  id: string;
  name: string;
  status: "Running" | "Stopped" | "Maintenance";
  zone: string;
  flowRate: number;
  operatingHours: number;
  maintenance: "Good" | "Needs Attention" | "Maintenance Required";
  humidity: number;  // Changed from waterPressure to humidity
  isOn: boolean;
  schedules: Schedule[];
}

export interface SystemStatus {
  status: "Online" | "Offline";
  waterCapacity: number;  // Changed from waterFlow to waterCapacity as a static value
  weather: string;
}

interface MotorContextType {
  motors: Motor[];
  systemStatus: SystemStatus;
  toggleMotor: (id: string) => void;
  addMotor: (motor: Omit<Motor, "id" | "schedules">) => string;
  updateMotor: (motor: Motor) => void;
  addSchedule: (schedule: Omit<Schedule, "id">) => void;
  updateSchedule: (schedule: Schedule) => void;
  deleteSchedule: (scheduleId: string) => void;
}

const MotorContext = createContext<MotorContextType | undefined>(undefined);

const defaultMotors: Motor[] = [
  {
    id: "M-2025-001",
    name: "Motor 1",
    status: "Running",
    zone: "Front Lawn",
    flowRate: 12.5,
    operatingHours: 128.5,
    maintenance: "Good",
    humidity: 70,  // Changed from waterPressure to humidity
    isOn: true,
    schedules: [
      {
        id: "SCH-001",
        motorId: "M-2025-001",
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "06:00",
        endTime: "07:00",
        repeat: true,
        active: true
      }
    ]
  },
  {
    id: "M-2025-002",
    name: "Motor 2",
    status: "Stopped",
    zone: "Back Yard",
    flowRate: 0,
    operatingHours: 87.2,
    maintenance: "Good",
    humidity: 45,  // Changed value and property name
    isOn: false,
    schedules: []
  },
  {
    id: "M-2025-003",
    name: "Motor 3",
    status: "Stopped",
    zone: "Side Garden",
    flowRate: 0,
    operatingHours: 56.7,
    maintenance: "Needs Attention",
    humidity: 30,  // Changed value and property name
    isOn: false,
    schedules: []
  },
  {
    id: "M-2025-004",
    name: "Motor 4",
    status: "Running",
    zone: "Vegetable Garden",
    flowRate: 8.7,
    operatingHours: 92.3,
    maintenance: "Good",
    humidity: 65,  // Changed from waterPressure to humidity
    isOn: true,
    schedules: []
  },
  {
    id: "M-2025-005",
    name: "Motor 5",
    status: "Stopped",
    zone: "Flower Bed",
    flowRate: 0,
    operatingHours: 45.1,
    maintenance: "Good",
    humidity: 25,  // Changed value and property name
    isOn: false,
    schedules: []
  },
  {
    id: "M-2025-006",
    name: "Motor 6",
    status: "Maintenance",
    zone: "Pool Area",
    flowRate: 0,
    operatingHours: 215.8,
    maintenance: "Maintenance Required",
    humidity: 10,  // Changed value and property name
    isOn: false,
    schedules: []
  },
  {
    id: "M-2025-007",
    name: "Motor 7",
    status: "Stopped",
    zone: "Patio",
    flowRate: 0,
    operatingHours: 67.3,
    maintenance: "Good",
    humidity: 55,  // Changed value and property name
    isOn: false,
    schedules: []
  },
  {
    id: "M-2025-008",
    name: "Motor 8",
    status: "Stopped",
    zone: "Greenhouse",
    flowRate: 0,
    operatingHours: 103.6,
    maintenance: "Good",
    humidity: 40,  // Changed value and property name
    isOn: false,
    schedules: []
  }
];

const defaultSystemStatus: SystemStatus = {
  status: "Online",
  waterCapacity: 75.5,  // Fixed value for water capacity that doesn't change
  weather: "Sunny"
};

export const MotorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motors, setMotors] = useState<Motor[]>(defaultMotors);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(defaultSystemStatus);

  // No need to update waterCapacity based on motors anymore
  // As it's now a fixed value that doesn't change when motors are turned on/off

  const toggleMotor = (id: string) => {
    setMotors(prevMotors => 
      prevMotors.map(motor => {
        if (motor.id === id) {
          const newIsOn = !motor.isOn;
          const newStatus = newIsOn ? "Running" : "Stopped";
          const newFlowRate = newIsOn ? (motor.status === "Maintenance" ? 0 : 12.5) : 0;
          // Keep humidity unchanged when toggling motor
          
          return {
            ...motor,
            isOn: newIsOn,
            status: motor.status === "Maintenance" ? "Maintenance" : newStatus,
            flowRate: newFlowRate,
          };
        }
        return motor;
      })
    );
  };

  const addMotor = (motor: Omit<Motor, "id" | "schedules">) => {
    const newMotorId = `M-2025-${String(motors.length + 1).padStart(3, '0')}`;
    
    const newMotor: Motor = {
      ...motor,
      id: newMotorId,
      schedules: []
    };
    
    setMotors(prev => [...prev, newMotor]);
    
    return newMotorId;
  };

  const updateMotor = (updatedMotor: Motor) => {
    setMotors(prev => 
      prev.map(motor => 
        motor.id === updatedMotor.id ? updatedMotor : motor
      )
    );
  };

  const addSchedule = (schedule: Omit<Schedule, "id">) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: `SCH-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
    };
    
    setMotors(prev => 
      prev.map(motor => {
        if (motor.id === schedule.motorId) {
          return {
            ...motor,
            schedules: [...motor.schedules, newSchedule]
          };
        }
        return motor;
      })
    );
  };

  const updateSchedule = (updatedSchedule: Schedule) => {
    setMotors(prev => 
      prev.map(motor => {
        if (motor.id === updatedSchedule.motorId) {
          return {
            ...motor,
            schedules: motor.schedules.map(schedule => 
              schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            )
          };
        }
        return motor;
      })
    );
  };

  const deleteSchedule = (scheduleId: string) => {
    setMotors(prev => 
      prev.map(motor => ({
        ...motor,
        schedules: motor.schedules.filter(schedule => schedule.id !== scheduleId)
      }))
    );
  };

  return (
    <MotorContext.Provider 
      value={{ 
        motors, 
        systemStatus, 
        toggleMotor, 
        addMotor,
        updateMotor,
        addSchedule,
        updateSchedule,
        deleteSchedule
      }}
    >
      {children}
    </MotorContext.Provider>
  );
};

export const useMotors = () => {
  const context = useContext(MotorContext);
  if (context === undefined) {
    throw new Error('useMotors must be used within a MotorProvider');
  }
  return context;
};
