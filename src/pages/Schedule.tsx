
import Layout from "@/components/Layout";
import { useMotors } from "@/context/MotorContext";
import ScheduleCard from "@/components/ScheduleCard";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const Schedule = () => {
  const { motors } = useMotors();
  
  // Show all schedules for all motors
  const allSchedules = motors.flatMap(motor => 
    motor.schedules.map(schedule => ({
      ...schedule,
      motorName: motor.name,
      motorZone: motor.zone  // Add zone info for better display
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
        <div className="space-y-4">
          {daysOrder.filter(day => schedulesByDay[day]?.length > 0).map(day => (
            <div key={day} className="mb-4">
              <h2 className="text-lg font-semibold mb-3 flex items-center bg-purple-100 p-3 rounded-lg text-purple-700">
                <Calendar className="h-5 w-5 mr-2" />
                {day}
              </h2>
              <div className="space-y-3 pl-2">
                {schedulesByDay[day].map(schedule => (
                  <ScheduleCard 
                    key={schedule.id} 
                    schedule={schedule}
                    motorName={schedule.motorName}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Calendar className="h-10 w-10 text-purple-600" />
          </div>
          <p className="text-gray-700 font-medium mb-2">No schedules found</p>
          <p className="text-sm text-gray-500 mb-6 text-center px-6">
            Add schedules to your motors to automate your irrigation system
          </p>
          <Link
            to="/motors"
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg flex items-center"
          >
            Add Schedule
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Schedule;
