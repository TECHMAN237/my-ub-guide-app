"""Write the new DrawerMenu.tsx (taste-direction redesign)."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
OUT = os.path.join(APP, 'src', 'components', 'layout', 'DrawerMenu.tsx')

# Use a raw triple-quoted string; the JSX content must not contain ''' or \''
JSX = r'''import React from 'react';
import {
  X,
  Compass,
  FileCheck2,
  Calendar,
  CreditCard,
  Building2,
  BookOpen,
  Bookmark,
  History,
  Settings,
  HelpCircle,
  Shield,
  Layers,
  Database,
  RefreshCw,
  Sliders,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const {
    navigateTo,
    userProfile,
    userCategory,
    switchCategory,
    simulateAiFailure,
    setSimulateAiFailure,
    resetAllData,
  } = useApp();

  if (!isOpen) return null;

  const handleNav = (route: string) => {
    onClose();
    navigateTo(route);
  };

  const profileInitial = userProfile?.name?.charAt(0) || 'U';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="w-full max-w-xs bg-surface border-l border-ink shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink/10 bg-raised">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {profileInitial}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-ink leading-tight">
                {userProfile?.name || 'Guest User'}
              </h3>
              <span className="text-[11px] font-medium text-muted capitalize">
                {userCategory === 'enrolled' ? 'Enrolled Student' : 'Prospective Student'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Category Quick Switch */}
        <div className="p-3 border-b border-ink/10 bg-accent-soft">
          <div className="text-[11px] font-semibold text-accent mb-1.5 flex items-center justify-between">
            <span>ACTIVE USER MODE</span>
            <button
              type="button"
              onClick={() => switchCategory(userCategory === 'prospective' ? 'enrolled' : 'prospective')}
              className="text-xs font-bold text-accent underline hover:text-ink transition-colors"
            >
              Switch to {userCategory === 'prospective' ? 'Enrolled' : 'Prospective'}
            </button>
          </div>
          <p className="text-[11px] text-muted">
            {userCategory === 'enrolled'
              ? 'Showing personalized academic regulations, course registration, & credit guides.'
              : 'Showing program discovery, admission checklist, & fee prospectus.'}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1">
          <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 py-1">
            Academic & Orientation
          </div>

          {[
            { route: '/programs', icon: Compass, label: 'Explore Programs' },
            { route: '/program-comparison', icon: Layers, label: 'Program Comparison' },
            { route: '/admissions', icon: FileCheck2, label: 'Admission Guide & Checklist' },
            { route: '/fees', icon: CreditCard, label: 'School Fees Guide' },
            { route: '/academic-calendar', icon: Calendar, label: 'Academic Calendar' },
            { route: '/departments', icon: Building2, label: 'Faculties & Departments' },
            { route: '/resources', icon: BookOpen, label: 'Student Resources & Handbooks' },
          ].map(({ route, icon: Icon, label }) => (
            <button
              key={route}
              type="button"
              onClick={() => handleNav(route)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink hover:bg-accent-soft hover:text-accent rounded-xl font-medium transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-muted" />
              <span>{label}</span>
            </button>
          ))}

          <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 pt-3 pb-1 mt-1">
            Personal & History
          </div>

          {[
            { route: '/saved', icon: Bookmark, label: 'Saved Items & Answers' },
            { route: '/history', icon: History, label: 'Conversation History' },
            { route: '/profile', icon: Settings, label: 'Profile & Settings' },
          ].map(({ route, icon: Icon, label }) => (
            <button
              key={route}
              type="button"
              onClick={() => handleNav(route)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink hover:bg-accent-soft hover:text-accent rounded-xl font-medium transition-colors text-left"
            >
              <Icon className="w-4 h-4 text-muted" />
              <span>{label}</span>
            </button>
          ))}

          <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 pt-3 pb-1 mt-1">
            Tools & Administration
          </div>

          <button
            type="button"
            onClick={() => handleNav('/admin')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-ink hover:bg-accent-soft hover:text-accent rounded-xl font-medium transition-colors text-left"
          >
            <Database className="w-4 h-4 text-muted" />
            <span>Demo Content Manager</span>
          </button>

          {/* AI Failure Simulation toggle for Journey C */}
          <div className="px-3 py-2 flex items-center justify-between text-xs text-muted bg-surface rounded-xl mt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-muted" />
              Simulate AI Failure:
            </span>
            <button
              type="button"
              onClick={() => setSimulateAiFailure(!simulateAiFailure)}
              className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors ${
                simulateAiFailure ? 'bg-negative text-white' : 'bg-surface text-ink'
              }`}
            >
              {simulateAiFailure ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer info & Reset */}
      <div className="p-3 border-t border-ink/10 bg-raised text-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleNav('/help')}
            className="flex items-center gap-1 hover:text-accent transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('/about')}
            className="hover:text-accent transition-colors"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('/privacy')}
            className="flex items-center gap-1 hover:text-accent transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all demo data and restore defaults?')) {
              resetAllData();
            }
          }}
          className="w-full text-center text-red-600 hover:text-red-700 py-1 font-semibold flex items-center justify-center gap-1 text-[11px]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};

export const Layers = React.memo(({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
));
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
