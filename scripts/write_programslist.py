"""Write the new ProgramsListView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ProgramsListView.tsx'))

JSX = r'''import React, { useState } from 'react';
import { Search, ChevronRight, Bookmark, ArrowUpDown, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES } from '../data/mockData';
import { Program } from '../types';

export const ProgramsListView: React.FC = () => {
  const { programs, navigateTo, isItemSaved, saveItem, removeItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'undergraduate' | 'postgraduate'>('undergraduate');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === 'all' || p.level === selectedLevel;
    const matchesFaculty = selectedFaculty === 'all' || p.facultyName === selectedFaculty;

    return matchesSearch && matchesLevel && matchesFaculty;
  });

  const handleToggleSave = (e: React.MouseEvent, program: Program) => {
    e.stopPropagation();
    if (isItemSaved('program', program.id)) {
      removeItem(program.id);
    } else {
      saveItem({
        type: 'program',
        title: program.name,
        subtitle: `${program.degreeType} • ${program.facultyName}`,
        data: program,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-4 pb-28">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink tracking-tight">
          Explore Programmes
        </h1>
        <p className="text-xs text-muted">
          Discover accredited undergraduate & postgraduate degrees offered by the university.
        </p>
      </div>

      {/* Level Filter Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-raised p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setSelectedLevel('undergraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${selectedLevel === 'undergraduate' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'}`}
        >
          Undergraduate
        </button>
        <button
          type="button"
          onClick={() => setSelectedLevel('postgraduate')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${selectedLevel === 'postgraduate' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'}`}
        >
          Postgraduate
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search programs, faculties, or majors..."
          className="w-full bg-surface border border-ink/10 focus:border-accent focus:ring-2 focus:ring-accent-soft rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-ink focus:outline-hidden"
        />
      </div>

      {/* Faculty Filter Dropdown */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
        <select
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          className="bg-surface border border-ink/10 text-xs font-medium text-ink rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-accent"
        >
          <option value="all">All Faculties</option>
          {INITIAL_FACULTIES.map((f) => (
            <option key={f.id} value={f.name}>
              {f.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => navigateTo('/program-comparison')}
          className="ml-auto text-xs text-accent font-semibold flex items-center gap-1 hover:underline"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Compare Programs</span>
        </button>
      </div>

      {/* Program Cards List */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-2xl border border-ink/10 p-6">
          <p className="text-sm font-semibold text-ink mb-1">No programmes match your filter</p>
          <p className="text-xs text-muted mb-3">Try adjusting your search terms or clearing the faculty filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedFaculty('all');
            }}
            className="text-xs font-bold text-accent bg-accent-soft px-3 py-1.5 rounded-lg hover:bg-accent-edge transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredPrograms.map((program) => {
            const isSaved = isItemSaved('program', program.id);

            return (
              <div
                key={program.id}
                onClick={() => navigateTo(`/programs/${program.id}`, { programId: program.id })}
                className="bg-surface border border-ink/10 hover:border-accent hover:bg-raised rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-accent bg-accent-soft px-2 py-0.5 rounded-md">
                      {program.facultyName}
                    </span>
                    <span className="text-[11px] text-muted">·</span>
                    <span className="text-[11px] text-muted font-medium">{program.duration}</span>
                  </div>

                  <h3 className="text-sm font-bold text-ink group-hover:text-accent transition-colors">
                    {program.name}
                  </h3>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">{program.degreeType}</p>

                  <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-ink">
                    <span>Annual Tuition:</span>
                    <span className="font-bold text-ink">
                      {program.annualFee.toLocaleString()} {program.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(e, program)}
                    className={`p-2 rounded-xl transition-colors ${isSaved ? 'text-accent bg-accent-soft' : 'text-muted hover:text-ink hover:bg-[#F8FAFC]'}`}
                    title={isSaved ? 'Saved' : 'Save program'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
