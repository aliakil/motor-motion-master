
import { useMotors } from "@/context/MotorContext";
import { CirclePlay, Droplet } from "lucide-react";

const SystemStatusCard = () => {
  const { systemStatus, motors } = useMotors();
  
  // Calculate active motors
  const activeMotors = motors.filter(motor => motor.isOn).length;
  const totalMotors = motors.length;

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">System Status</h2>
        <span className={`status-pill ${systemStatus.status === 'Online' ? 'status-online' : 'status-offline'}`}>
          {systemStatus.status}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div className="system-icon-circle water-icon-bg">
            <Droplet className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-sm mt-2">Water Capacity</div>
          <div className="text-lg font-semibold">{systemStatus.waterCapacity.toFixed(1)}%</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="system-icon-circle bg-green-100">
            <CirclePlay className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-sm mt-2">Motors Active</div>
          <div className="text-lg font-semibold">{activeMotors} / {totalMotors}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="system-icon-circle weather-icon-bg">
            <svg className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
            </svg>
          </div>
          <div className="text-sm mt-2">Weather</div>
          <div className="text-lg font-semibold">{systemStatus.weather}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
