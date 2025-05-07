
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { useMotors, ScheduleDay } from "@/context/MotorContext";
import { Button } from "@/components/ui/button";

interface AddMotorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const daysOfWeek: ScheduleDay[] = [
  "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday", "Sunday"
];

const AddMotorDialog: React.FC<AddMotorDialogProps> = ({ open, onOpenChange }) => {
  const { addMotor, addSchedule } = useMotors();
  const [name, setName] = useState("Motor");
  const [zone, setZone] = useState("");
  const [includeSchedule, setIncludeSchedule] = useState(false);
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
    
    if (!name || !zone) {
      alert("Please fill in all fields");
      return;
    }
    
    if (includeSchedule && selectedDays.length === 0) {
      alert("Please select at least one day for the schedule");
      return;
    }
    
    const newMotor = {
      name,
      zone,
      status: "Stopped" as "Running" | "Stopped" | "Maintenance",
      flowRate: 0,
      operatingHours: 0,
      maintenance: "Good" as "Good" | "Needs Attention" | "Maintenance Required",
      humidity: 50, // Added the humidity property with a default value of 50%
      isOn: false
    };
    
    const motorId = addMotor(newMotor);
    
    if (includeSchedule) {
      addSchedule({
        motorId,
        days: selectedDays,
        startTime,
        endTime,
        repeat,
        active: true
      });
    }
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setName("Motor");
    setZone("");
    setIncludeSchedule(false);
    setSelectedDays([]);
    setStartTime("06:00");
    setEndTime("07:00");
    setRepeat(true);
  };
  
  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Motor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="motorName" className="block text-sm font-medium mb-2">
              Motor Name
            </label>
            <input
              type="text"
              id="motorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter motor name"
            />
          </div>
          
          <div>
            <label htmlFor="zone" className="block text-sm font-medium mb-2">
              Zone
            </label>
            <input
              type="text"
              id="zone"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter zone name"
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="includeSchedule"
                checked={includeSchedule}
                onChange={(e) => setIncludeSchedule(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="includeSchedule" className="ml-2 text-sm font-medium">
                Add a schedule for this motor
              </label>
            </div>
            
            {includeSchedule && (
              <div className="space-y-4 pl-6">
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
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
            >
              Add Motor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMotorDialog;
