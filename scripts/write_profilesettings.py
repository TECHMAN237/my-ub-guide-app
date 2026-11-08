"""Write the new ProfileSettingsView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ProfileSettingsView.tsx'))

JSX = r'''import React, { useState } from 'react';
import {
  User,
  History,
  Bookmark,
  Bell,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Database,
  Edit3,
  Check,
  Shield,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileSettingsView: React.FC = () => {
  const {
    userProfile,
    userCategory,
    updateProfile,
    clearUserData,
    language,
    setLanguage,
    navigateTo,
    switchCategory,
    unreadNotificationCount
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || '');
  const [editEmail, setEditEmail] = useState(userProfile?.email || '');
  const [editFaculty, setEditFaculty] = useState(userProfile?.faculty || 'Faculty of Science');
  const [editDept, setEditDept] = useState(userProfile?.department || 'Computer Science');
  const [editLevel, setEditLevel] = useState(userProfile?.level || 'Level 100');

  const isEnrolled = userCategory === 'enrolled';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      faculty: editFaculty,
      department: editDept,
      level: editLevel
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {/* Profile Header Avatar & Identity */}
      <div className="bg-surface border border-ink/10 rounded-3xl p-6 text-center shadow-2xs mb-5">
        <div className="w-18 h-18 rounded-full bg-ink text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-xs">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>

        <h1 className="text-lg font-bold text-ink">
          {userProfile?.name || 'Ferdinand Tanyi'}
        </h1>
        <p className="text-xs text-muted mt-0.5">
          {isEnrolled
            ? `Enrolled Student • ${userProfile?.level || 'Level 100'} • ${userProfile?.department || 'Computer Science'}`
            : `Prospective Student • Interested in ${userProfile?.interestedStudyLevel || 'Undergraduate'} Programs`}
        </p>

        {/* Category Switch Badge Button */}
        <div className="mt-3 inline-flex items-center gap-2 bg-raised border border-ink/10 px-3 py-1 rounded-full text-xs">
          <span className="text-muted font-medium">Category:</span>
          <button
            type="button"
            onClick={() => switchCategory(isEnrolled ? 'prospective' : 'enrolled')}
            className="font-bold text-accent hover:underline cursor-pointer"
          >
            {isEnrolled ? 'Enrolled Student' : 'Prospective Student'} (Switch)
          </button>
        </div>
      </div>

      {/* Inline Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-surface border border-ink/10 rounded-3xl p-5 mb-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Edit Information</h2>
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-surface-border border border-ink/10 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-surface-border border border-ink/10 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-accent"
            />
          </div>
          {isEnrolled && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Academic Level</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full bg-surface-border border border-ink/10 rounded-xl px-2 py-2 text-xs focus:outline-hidden focus:border-accent"
                >
                  <option value="Level 100">Level 100</option>
                  <option value="Level 200">Level 200</option>
                  <option value="Level 300">Level 300</option>
                  <option value="Level 400">Level 400</option>
                  <option value="Level 500">Level 500</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full bg-surface-border border border-ink/10 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-accent"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-accent text-white font-semibold text-xs cursor-pointer hover:bg-accent-edge transition-colors shadow-xs"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-raised text-muted font-semibold text-xs cursor-pointer hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Menu Action List */}
      <div className="bg-surface border border-ink/10 rounded-3xl overflow-hidden shadow-2xs divide-y divide-ink/10 mb-5">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">My Information</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/history')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">Chat History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/saved')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">Saved Answers & Items</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/notifications')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] font-bold bg-negative text-white px-1.5 py-0.2 rounded-full">
                {unreadNotificationCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted" />
          </div>
        </button>

        {/* Language switch */}
        <div className="w-full flex items-center justify-between p-4 text-left border-b border-ink/10">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-muted" />
            <div>
              <span className="text-xs font-semibold text-ink block">Interface Language</span>
              <span className="text-[10px] text-muted">English / Français</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="text-xs font-semibold text-accent bg-accent-soft px-2.5 py-1 rounded-lg cursor-pointer hover:bg-accent-edge transition-colors"
          >
            {language === 'en' ? 'English (EN)' : 'Français (FR)'}
          </button>
        </div>

        {/* AI Model & Voice Engine Information */}
        <div className="p-4 bg-[#F8FAFC] border-b border-ink/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold text-ink uppercase tracking-wider">AI Model & Voice Engine</span>
            </div>
            <span className="text-[10px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-ink/10">
              Active
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-muted">Generative Model:</span>
              <span className="font-semibold text-ink">Google Gemma 4 (gemma-4-26b-a4b-it)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted">Inference Provider:</span>
              <span className="font-semibold text-ink">google-genai</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted">Voice Transcription:</span>
              <span className="font-semibold text-ink">Google Speech-to-Text</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-muted">Voice Synthesis:</span>
              <span className="font-semibold text-ink">Bilingual TTS (EN & FR)</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/admin')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">Demo Content Manager</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/help')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/about')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-raised transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-muted" />
            <span className="text-xs font-semibold text-ink">About My UB Guide</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>
      </div>

      {/* Log out / Switch User */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Sign out and return to user selection?')) {
            clearUserData();
          }
        }}
        className="w-full p-3.5 rounded-2xl bg-surface-border border border-ink/10 text-negative hover:bg-red-50 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
