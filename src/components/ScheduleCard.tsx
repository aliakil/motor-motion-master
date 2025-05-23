
import { Schedule, useMotors, ScheduleDay } from "@/context/MotorContext";
import { useState } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";

interface ScheduleCardProps {
  schedule: Schedule;
  motorName: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, motorName }) => {
  const { updateSchedule, deleteSchedule } = useMotors();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<Schedule>(schedule);
  
  const handleToggleActive = () => {
    updateSchedule({
      ...schedule,
      active: !schedule.active
    });
  };

  const daysOfWeek: ScheduleDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const handleDayToggle = (day: ScheduleDay) => {
    if (editedSchedule.days.includes(day)) {
      setEditedSchedule({
        ...editedSchedule,
        days: editedSchedule.days.filter(d => d !== day)
      });
    } else {
      setEditedSchedule({
        ...editedSchedule,
        days: [...editedSchedule.days, day]
      });
    }
  };
  
  const handleSaveChanges = () => {
    if (editedSchedule.days.length === 0) {
      alert("Please select at least one day");
      return;
    }
    
    updateSchedule(editedSchedule);
    setIsExpanded(false);
  };
  
  const handleCancel = () => {
    setEditedSchedule(schedule);
    setIsExpanded(false);
  };
  
  const dayNames = schedule.days.join(", ");
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800">{motorName}</h3>
          </div>
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
        
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center col-span-2">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">{schedule.startTime} - {schedule.endTime}</span>
            <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
              {schedule.repeat ? 'Repeats weekly' : 'One-time'}
            </span>
          </div>
          
          <div className="col-span-2 mt-2">
            <div className="flex flex-wrap gap-1.5">
              {daysOfWeek.map(day => (
                <span 
                  key={day}
                  className={`text-xs px-2 py-1 rounded-full ${
                    schedule.days.includes(day)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
          >
            {isExpanded ? 'Close' : 'Edit'}
          </button>
          
          <button
            onClick={() => deleteSchedule(schedule.id)}
            className="text-xs flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-full text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      editedSchedule.days.includes(day) 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="editStartTime" className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  id="editStartTime"
                  value={editedSchedule.startTime}
                  onChange={(e) => setEditedSchedule({...editedSchedule, startTime: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="editEndTime" className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  id="editEndTime"
                  value={editedSchedule.endTime}
                  onChange={(e) => setEditedSchedule({...editedSchedule, endTime: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editRepeat"
                checked={editedSchedule.repeat}
                onChange={(e) => setEditedSchedule({...editedSchedule, repeat: e.target.checked})}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="editRepeat" className="ml-2 text-sm">
                Repeat weekly
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm bg-primary text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
