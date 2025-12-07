export type DeviceType = 'light' | 'fan' | 'ac' | 'lock';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isOn: boolean;
  value: number; // Brightness, Speed, Target Temp
  room: string;
  isOnline: boolean;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'light';
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface HistoryDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  light: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  sensorId: string;
  condition: 'gt' | 'lt'; // greater than, less than
  threshold: number;
  actionDeviceId: string;
  actionType: 'turnOn' | 'turnOff';
  active: boolean;
}
