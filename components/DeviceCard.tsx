import React from 'react';
import { Device } from '../types';
import { Lightbulb, Fan, Lock, Unlock, Wind, Power, Sun } from 'lucide-react';
import { useSmartHome } from '../context/SmartHomeContext';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { toggleDevice, updateDeviceValue } = useSmartHome();

  const getIcon = () => {
    switch (device.type) {
      case 'light': return <Lightbulb size={24} className={device.isOn ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />;
      case 'fan': return <Fan size={24} className={device.isOn ? "text-blue-400 animate-[spin_3s_linear_infinite]" : "text-gray-400"} />;
      case 'ac': return <Wind size={24} className={device.isOn ? "text-cyan-400" : "text-gray-400"} />;
      case 'lock': return device.isOn ? <Lock size={24} className="text-red-400" /> : <Unlock size={24} className="text-green-400" />;
      default: return <Power />;
    }
  };

  const isLock = device.type === 'lock';

  return (
    <div className={`relative flex flex-col justify-between p-5 rounded-3xl transition-all duration-300 border backdrop-blur-sm
      ${device.isOn 
        ? 'bg-white dark:bg-slate-800/80 border-blue-500/30 dark:border-blue-500/30 shadow-lg shadow-blue-500/10' 
        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-90'
      }
    `}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl transition-colors ${device.isOn ? 'bg-gray-100 dark:bg-white/10' : 'bg-gray-200 dark:bg-white/5'}`}>
          {getIcon()}
        </div>
        
        {/* Connection Status Dot */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">{device.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{device.room}</p>
      </div>

      {/* Controls Area */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
             {isLock ? (device.isOn ? 'LOCKED' : 'UNLOCKED') : (device.isOn ? 'ON' : 'OFF')}
          </span>
          
          <button 
            onClick={() => toggleDevice(device.id)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${device.isOn ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${device.isOn ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Sliders for non-lock devices */}
        {!isLock && device.isOn && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
            {device.type === 'ac' ? (
              <div className="flex items-center justify-between">
                <button 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20"
                  onClick={() => updateDeviceValue(device.id, device.value - 1)}
                >-</button>
                <span className="font-mono font-bold text-lg">{device.value}°C</span>
                <button 
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20"
                  onClick={() => updateDeviceValue(device.id, device.value + 1)}
                >+</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                 <Sun size={14} className="text-gray-400" />
                 <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={device.value} 
                  onChange={(e) => updateDeviceValue(device.id, Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;