
import Layout from "@/components/Layout";
import { useMotors } from "@/context/MotorContext";
import ScheduleCard from "@/components/ScheduleCard";
import { Link } from "react-router-dom";

const Schedule = () => {
  const { motors } = useMotors();
  
  // Show all schedules for all motors, not just motor 1
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
        <div className="space-y-6">
          {daysOrder.filter(day => schedulesByDay[day]?.length > 0).map(day => (
            <div key={day} className="mb-6">
              <h2 className="text-lg font-semibold mb-3 bg-primary/10 p-2 rounded-lg">{day}</h2>
              <div className="space-y-3">
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
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No schedules found</p>
          <p className="text-sm text-gray-400">
            Add schedules to your motors to see them here
          </p>
          <Link
            to="/motors"
            className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add Schedule
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Schedule;
