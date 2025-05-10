
import { useState, useEffect } from "react";
import { useMqtt } from "@/context/MqttContext";

const MAX_LOG_ENTRIES = 5;

interface LogEntry {
  id: number;
  message: string;
  timestamp: Date;
}

const MqttStatus = () => {
  const [mqttLogs, setMqttLogs] = useState<LogEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    // Override console.log to capture MQTT logs
    const originalConsoleLog = console.log;
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      // Only capture MQTT logs
      const message = args.join(' ');
      if (message.includes('[MQTT]')) {
        setMqttLogs(prev => {
          const newLogs = [
            {
              id: Date.now(),
              message,
              timestamp: new Date()
            },
            ...prev
          ].slice(0, MAX_LOG_ENTRIES);
          
          return newLogs;
        });
      }
    };
    
    // Restore original console.log on unmount
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);
  
  // No logs to display
  if (mqttLogs.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        style={{ width: expanded ? '400px' : 'auto' }}
      >
        <div 
          className="bg-purple-600 text-white px-4 py-2 flex justify-between items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="font-medium">MQTT Status</h3>
          <span>{expanded ? '−' : '+'}</span>
        </div>
        
        {expanded && (
          <div className="p-3 max-h-48 overflow-y-auto">
            {mqttLogs.map(log => (
              <div key={log.id} className="mb-2 text-sm">
                <span className="text-xs text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <p className="font-mono">{log.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MqttStatus;
