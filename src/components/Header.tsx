
import { Bell, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  const isHomePage = location.pathname === "/";
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-center justify-between p-4">
        {isHomePage ? (
          <div className="text-primary font-bold text-2xl italic">
            <span>logo</span>
          </div>
        ) : (
          <h1 className="text-xl font-semibold">{title}</h1>
        )}
        
        <div className="flex items-center space-x-4">
          <button aria-label="Notifications">
            <Bell className="h-6 w-6" />
          </button>
          <button aria-label="Settings">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {isHomePage && (
        <div className="px-4 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Irrigation Control</h1>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      )}
    </header>
  );
};

export default Header;
