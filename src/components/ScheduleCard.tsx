
import { Schedule, useMotors } from "@/context/MotorContext";
import { useState } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";

interface ScheduleCardProps {
  schedule: Schedule;
  motorName: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, motorName }) => {
  const { updateSchedule, deleteSchedule } = useMotors();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleActive = () => {
    updateSchedule({
      ...schedule,
      active: !schedule.active
    });
  };
  
  const dayNames = schedule.days.join(", ");
  
  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{motorName}</h3>
          <button
            aria-label={`Toggle schedule for ${motorName}`}
            onClick={handleToggleActive}
            className={`motor-switch ${schedule.active ? 'motor-switch-bg-on' : 'motor-switch-bg-off'}`}
          >
            <span 
              className={`motor-switch-thumb ${schedule.active ? 'motor-switch-thumb-on' : 'motor-switch-thumb-off'}`}
            />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{dayNames}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{schedule.startTime} - {schedule.endTime}</span>
          </div>
          
          <div className="col-span-2">
            <span className="text-xs text-gray-500">
              {schedule.repeat ? 'Repeats weekly' : 'One-time schedule'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary"
          >
            {isExpanded ? 'Close' : 'Edit'}
          </button>
          
          <button
            onClick={() => deleteSchedule(schedule.id)}
            className="text-xs flex items-center text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          {/* Simplified edit form - in a real app, this would have proper inputs and validation */}
          <p className="text-xs text-gray-500 text-center">Edit schedule functionality would go here</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
