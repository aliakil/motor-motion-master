
import { Bell, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  title
}) => {
  const location = useLocation();
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  const isHomePage = location.pathname === "/";
  
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">{title || (isHomePage ? 'Dashboard' : '')}</h1>
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
      <div className="flex space-x-4">
        <button aria-label="Notifications" className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <button aria-label="Settings" className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
