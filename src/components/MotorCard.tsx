
import { Motor, useMotors } from "@/context/MotorContext";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface MotorCardProps {
  motor: Motor;
  showScheduleButton?: boolean;
}

const MotorCard: React.FC<MotorCardProps> = ({ motor, showScheduleButton = false }) => {
  const { toggleMotor } = useMotors();

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{motor.name}</h3>
        
        <button
          aria-label={`Toggle ${motor.name}`}
          onClick={() => toggleMotor(motor.id)}
          className={`motor-switch ${motor.isOn ? 'motor-switch-bg-on' : 'motor-switch-bg-off'}`}
        >
          <span 
            className={`motor-switch-thumb ${motor.isOn ? 'motor-switch-thumb-on' : 'motor-switch-thumb-off'}`}
          />
        </button>
      </div>
      
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <div className={`motor-icon-circle ${motor.status === 'Running' ? 'water-icon-bg' : 'bg-red-100'}`}>
            <svg className={`h-5 w-5 ${motor.status === 'Running' ? 'text-blue-500' : 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
            </svg>
          </div>
          <div className="ml-2">
            <div className="text-sm text-gray-500">Status</div>
            <div className={`font-medium ${motor.status === 'Running' ? 'text-running' : 'text-stopped'}`}>
              {motor.status}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">Zone:</div>
          <div className="font-medium">{motor.zone}</div>
        </div>
      </div>
      
      {motor.status === "Running" && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Flow Rate</span>
            <span>{motor.flowRate.toFixed(1)} L/min</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(motor.waterPressure)}%` }} 
            />
          </div>
        </div>
      )}
      
      {showScheduleButton && (
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/motor/${motor.id}/schedule`} 
            className="flex items-center text-sm text-primary"
          >
            <Calendar className="h-4 w-4 mr-1" />
            {motor.schedules.length > 0 
              ? `${motor.schedules.length} schedule${motor.schedules.length > 1 ? 's' : ''}` 
              : 'Set schedule'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default MotorCard;
