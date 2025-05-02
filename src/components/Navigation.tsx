
import { Link, useLocation } from "react-router-dom";
import { Calendar, LayoutDashboard, Power } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center py-3 px-5 ${location.pathname === '/' ? 'text-primary' : 'text-gray-500'}`}
        >
          <LayoutDashboard className="nav-icon" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link 
          to="/motors" 
          className={`flex flex-col items-center py-3 px-5 ${location.pathname === '/motors' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Power className="nav-icon" />
          <span className="text-xs mt-1">Motors</span>
        </Link>
        
        <Link 
          to="/schedule" 
          className={`flex flex-col items-center py-3 px-5 ${location.pathname === '/schedule' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Calendar className="nav-icon" />
          <span className="text-xs mt-1">Schedule</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
