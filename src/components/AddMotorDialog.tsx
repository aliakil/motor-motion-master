
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { useMotors } from "@/context/MotorContext";

interface AddMotorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMotorDialog: React.FC<AddMotorDialogProps> = ({ open, onOpenChange }) => {
  const { addMotor } = useMotors();
  const [name, setName] = useState("Motor");
  const [zone, setZone] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !zone) {
      alert("Please fill in all fields");
      return;
    }
    
    addMotor({
      name,
      zone,
      status: "Stopped",
      flowRate: 0,
      operatingHours: 0,
      maintenance: "Good",
      waterPressure: 0,
      isOn: false
    });
    
    setName("Motor");
    setZone("");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Motor</h2>
            
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
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary text-white rounded"
                >
                  Add Motor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddMotorDialog;
