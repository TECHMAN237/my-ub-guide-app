import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, ShieldAlert, Sparkles, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Program, FeeItem, CalendarEvent, ResourceDocument } from '../types';

export const AdminView: React.FC = () => {
  const {
    programs,
    fees,
    calendarEvents,
    resources,
    addProgram,
    deleteProgram,
    addFee,
    deleteFee,
    addCalendarEvent,
    deleteCalendarEvent,
    goBack,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'programs' | 'fees' | 'calendar' | 'resources'>('programs');

  // New Program form state
  const [showProgModal, setShowProgModal] = useState(false);
  const [newProgName, setNewProgName] = useState('');
  const [newProgFaculty, setNewProgFaculty] = useState('Faculty of Science');
  const [newProgFee, setNewProgFee] = useState(280000);
  const [newProgDegree, setNewProgDegree] = useState('BSc (Bachelor of Science)');

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgName.trim()) return;

    const newProg: Program = {
      id: 'prog-custom-' + Date.now(),
      name: newProgName.trim(),
      facultyId: 'fac-science',
      facultyName: newProgFaculty,
      departmentId: 'dept-cs',
      departmentName: 'Computer Science & Technology',
      level: 'undergraduate',
      degreeType: newProgDegree,
      duration: '3 years',
      language: 'English / French',
      mode: 'Regular',
      overview: `${newProgName} curriculum designed to train specialists in modern technical principles.`,
      description: `Comprehensive academic and practical laboratory modules in ${newProgName}.`,
      requirements: ['GCE Advanced Level in 2 subjects', '4 GCE O/L passes including English and Mathematics'],
      entryQualifications: 'GCE A/L 2 passes or Bac C/D',
      annualFee: Number(newProgFee),
      currency: 'FCFA',
      careerOpportunities: ['Professional Specialist', 'Consultant'],
      applicationDeadline: '30 September 2025',
      officialSource: 'Custom Faculty Prospectus (Demo Admin)'
    };

    addProgram(newProg);
    setNewProgName('');
    setShowProgModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
            Demo Content Manager
          </h1>
          <p className="text-xs text-slate-500">Live customization of university mock knowledge</p>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-amber-900 block mb-0.5">Isolated Demonstration Mode</span>
          Any items added or deleted here instantly update the application catalogs and the AI retrieval engine locally. No backend database credentials required.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E1E8F2] mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('programs')}
          className={`py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'programs'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Programs ({programs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'fees'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Fees ({fees.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'calendar'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Calendar ({calendarEvents.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`py-2 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'resources'
              ? 'border-[#1463F3] text-[#1463F3]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Resources ({resources.length})
        </button>
      </div>

      {/* Programs Tab Content */}
      {activeTab === 'programs' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-500">Manage university programs</span>
            <button
              type="button"
              onClick={() => setShowProgModal(true)}
              className="text-xs font-semibold bg-[#1463F3] text-white px-3 py-1.5 rounded-xl hover:bg-[#104fc2] flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Demo Program</span>
            </button>
          </div>

          {showProgModal && (
            <form onSubmit={handleCreateProgram} className="bg-white border border-[#1463F3] rounded-2xl p-4 shadow-sm mb-4 space-y-3">
              <h3 className="text-xs font-bold text-[#102A56] uppercase tracking-wider">New Programme Dossier</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Programme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cybersecurity & Cloud Defense"
                  value={newProgName}
                  onChange={(e) => setNewProgName(e.target.value)}
                  className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-3 py-1.5 text-xs focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Faculty</label>
                  <select
                    value={newProgFaculty}
                    onChange={(e) => setNewProgFaculty(e.target.value)}
                    className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-2 py-1.5 text-xs focus:outline-hidden"
                  >
                    <option value="Faculty of Science">Faculty of Science</option>
                    <option value="Faculty of Engineering">Faculty of Engineering</option>
                    <option value="Faculty of Law">Faculty of Law</option>
                    <option value="Faculty of Health Sciences">Faculty of Health Sciences</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Annual Fee (FCFA)</label>
                  <input
                    type="number"
                    value={newProgFee}
                    onChange={(e) => setNewProgFee(Number(e.target.value))}
                    className="w-full bg-[#F6F8FC] border border-[#E1E8F2] rounded-xl px-2 py-1.5 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1463F3] text-white rounded-xl text-xs font-semibold"
                >
                  Save & Publish to AI
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white border border-[#E1E8F2] rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs"
              >
                <div>
                  <h4 className="font-bold text-[#17233B]">{prog.name}</h4>
                  <p className="text-slate-500 text-[11px]">
                    {prog.facultyName} • {prog.annualFee.toLocaleString()} {prog.currency}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteProgram(prog.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fees Tab Content */}
      {activeTab === 'fees' && (
        <div className="space-y-2">
          {fees.map((f) => (
            <div
              key={f.id}
              className="bg-white border border-[#E1E8F2] rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs"
            >
              <div>
                <h4 className="font-bold text-[#17233B]">{f.programName}</h4>
                <p className="text-slate-500 text-[11px]">
                  Total: {f.totalFee.toLocaleString()} {f.currency} (Tuition: {f.tuitionFee.toLocaleString()})
                </p>
              </div>

              <button
                type="button"
                onClick={() => deleteFee(f.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Calendar Tab Content */}
      {activeTab === 'calendar' && (
        <div className="space-y-2">
          {calendarEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-[#E1E8F2] rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-[#17233B]">{ev.title}</h4>
                  <span className="text-[10px] text-slate-400">({ev.displayDate})</span>
                </div>
                <p className="text-slate-500 text-[11px] truncate max-w-xs">{ev.description}</p>
              </div>

              <button
                type="button"
                onClick={() => deleteCalendarEvent(ev.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Resources Tab Content */}
      {activeTab === 'resources' && (
        <div className="space-y-2">
          {resources.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-[#E1E8F2] rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs"
            >
              <div>
                <h4 className="font-bold text-[#17233B]">{r.title}</h4>
                <p className="text-slate-500 text-[11px]">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
