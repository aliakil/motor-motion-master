
import Layout from "@/components/Layout";
import { useMotors } from "@/context/MotorContext";
import ScheduleCard from "@/components/ScheduleCard";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const Schedule = () => {
  const { motors } = useMotors();
  
  // Collect all schedules across all motors
  const allSchedules = motors.flatMap(motor => 
    motor.schedules.map(schedule => ({
      ...schedule,
      motorName: motor.name
    }))
  );
  
  // Group schedules by day for better organization
  const schedulesByDay: Record<string, typeof allSchedules> = {};
  
  allSchedules.forEach(schedule => {
    schedule.days.forEach(day => {
      if (!schedulesByDay[day]) {
        schedulesByDay[day] = [];
      }
      schedulesByDay[day].push(schedule);
    });
  });
  
  // Sort days in week order
  const daysOrder = [
    "Monday", "Tuesday", "Wednesday", 
    "Thursday", "Friday", "Saturday", "Sunday"
  ];
  
  return (
    <Layout title="Schedule">
      {allSchedules.length > 0 ? (
        <div>
          {daysOrder.filter(day => schedulesByDay[day]?.length > 0).map(day => (
            <div key={day} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{day}</h2>
              {schedulesByDay[day].map(schedule => (
                <ScheduleCard 
                  key={schedule.id} 
                  schedule={schedule}
                  motorName={schedule.motorName}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No schedules found</p>
          <p className="text-sm text-gray-400">
            Add schedules to your motors to see them here
          </p>
        </div>
      )}
      
      <div className="fixed bottom-20 right-5">
        <Link
          to="/motors"
          className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg text-white"
          aria-label="Add schedule"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </Layout>
  );
};

export default Schedule;
