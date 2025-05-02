
import { useState } from "react";
import { Motor, ScheduleDay, useMotors } from "@/context/MotorContext";

interface AddScheduleFormProps {
  motor: Motor;
  onClose: () => void;
}

const daysOfWeek: ScheduleDay[] = [
  "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday", "Sunday"
];

const AddScheduleForm: React.FC<AddScheduleFormProps> = ({ motor, onClose }) => {
  const { addSchedule } = useMotors();
  const [selectedDays, setSelectedDays] = useState<ScheduleDay[]>([]);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");
  const [repeat, setRepeat] = useState(true);
  
  const handleDayToggle = (day: ScheduleDay) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDays.length === 0) {
      alert("Please select at least one day");
      return;
    }
    
    addSchedule({
      motorId: motor.id,
      days: selectedDays,
      startTime,
      endTime,
      repeat,
      active: true
    });
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select Days</label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <button
              type="button"
              key={day}
              onClick={() => handleDayToggle(day)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedDays.includes(day) 
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
          <label htmlFor="startTime" className="block text-sm font-medium mb-2">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-2">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="repeat"
          checked={repeat}
          onChange={(e) => setRepeat(e.target.checked)}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
        <label htmlFor="repeat" className="ml-2 text-sm">
          Repeat weekly
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border rounded text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-primary text-white rounded"
        >
          Save Schedule
        </button>
      </div>
    </form>
  );
};

export default AddScheduleForm;
