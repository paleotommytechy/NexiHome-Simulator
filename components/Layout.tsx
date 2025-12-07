import React from 'react';
import { LayoutDashboard, Activity, Zap, Menu, Moon, Sun, Settings } from 'lucide-react';
import { useSmartHome } from '../context/SmartHomeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { darkMode, toggleDarkMode } = useSmartHome();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'automations', label: 'Auto', icon: Zap },
    { id: 'settings', label: 'Details', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-gray-100 dark:bg-[#0f172a] text-gray-900 dark:text-white overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">NexiHome Simulator</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-blue-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/5">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium">Theme</span>
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5 z-30 px-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Zap className="text-white w-4 h-4" fill="currentColor" />
            </div>
            <span className="font-bold text-lg">NexiHome Simulator</span>
         </div>
         <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
         </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto pt-20 pb-24 md:pt-8 md:pb-8 px-4 md:px-8 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-safe z-30">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-blue-500/10' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;