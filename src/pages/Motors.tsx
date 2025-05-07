
import { useState } from "react";
import { useMotors } from "@/context/MotorContext";
import Layout from "@/components/Layout";
import MotorCard from "@/components/MotorCard";
import { Search } from "lucide-react";
import AddMotorDialog from "@/components/AddMotorDialog";

const Motors = () => {
  const { motors } = useMotors();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddMotorOpen, setIsAddMotorOpen] = useState(false);
  
  const filterMotors = () => {
    let filtered = motors;
    
    if (searchTerm) {
      filtered = filtered.filter(motor => 
        motor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        motor.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === "running") {
      filtered = filtered.filter(motor => motor.status === "Running");
    } else if (filter === "stopped") {
      filtered = filtered.filter(motor => motor.status === "Stopped");
    } else if (filter === "maintenance") {
      filtered = filtered.filter(motor => motor.status === "Maintenance");
    }
    
    return filtered;
  };
  
  const filteredMotors = filterMotors();
  
  return (
    <Layout title="Motors">
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search motors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === "all" 
                ? 'bg-primary text-white' 
                : 'border border-gray-300 text-gray-700'
            }`}
          >
            All Motors
          </button>
          <button
            onClick={() => setFilter("running")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === "running" 
                ? 'bg-primary text-white' 
                : 'border border-gray-300 text-gray-700'
            }`}
          >
            Running
          </button>
          <button
            onClick={() => setFilter("stopped")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === "stopped" 
                ? 'bg-primary text-white' 
                : 'border border-gray-300 text-gray-700'
            }`}
          >
            Stopped
          </button>
          <button
            onClick={() => setFilter("maintenance")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === "maintenance" 
                ? 'bg-primary text-white' 
                : 'border border-gray-300 text-gray-700'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>
      
      {filteredMotors.length > 0 ? (
        <div className="space-y-4">
          {filteredMotors.map(motor => (
            <MotorCard key={motor.id} motor={motor} showScheduleButton />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No motors found matching your criteria
        </div>
      )}
      
      <div className="fixed bottom-20 left-0 right-0 flex justify-center">
        <button
          onClick={() => setIsAddMotorOpen(true)}
          className="px-6 py-2 bg-primary rounded-full shadow-lg text-white"
          aria-label="Add motor"
        >
          Add New Motor
        </button>
      </div>
      
      <AddMotorDialog open={isAddMotorOpen} onOpenChange={setIsAddMotorOpen} />
    </Layout>
  );
};

export default Motors;
