
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { useMotors, ScheduleDay } from "@/context/MotorContext";
import { Button } from "@/components/ui/button";

interface AddMotorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  motorId?: string; // Optional motorId for when scheduling for a specific motor
}

const daysOfWeek: ScheduleDay[] = [
  "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday", "Sunday"
];

const AddMotorDialog = ({ open, onOpenChange, motorId }: AddMotorDialogProps) => {
  const { addSchedule } = useMotors();
  const [selectedDays, setSelectedDays] = useState<ScheduleDay[]>([]);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");
  const [repeat, setRepeat] = useState(true);
  const [selectedMotorId, setSelectedMotorId] = useState(motorId || "");
  
  const handleDayToggle = (day: ScheduleDay) => 
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMotorId) {
      alert("Please select a motor");
      return;
    }
    
    if (selectedDays.length === 0) {
      alert("Please select at least one day for the schedule");
      return;
    }
    
    addSchedule({
      motorId: selectedMotorId,
      days: selectedDays,
      startTime, endTime,
      repeat, active: true
    });
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    if (!motorId) {
      setSelectedMotorId("");
    }
    setSelectedDays([]);
    setStartTime("06:00");
    setEndTime("07:00");
    setRepeat(true);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!motorId && (
            <div>
              <label htmlFor="motorId" className="block text-sm font-medium mb-2">Motor ID</label>
              <input
                type="text" id="motorId" value={selectedMotorId}
                onChange={(e) => setSelectedMotorId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter motor ID"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  type="button" key={day}
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
              <label htmlFor="startTime" className="block text-sm font-medium mb-2">Start Time</label>
              <input
                type="time" id="startTime" value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-2">End Time</label>
              <input
                type="time" id="endTime" value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox" id="repeat"
              checked={repeat}
              onChange={(e) => setRepeat(e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <label htmlFor="repeat" className="ml-2 text-sm">Repeat weekly</label>
          </div>
          
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" variant="outline"
              onClick={() => { resetForm(); onOpenChange(false); }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMotorDialog;
