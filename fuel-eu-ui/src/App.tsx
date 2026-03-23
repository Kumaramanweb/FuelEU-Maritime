import { useState } from 'react';
import { LayoutDashboard, GitCompare, Landmark, Users } from 'lucide-react';
import { RoutesTab } from './adapters/ui/Tabs/RoutesTab';
import { CompareTab } from './adapters/ui/Tabs/CompareTab';
import { BankingTab } from './adapters/ui/Tabs/BankingTab';
import { PoolingTab } from './adapters/ui/Tabs/PoolingTab';


function App() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <header className="bg-neutral-950 border-b border-neutral-800 p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
            Fuel EU Compliance Dashboard
          </h1>
          <div className="flex gap-2 bg-neutral-800 p-1 rounded-lg">
            {[
              { id: 'routes', label: 'Routes', icon: LayoutDashboard },
              { id: 'compare', label: 'Compare', icon: GitCompare },
              { id: 'banking', label: 'Banking', icon: Landmark },
              { id: 'pooling', label: 'Pooling', icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${activeTab === tab.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                  }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-6">
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'banking' && <BankingTab />}
        {activeTab === 'pooling' && <PoolingTab />}
      </main>
    </div>
  );
}

export default App;
