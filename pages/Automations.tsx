import React, { useState } from 'react';
import { useSmartHome } from '../context/SmartHomeContext';
import { AutomationRule } from '../types';
import { Trash2, Plus, ArrowRight, Activity, Power } from 'lucide-react';

const Automations: React.FC = () => {
  const { automations, sensors, devices, addAutomation, deleteAutomation, toggleAutomation } = useSmartHome();
  const [isAdding, setIsAdding] = useState(false);

  // New Rule State
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    sensorId: sensors[0]?.id,
    condition: 'lt',
    threshold: 20,
    actionDeviceId: devices[0]?.id,
    actionType: 'turnOn'
  });

  const handleSave = () => {
    if (newRule.name && newRule.sensorId && newRule.actionDeviceId) {
      addAutomation({
        id: Math.random().toString(36).substr(2, 9),
        active: true,
        ...newRule as AutomationRule
      });
      setIsAdding(false);
      setNewRule({ ...newRule, name: '' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Automation Rules</h2>
           <p className="text-gray-500 text-sm">Create "If This Then That" logic for your home.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">New Rule</span>
        </button>
      </div>

      {/* Visual Rule Builder */}
      {isAdding && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl mb-8 animate-slide-down">
          <h3 className="font-semibold text-lg mb-6">Configure Logic</h3>
          
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
            
            {/* IF Block */}
            <div className="flex-1 w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 relative group">
              <span className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">IF</span>
              <div className="space-y-3">
                <select 
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none py-1"
                  value={newRule.sensorId}
                  onChange={(e) => setNewRule({...newRule, sensorId: e.target.value})}
                >
                  {sensors.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
                </select>
                <div className="flex gap-2">
                   <select 
                    className="bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none py-1"
                    value={newRule.condition}
                    onChange={(e) => setNewRule({...newRule, condition: e.target.value as 'gt' | 'lt'})}
                   >
                     <option value="lt" className="text-black">Less Than (&lt;)</option>
                     <option value="gt" className="text-black">Greater Than (&gt;)</option>
                   </select>
                   <input 
                    type="number" 
                    className="w-20 bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none py-1"
                    value={newRule.threshold}
                    onChange={(e) => setNewRule({...newRule, threshold: Number(e.target.value)})}
                   />
                </div>
              </div>
            </div>

            <ArrowRight className="text-gray-400 transform rotate-90 lg:rotate-0" />

            {/* THEN Block */}
            <div className="flex-1 w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 relative">
              <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">THEN</span>
              <div className="space-y-3">
                 <select 
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-green-500 outline-none py-1"
                  value={newRule.actionDeviceId}
                  onChange={(e) => setNewRule({...newRule, actionDeviceId: e.target.value})}
                >
                  {devices.map(d => <option key={d.id} value={d.id} className="text-black">{d.name}</option>)}
                </select>
                <select 
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none py-1"
                  value={newRule.actionType}
                  onChange={(e) => setNewRule({...newRule, actionType: e.target.value as 'turnOn' | 'turnOff'})}
                >
                   <option value="turnOn" className="text-black">Turn ON / Open</option>
                   <option value="turnOff" className="text-black">Turn OFF / Close</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
             <input 
              type="text" 
              placeholder="Rule Name (e.g. Night Mode)" 
              className="flex-1 bg-gray-100 dark:bg-black/20 rounded-lg px-4 py-2 outline-none w-full"
              value={newRule.name}
              onChange={(e) => setNewRule({...newRule, name: e.target.value})}
             />
             <div className="flex gap-2 w-full sm:w-auto">
               <button onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5">Cancel</button>
               <button onClick={handleSave} className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-500/30">Save Rule</button>
             </div>
          </div>
        </div>
      )}

      {/* Rule List */}
      <div className="grid gap-4">
        {automations.map(rule => {
          const sName = sensors.find(s => s.id === rule.sensorId)?.name || 'Unknown Sensor';
          const dName = devices.find(d => d.id === rule.actionDeviceId)?.name || 'Unknown Device';

          return (
            <div key={rule.id} className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border transition-all hover:shadow-lg ${rule.active ? 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10' : 'bg-gray-50 dark:bg-transparent border-transparent opacity-60'}`}>
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div onClick={() => toggleAutomation(rule.id)} className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${rule.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                   <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <div>
                   <h4 className="font-bold text-gray-900 dark:text-white">{rule.name}</h4>
                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Activity size={14} /> If {sName} {rule.condition === 'gt' ? '>' : '<'} {rule.threshold}</span>
                      <ArrowRight size={14} />
                      <span className="flex items-center gap-1"><Power size={14} /> {rule.actionType === 'turnOn' ? 'Turn On' : 'Turn Off'} {dName}</span>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => deleteAutomation(rule.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-auto"
              >
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
        
        {automations.length === 0 && (
           <div className="text-center py-12 text-gray-400">
             <p>No automation rules configured.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Automations;
