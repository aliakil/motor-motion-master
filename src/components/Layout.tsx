
import { ReactNode } from "react";
import Header from "./Header";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title,
  hasHeader = true, 
  hasFooter = true 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {hasHeader && <Header title={title} />}
      
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>
      
      {hasFooter && <Navigation />}
    </div>
  );
};

export default Layout;
