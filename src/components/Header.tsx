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
  return;
};
export default Header;