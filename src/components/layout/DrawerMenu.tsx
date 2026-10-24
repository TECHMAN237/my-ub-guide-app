import React from 'react';
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
  UserCheck
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
    resetAllData
  } = useApp();

  if (!isOpen) return null;

  const handleNav = (route: string) => {
    onClose();
    navigateTo(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div>
          <div className="p-4 border-b border-[#E1E8F2] flex items-center justify-between bg-[#F6F8FC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#102A56] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#17233B] leading-tight">
                  {userProfile?.name || 'Guest User'}
                </h3>
                <span className="text-[11px] font-medium text-slate-500 capitalize">
                  {userCategory === 'enrolled' ? 'Enrolled Student' : 'Prospective Student'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Category Quick Switch */}
          <div className="p-3 bg-[#EEF5FF] border-b border-[#E1E8F2]">
            <div className="text-[11px] font-semibold text-[#1463F3] mb-1.5 flex items-center justify-between">
              <span>ACTIVE USER MODE:</span>
              <button
                type="button"
                onClick={() => switchCategory(userCategory === 'prospective' ? 'enrolled' : 'prospective')}
                className="text-xs font-bold text-[#1463F3] underline hover:text-[#102A56]"
              >
                Switch to {userCategory === 'prospective' ? 'Enrolled' : 'Prospective'}
              </button>
            </div>
            <p className="text-[11px] text-slate-600">
              {userCategory === 'enrolled'
                ? 'Showing personalized academic regulations, course registration, & credit guides.'
                : 'Showing program discovery, admission checklist, & fee prospectus.'}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Academic & Orientation
            </div>

            <button
              type="button"
              onClick={() => handleNav('/programs')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Explore Programs</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/program-comparison')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Program Comparison</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/admissions')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <FileCheck2 className="w-4 h-4 text-slate-400" />
              <span>Admission Guide & Checklist</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/fees')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>School Fees Guide</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/academic-calendar')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Academic Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/departments')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Faculties & Departments</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/resources')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Student Resources & Handbooks</span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">
              Personal & History
            </div>

            <button
              type="button"
              onClick={() => handleNav('/saved')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Saved Items & Answers</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/history')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Conversation History</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/profile')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Profile & Settings</span>
            </button>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">
              Tools & Administration
            </div>

            <button
              type="button"
              onClick={() => handleNav('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-[#F6F8FC] hover:text-[#1463F3] rounded-xl font-medium transition-colors text-left"
            >
              <Database className="w-4 h-4 text-slate-400" />
              <span>Demo Content Manager</span>
            </button>

            {/* AI Failure Simulation toggle for Journey C */}
            <div className="px-3 py-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-xl mt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Simulate AI Failure:
              </span>
              <button
                type="button"
                onClick={() => setSimulateAiFailure(!simulateAiFailure)}
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-colors ${
                  simulateAiFailure ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {simulateAiFailure ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info & Reset */}
        <div className="p-3 border-t border-[#E1E8F2] bg-[#F6F8FC] text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => handleNav('/help')}
              className="hover:text-[#1463F3] flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('/about')}
              className="hover:text-[#1463F3]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNav('/privacy')}
              className="hover:text-[#1463F3] flex items-center gap-1"
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
    </div>
  );
};
