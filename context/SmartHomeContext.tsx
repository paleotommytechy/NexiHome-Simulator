import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Device, Sensor, HistoryDataPoint, AutomationRule } from '../types';

interface SmartHomeContextType {
  devices: Device[];
  sensors: Sensor[];
  history: HistoryDataPoint[];
  automations: AutomationRule[];
  toggleDevice: (id: string) => void;
  updateDeviceValue: (id: string, value: number) => void;
  addAutomation: (rule: AutomationRule) => void;
  deleteAutomation: (id: string) => void;
  toggleAutomation: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_DEVICES: Device[] = [
  { id: 'd1', name: 'Living Room Lights', type: 'light', isOn: true, value: 80, room: 'Living Room', isOnline: true },
  { id: 'd2', name: 'Kitchen Fan', type: 'fan', isOn: false, value: 2, room: 'Kitchen', isOnline: true },
  { id: 'd3', name: 'Master Bedroom AC', type: 'ac', isOn: true, value: 22, room: 'Bedroom', isOnline: true },
  { id: 'd4', name: 'Front Door Lock', type: 'lock', isOn: true, value: 0, room: 'Entrance', isOnline: true },
  { id: 'd5', name: 'Office Lights', type: 'light', isOn: false, value: 50, room: 'Office', isOnline: false },
];

const INITIAL_SENSORS: Sensor[] = [
  { id: 's1', name: 'Main Thermostat', type: 'temperature', value: 24, unit: '°C', trend: 'stable' },
  { id: 's2', name: 'Living Room Humidity', type: 'humidity', value: 45, unit: '%', trend: 'stable' },
  { id: 's3', name: 'Outdoor LDR', type: 'light', value: 850, unit: 'lux', trend: 'stable' },
];

export const SmartHomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([
    { id: 'a1', name: 'Night Mode', sensorId: 's3', condition: 'lt', threshold: 100, actionDeviceId: 'd1', actionType: 'turnOn', active: true }
  ]);
  const [darkMode, setDarkMode] = useState(true);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Device Control Actions
  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d));
  };

  const updateDeviceValue = (id: string, value: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, value } : d));
  };

  const addAutomation = (rule: AutomationRule) => {
    setAutomations(prev => [...prev, rule]);
  };

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Sensors with random micro-fluctuations
      setSensors(prevSensors => {
        return prevSensors.map(sensor => {
          const change = (Math.random() - 0.5) * (sensor.type === 'light' ? 20 : 0.5);
          let newValue = Number((sensor.value + change).toFixed(1));
          
          // Clamping realistic values
          if (sensor.type === 'humidity') newValue = Math.min(100, Math.max(0, newValue));
          if (sensor.type === 'light') newValue = Math.max(0, newValue);

          return {
            ...sensor,
            value: newValue,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
          };
        });
      });

      // 2. Add to History
      setHistory(prev => {
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        
        // Use current sensor values from state (using closure trap workaround by reading from callback args is tricky with multiple state, 
        // effectively we are using the 'prevSensors' equivalent logic implicitly if we accessed it, but here we just grab the latest 'sensors' 
        // in a real app, but for simplicity we will simulate the same math here or use a ref)
        // Simplified: generating consistent data for the graph based on the previous step's logic is hard without refs.
        // Let's just generate a new point based on the last point in history or initial if empty.
        
        const lastPoint = prev[prev.length - 1] || { temperature: 24, humidity: 45, light: 850 };
        
        const newPoint = {
          time: timeStr,
          temperature: Number((lastPoint.temperature + (Math.random() - 0.5) * 0.5).toFixed(1)),
          humidity: Number((lastPoint.humidity + (Math.random() - 0.5) * 1).toFixed(1)),
          light: Math.max(0, Number((lastPoint.light + (Math.random() - 0.5) * 10).toFixed(0))),
        };

        const newHistory = [...prev, newPoint];
        if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
        return newHistory;
      });

    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Automation Check Loop
  useEffect(() => {
    // Check rules against current sensor values (simplified)
    // In a real app, this would happen when sensors update.
    sensors.forEach(sensor => {
      automations.forEach(rule => {
        if (!rule.active || rule.sensorId !== sensor.id) return;

        const triggered = rule.condition === 'gt' 
          ? sensor.value > rule.threshold 
          : sensor.value < rule.threshold;

        if (triggered) {
          // Find device
          const device = devices.find(d => d.id === rule.actionDeviceId);
          if (device) {
             const shouldBeOn = rule.actionType === 'turnOn';
             if (device.isOn !== shouldBeOn) {
               toggleDevice(device.id);
             }
          }
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensors, automations]); // Intentionally not including devices to avoid infinite loops if logic is flawed, but strictly this is a side effect.

  return (
    <SmartHomeContext.Provider value={{ 
      devices, sensors, history, automations, 
      toggleDevice, updateDeviceValue, addAutomation, deleteAutomation, toggleAutomation,
      darkMode, toggleDarkMode
    }}>
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
};