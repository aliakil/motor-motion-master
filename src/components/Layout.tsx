
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import MqttStatus from './MqttStatus';
import { useMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const isMobile = useMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Navigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto px-5 py-6">
          <div className={isMobile ? '' : 'max-w-5xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>
      
      {/* MQTT Status Panel */}
      <MqttStatus />
    </div>
  );
};

export default Layout;
