import React, { useState } from 'react';
import { SmartHomeProvider } from './context/SmartHomeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Automations from './pages/Automations';
import DeviceDetails from './pages/DeviceDetails';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'analytics': return <Analytics />;
      case 'automations': return <Automations />;
      case 'settings': return <DeviceDetails />;
      default: return <Dashboard />;
    }
  };

  return (
    <SmartHomeProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </SmartHomeProvider>
  );
};

export default App;
