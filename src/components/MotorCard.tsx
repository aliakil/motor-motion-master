
import { Motor, useMotors } from "@/context/MotorContext";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Droplet } from "lucide-react";

interface MotorCardProps {
  motor: Motor;
  showScheduleButton?: boolean;
  compact?: boolean;
}

const MotorCard: React.FC<MotorCardProps> = ({ motor, showScheduleButton = false, compact = false }) => {
  const { toggleMotor } = useMotors();
  const location = useLocation();
  
  // Only allow toggling motors from motors tab or dashboard
  const canToggleMotor = location.pathname === "/motors" || location.pathname === "/";

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-3' : 'p-5'} mb-4`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold`}>{motor.name}</h3>
        
        {canToggleMotor && (
          <button
            aria-label={`Toggle ${motor.name}`}
            onClick={() => toggleMotor(motor.id)}
            className={`motor-switch ${motor.isOn ? 'motor-switch-bg-on' : 'motor-switch-bg-off'}`}
          >
            <span 
              className={`motor-switch-thumb ${motor.isOn ? 'motor-switch-thumb-on' : 'motor-switch-thumb-off'}`}
            />
          </button>
        )}
      </div>
      
      <div className={`flex ${compact ? 'flex-col' : 'justify-between'} mb-3`}>
        <div className="flex items-center">
          <div className={`motor-icon-circle ${motor.status === 'Running' ? 'water-icon-bg' : 'bg-red-100'} ${compact ? 'h-8 w-8' : ''}`}>
            <svg className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} ${motor.status === 'Running' ? 'text-blue-500' : 'text-red-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
            </svg>
          </div>
          <div className="ml-2">
            <div className={`text-sm text-gray-500 ${compact ? 'text-xs' : ''}`}>Status</div>
            <div className={`font-medium ${motor.status === 'Running' ? 'text-running' : 'text-stopped'} ${compact ? 'text-sm' : ''}`}>
              {motor.status}
            </div>
          </div>
        </div>
        
        <div className={`${compact ? 'mt-2' : 'text-right'}`}>
          <div className={`text-sm text-gray-500 ${compact ? 'text-xs' : ''}`}>Zone:</div>
          <div className={`font-medium ${compact ? 'text-sm' : ''}`}>{motor.zone}</div>
        </div>
      </div>
      
      {!compact && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span className="flex items-center">
              <Droplet className="h-4 w-4 mr-1 text-purple-500" />
              Humidity
            </span>
            <span>{motor.humidity}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill bg-purple-500" 
              style={{ width: `${motor.humidity}%` }} 
            />
          </div>
        </div>
      )}
      
      {showScheduleButton && (
        <div className={`${compact ? 'mt-2' : 'mt-4'} flex justify-end`}>
          <Link 
            to={`/motor/${motor.id}/schedule`} 
            className={`flex items-center text-primary ${compact ? 'text-xs' : 'text-sm'}`}
          >
            <Calendar className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
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
