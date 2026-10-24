import React, { useState } from 'react';
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
      {/* Profile Header Avatar & Identity (Screen 14) */}
      <div className="bg-white border border-[#E1E8F2] rounded-3xl p-6 text-center shadow-2xs mb-5">
        <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#102A56] to-[#1463F3] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-md shadow-blue-500/20">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>

        <h1 className="text-lg font-bold text-[#17233B]">
          {userProfile?.name || 'Ferdinand Tanyi'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {isEnrolled
            ? `Enrolled Student • ${userProfile?.level || 'Level 100'} • ${userProfile?.department || 'Computer Science'}`
            : `Prospective Student • Interested in ${userProfile?.interestedStudyLevel || 'Undergraduate'} Programs`}
        </p>

        {/* Category Switch Badge Button */}
        <div className="mt-3 inline-flex items-center gap-2 bg-[#F6F8FC] border border-[#E1E8F2] px-3 py-1 rounded-full text-xs">
          <span className="text-slate-600 font-medium">Category:</span>
          <button
            type="button"
            onClick={() => switchCategory(isEnrolled ? 'prospective' : 'enrolled')}
            className="font-bold text-[#1463F3] hover:underline cursor-pointer"
          >
            {isEnrolled ? 'Enrolled Student' : 'Prospective Student'} (Switch)
          </button>
        </div>
      </div>

      {/* Inline Edit Profile Form (if toggled) */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-[#1463F3]/40 rounded-3xl p-5 mb-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Edit Information</h2>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1463F3]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#1463F3]"
            />
          </div>
          {isEnrolled && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Academic Level</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-2 py-2 text-xs focus:outline-hidden"
                >
                  <option value="Level 100">Level 100</option>
                  <option value="Level 200">Level 200</option>
                  <option value="Level 300">Level 300</option>
                  <option value="Level 400">Level 400</option>
                  <option value="Level 500">Level 500</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#1463F3] text-white font-semibold text-xs cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Menu Action List (Matching Screen 14 in visual reference) */}
      <div className="bg-white border border-[#E1E8F2] rounded-3xl overflow-hidden shadow-2xs divide-y divide-slate-100 mb-5">
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">My Information</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/history')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">Chat History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/saved')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">Saved Answers & Items</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/notifications')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.2 rounded-full">
                {unreadNotificationCount}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>

        {/* Language switch */}
        <div className="w-full flex items-center justify-between p-4 text-left border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-[#17233B] block">Interface Language</span>
              <span className="text-[10px] text-slate-400">English / Français</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="text-xs font-semibold text-[#1463F3] bg-[#EEF5FF] px-2.5 py-1 rounded-lg cursor-pointer hover:bg-blue-100"
          >
            {language === 'en' ? 'English (EN)' : 'Français (FR)'}
          </button>
        </div>

        {/* AI Model & Voice Engine Information (Gemma Mandate) */}
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#102A56] uppercase tracking-wider">AI Model & Voice Engine</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Generative Model:</span>
              <span className="font-semibold text-slate-800">Google Gemma 4 (gemma-4-26b-a4b-it)</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Inference Provider:</span>
              <span className="font-semibold text-slate-800">google-genai</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Voice Transcription:</span>
              <span className="font-semibold text-slate-800">Google Speech-to-Text</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">Voice Synthesis:</span>
              <span className="font-semibold text-slate-800">Bilingual TTS (EN & FR)</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('/admin')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">Demo Content Manager</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/help')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('/about')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-500" />
            <span className="text-xs font-semibold text-[#17233B]">About My UB Guide</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
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
        className="w-full p-3.5 rounded-2xl bg-white border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </div>
  );
};
