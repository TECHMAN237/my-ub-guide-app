"""Write the new AdminView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'AdminView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, Database, RefreshCw, Users, FileText, Shield, Cog } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminView: React.FC = () => {
  const { goBack, resetAllData, simulateAiFailure, setSimulateAiFailure, navigateTo } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Admin Console</h1>
          <p className="text-xs text-muted">Demo content management and system controls.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigateTo('/programs')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-ink">Manage Programs</p>
          <p className="text-[11px] text-muted">Add / edit programme data</p>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/resources')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-ink">Manage Resources</p>
          <p className="text-[11px] text-muted">Add / edit resources</p>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/departments')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-ink">Manage Faculties</p>
          <p className="text-[11px] text-muted">Add / edit faculties</p>
        </button>
        <button
          type="button"
          onClick={() => navigateTo('/about')}
          className="bg-surface border border-ink/10 rounded-2xl p-4 text-left hover:border-accent transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-2">
            <Cog className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-ink">Settings</p>
          <p className="text-[11px] text-muted">Configure the app</p>
        </button>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider">Demo Controls</h2>
          <button
            type="button"
            onClick={() => resetAllData()}
            className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset demo data
          </button>
        </div>
        <p className="text-xs text-muted">Reset all demo data and restore the application to its initial state.</p>
      </div>

      <div className="bg-surface border border-ink/10 rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider">AI Failure Simulation</h2>
          <button
            type="button"
            onClick={() => setSimulateAiFailure(!simulateAiFailure)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${simulateAiFailure ? 'bg-red-500 text-white' : 'bg-raised text-ink hover:text-ink'}`}
            aria-label="Toggle AI failure simulation"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted">
          {simulateAiFailure
            ? 'AI responses are currently failing. Use this to test the application\'s error handling.'
            : 'AI responses are working normally. Use this to test the application\'s error handling.'}
        </p>
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
