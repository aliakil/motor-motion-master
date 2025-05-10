
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! Page not found</p>
        <p className="text-gray-500 mb-10">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/" className="flex items-center bg-primary text-white px-6 py-3 rounded-lg">
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
