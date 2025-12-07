import React from 'react';
import { Sensor } from '../types';
import { Thermometer, Droplets, Sun, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SensorCardProps {
  sensor: Sensor;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor }) => {
  const getIcon = () => {
    switch (sensor.type) {
      case 'temperature': return <Thermometer className="text-orange-500" />;
      case 'humidity': return <Droplets className="text-blue-400" />;
      case 'light': return <Sun className="text-yellow-400" />;
      default: return <Thermometer />;
    }
  };

  const getTrendIcon = () => {
    switch (sensor.trend) {
      case 'up': return <TrendingUp size={16} className="text-green-400" />;
      case 'down': return <TrendingDown size={16} className="text-red-400" />;
      default: return <Minus size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5">
          {getIcon()}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-black/20 px-2 py-1 rounded-lg text-xs font-mono">
          {getTrendIcon()}
          <span className="opacity-70 uppercase tracking-wider">{sensor.trend}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{sensor.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{sensor.value}</span>
          <span className="text-sm font-semibold text-gray-400">{sensor.unit}</span>
        </div>
      </div>

      {/* Decorational Glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none
        ${sensor.type === 'temperature' ? 'bg-orange-500' : ''}
        ${sensor.type === 'humidity' ? 'bg-blue-500' : ''}
        ${sensor.type === 'light' ? 'bg-yellow-500' : ''}
      `}></div>
    </div>
  );
};

export default SensorCard;
