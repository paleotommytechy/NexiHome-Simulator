import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import DeviceCard from '../components/DeviceCard';
import SensorCard from '../components/SensorCard';

const Dashboard: React.FC = () => {
  const { devices, sensors } = useSmartHome();

  const lights = devices.filter(d => d.type === 'light');
  const climate = devices.filter(d => d.type === 'ac' || d.type === 'fan');
  const security = devices.filter(d => d.type === 'lock');

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Home</h2>
        <p className="text-gray-500 dark:text-gray-400">System Status: <span className="text-green-500 font-medium">All Systems Operational</span></p>
      </header>

      {/* Sensors Row */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">Environment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map(sensor => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </section>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Lights & Climate */}
        <section>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">Ambience & Climate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...lights, ...climate].map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        {/* Security & Access */}
        <section>
           <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-1">Security</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {security.map(device => (
               <DeviceCard key={device.id} device={device} />
             ))}
             {/* Placeholder for camera or other security */}
             <div className="relative flex flex-col justify-center items-center p-5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center h-full min-h-[200px]">
                <span className="text-gray-400 text-sm">No Camera Feed Signal</span>
                <span className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Offline
                </span>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
