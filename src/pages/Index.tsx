
import { useMotors } from "@/context/MotorContext";
import Layout from "@/components/Layout";
import SystemStatusCard from "@/components/SystemStatusCard";
import MotorCard from "@/components/MotorCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { motors } = useMotors();
  // Show only the first 4 motors on dashboard in a 2x2 grid
  const displayMotors = motors.slice(0, 4);
  
  return (
    <Layout>
      <SystemStatusCard />
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Motor Controls</h2>
        <Link to="/motors" className="text-primary">View All</Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {displayMotors.map(motor => (
          <MotorCard key={motor.id} motor={motor} compact={true} />
        ))}
      </div>
      
      <div className="fixed bottom-20 right-5">
        <Link
          to="/motors"
          className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg text-white"
          aria-label="Add motor"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
