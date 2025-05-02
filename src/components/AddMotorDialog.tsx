
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { useMotors } from "@/context/MotorContext";
import { Button } from "@/components/ui/button";

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
  
  const handleCancel = () => {
    setName("Motor");
    setZone("");
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
