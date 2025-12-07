import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Analytics: React.FC = () => {
  const { history, darkMode } = useSmartHome();
  const [activeTab, setActiveTab] = useState<'temperature' | 'humidity' | 'light'>('temperature');

  const getStrokeColor = () => {
    if (activeTab === 'temperature') return '#f97316'; // Orange
    if (activeTab === 'humidity') return '#3b82f6'; // Blue
    return '#eab308'; // Yellow
  };

  const getFillColor = () => {
    if (activeTab === 'temperature') return 'rgba(249, 115, 22, 0.2)'; 
    if (activeTab === 'humidity') return 'rgba(59, 130, 246, 0.2)';
    return 'rgba(234, 179, 8, 0.2)';
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Real-Time Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Live data stream from sensor nodes.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-200 dark:bg-white/10 p-1 rounded-xl">
          {(['temperature', 'humidity', 'light'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Main Graph Card */}
      <div className="flex-1 min-h-[400px] w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
        
        <h3 className="text-lg font-semibold mb-6 capitalize text-gray-700 dark:text-gray-200 flex items-center gap-2">
          {activeTab} Trend
          <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </h3>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getStrokeColor()} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getStrokeColor()} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e5e7eb"} vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke={darkMode ? "#94a3b8" : "#6b7280"} 
                tick={{fontSize: 12}}
                tickMargin={10}
              />
              <YAxis 
                stroke={darkMode ? "#94a3b8" : "#6b7280"} 
                tick={{fontSize: 12}}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1e293b' : '#fff', 
                  borderColor: darkMode ? '#334155' : '#e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: darkMode ? '#fff' : '#000'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={activeTab} 
                stroke={getStrokeColor()} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={3}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
            <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-1">Max Recorded</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.max(...history.map(h => h[activeTab] || 0)).toFixed(1)}
            </p>
         </div>
         <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Min Recorded</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.min(...history.map(h => h[activeTab] || 0)).toFixed(1)}
            </p>
         </div>
         <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
            <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">Average</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {(history.reduce((acc, curr) => acc + (curr[activeTab] || 0), 0) / (history.length || 1)).toFixed(1)}
            </p>
         </div>
      </div>
    </div>
  );
};

export default Analytics;
