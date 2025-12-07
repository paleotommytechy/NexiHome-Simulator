import React from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DeviceDetails: React.FC = () => {
  const { devices } = useSmartHome();

  // Mock Event Log
  const events = [
    { id: 1, time: '10:42 AM', device: 'Living Room Lights', action: 'Turned ON', type: 'info' },
    { id: 2, time: '09:15 AM', device: 'Front Door Lock', action: 'Unlocked manually', type: 'warn' },
    { id: 3, time: '07:30 AM', device: 'Coffee Maker', action: 'Scheduled Start', type: 'success' },
    { id: 4, time: '06:00 AM', device: 'Garden Sprinkler', action: 'Turned OFF', type: 'info' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Details</h2>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Device List Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
             <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h3 className="font-semibold text-lg">Connected Devices</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                  <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Device Name</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Connectivity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {devices.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{d.name}</td>
                        <td className="px-6 py-4">{d.room}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.isOn ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {d.isOn ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${d.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                             <span>{d.isOnline ? 'Online' : 'Offline'}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
             <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
             <div className="space-y-6">
                {events.map((e, index) => (
                  <div key={e.id} className="relative pl-6 border-l border-gray-200 dark:border-gray-700 last:border-0">
                     <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        e.type === 'info' ? 'bg-blue-500' : e.type === 'warn' ? 'bg-orange-500' : 'bg-green-500'
                     }`}></div>
                     <div className="mb-1 text-xs text-gray-400 font-mono flex items-center gap-1">
                        <Clock size={12} /> {e.time}
                     </div>
                     <p className="text-sm font-medium text-gray-900 dark:text-white">{e.device}</p>
                     <p className="text-xs text-gray-500">{e.action}</p>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2 text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium border border-blue-200 dark:border-blue-500/20 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
               View Full Logs
             </button>
          </div>

       </div>
    </div>
  );
};

export default DeviceDetails;
