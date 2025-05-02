
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMotors } from "@/context/MotorContext";
import Layout from "@/components/Layout";
import ScheduleCard from "@/components/ScheduleCard";
import AddScheduleForm from "@/components/AddScheduleForm";
import { ChevronLeft, Plus } from "lucide-react";

const MotorSchedule = () => {
  const { motorId } = useParams<{ motorId: string }>();
  const { motors } = useMotors();
  const navigate = useNavigate();
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  
  if (!motorId) {
    navigate("/motors");
    return null;
  }
  
  const motor = motors.find(m => m.id === motorId);
  
  if (!motor) {
    navigate("/motors");
    return null;
  }
  
  return (
    <Layout title="Motor Schedule">
      <div className="mb-4 flex items-center">
        <button 
          onClick={() => navigate("/motors")} 
          className="mr-4"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold">{motor.name} - {motor.zone}</h1>
      </div>
      
      {!isAddingSchedule && (
        <button
          onClick={() => setIsAddingSchedule(true)}
          className="w-full py-3 bg-primary text-white rounded-lg mb-6 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Schedule
        </button>
      )}
      
      {isAddingSchedule ? (
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-4">New Schedule</h2>
          <AddScheduleForm 
            motor={motor}
            onClose={() => setIsAddingSchedule(false)}
          />
        </div>
      ) : motor.schedules.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold mb-3">Current Schedules</h2>
          {motor.schedules.map(schedule => (
            <ScheduleCard 
              key={schedule.id} 
              schedule={schedule}
              motorName={motor.name}
            />
          ))}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No schedules found for this motor</p>
          <p className="text-sm text-gray-400 mt-2">
            Add a schedule using the button above
          </p>
        </div>
      )}
    </Layout>
  );
};

export default MotorSchedule;
