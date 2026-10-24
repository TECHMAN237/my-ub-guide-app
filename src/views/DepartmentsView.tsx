import React, { useState } from 'react';
import { ArrowLeft, Building2, MapPin, Mail, ChevronRight, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES, INITIAL_DEPARTMENTS } from '../data/mockData';

export const DepartmentsView: React.FC = () => {
  const { goBack, navigateTo, sendMessage } = useApp();
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('fac-science');

  const selectedFaculty = INITIAL_FACULTIES.find((f) => f.id === selectedFacultyId) || INITIAL_FACULTIES[0];
  const relatedDepartments = INITIAL_DEPARTMENTS.filter((d) => d.facultyId === selectedFaculty.id);

  const handleAskAIDept = async (deptName: string) => {
    navigateTo('/chat');
    await sendMessage(`Where is the Department of ${deptName} located, who is the Head of Department, and what are their office hours?`);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-4 pb-28">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
            Faculties & Departments
          </h1>
          <p className="text-xs text-slate-500">Academic structure, faculty offices, and departmental heads</p>
        </div>
      </div>

      {/* Faculty Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {INITIAL_FACULTIES.map((fac) => (
          <button
            key={fac.id}
            type="button"
            onClick={() => setSelectedFacultyId(fac.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedFacultyId === fac.id
                ? 'bg-[#1463F3] text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-[#E1E8F2] hover:bg-slate-50'
            }`}
          >
            {fac.name}
          </button>
        ))}
      </div>

      {/* Selected Faculty Overview Card */}
      <div className="bg-white border border-[#E1E8F2] rounded-3xl p-5 mb-5 shadow-2xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1463F3] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17233B]">{selectedFaculty.name}</h2>
            <span className="text-[11px] text-slate-400">{selectedFaculty.programsCount} Academic Programmes</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {selectedFaculty.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{selectedFaculty.officeLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{selectedFaculty.contactEmail}</span>
          </div>
        </div>
      </div>

      {/* Departments List */}
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
        Academic Departments
      </h3>

      <div className="space-y-3">
        {relatedDepartments.length === 0 ? (
          <div className="text-center py-6 bg-white rounded-2xl border border-[#E1E8F2] p-4 text-xs text-slate-500">
            Departments for this faculty are managed under the central Dean's office.
          </div>
        ) : (
          relatedDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white border border-[#E1E8F2] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-[#17233B]">{dept.name}</h4>
                  <span className="text-[11px] text-[#1463F3] font-medium">Head: {dept.headOfDepartment}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAskAIDept(dept.name)}
                  className="text-[11px] font-semibold text-[#1463F3] bg-[#EEF5FF] hover:bg-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Bot className="w-3 h-3" />
                  <span>Ask AI</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {dept.overview}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{dept.location}</span>
                </span>
                <span className="text-slate-400">{dept.contactEmail}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
