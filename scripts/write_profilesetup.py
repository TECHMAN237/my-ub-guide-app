"""Write the new ProfileSetupView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'ProfileSetupView.tsx'))

JSX = r'''import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES, INITIAL_DEPARTMENTS, INITIAL_PROGRAMS } from '../data/mockData';

export const ProfileSetupView: React.FC = () => {
  const { navigateTo, userCategory, userProfile, updateProfile } = useApp();

  const isEnrolled = userCategory === 'enrolled';

  const [name, setName] = useState(userProfile?.name || (isEnrolled ? 'Ferdinand Tanyi' : 'Alex Mbarga'));
  const [email, setEmail] = useState(userProfile?.email || (isEnrolled ? 'ferdinand.tanyi@student.uniguide.edu.cm' : 'alex.mbarga@gmail.com'));
  const [phone, setPhone] = useState(userProfile?.phone || '+237 671 23 45 67');
  const [studyLevel, setStudyLevel] = useState<'undergraduate' | 'postgraduate'>('undergraduate');
  const [faculty, setFaculty] = useState(userProfile?.faculty || 'Faculty of Science');
  const [department, setDepartment] = useState(userProfile?.department || 'Computer Science');
  const [level, setLevel] = useState(userProfile?.level || 'Level 100');
  const [program, setProgram] = useState(userProfile?.interestedProgram || 'Computer Science');
  const [language, setLang] = useState<'en' | 'fr'>('en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      id: userProfile?.id || 'user-' + Date.now(),
      name: name.trim() || (isEnrolled ? 'Ferdinand' : 'Student'),
      email: email.trim(),
      phone: phone.trim(),
      category: userCategory,
      language: language,
      faculty: faculty,
      department: department,
      level: isEnrolled ? level : undefined,
      interestedStudyLevel: !isEnrolled ? studyLevel : undefined,
      interestedProgram: !isEnrolled ? program : undefined,
      degreeProgram: isEnrolled ? `${department} (${level})` : undefined,
      institution: 'Cameroon University Institute',
      academicYear: '2025/2026',
      semester: 'First Semester',
    });

    navigateTo('/home');
  };

  return (
    <div className="min-h-screen bg-raised flex flex-col justify-between p-6 max-w-md mx-auto">
      <div>
        {/* Navigation / Stepper header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <button
            type="button"
            onClick={() => navigateTo('/setup/user-type')}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:bg-raised transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/30" />
            <span className="w-6 h-1.5 rounded-full bg-accent" />
            <span className="w-1.5 h-1.5 rounded-full bg-ink/30" />
          </div>

          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1.5">
            Tell us about you
          </h1>
          <p className="text-xs text-muted leading-relaxed">
            This helps our AI provide accurate, regulations-backed guidance suited to your academic journey.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ferdinand Tanyi"
              className="w-full bg-surface border border-ink/10 focus:border-accent focus:ring-2 focus:ring-accent-soft rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
            />
          </div>

          {/* Prospective Specific Fields */}
          {!isEnrolled && (
            <>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Interested in
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStudyLevel('undergraduate')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${studyLevel === 'undergraduate' ? 'bg-accent-soft text-accent border-accent' : 'bg-surface border-ink/10 text-muted hover:bg-raised'}`}
                  >
                    Undergraduate
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudyLevel('postgraduate')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${studyLevel === 'postgraduate' ? 'bg-accent-soft text-accent border-accent' : 'bg-surface border-ink/10 text-muted hover:bg-raised'}`}
                  >
                    Postgraduate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Faculty (if you know)
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
                >
                  {INITIAL_FACULTIES.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Programme of interest (optional)
                </label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
                >
                  <option value="Undecided">I am still exploring</option>
                  {INITIAL_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.degreeType})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Enrolled Specific Fields */}
          {isEnrolled && (
            <>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Academic Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
                >
                  <option value="Level 100">First Year (Level 100)</option>
                  <option value="Level 200">Second Year (Level 200)</option>
                  <option value="Level 300">Third Year (Level 300)</option>
                  <option value="Level 400">Fourth Year (Level 400)</option>
                  <option value="Level 500">Fifth Year (Level 500)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Faculty
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
                >
                  {INITIAL_FACULTIES.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-surface border border-ink/10 focus:border-accent rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-hidden"
                >
                  {INITIAL_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${language === 'en' ? 'bg-accent-soft text-accent border-accent font-semibold' : 'bg-surface border-ink/10 text-muted hover:bg-raised'}`}
              >
                {language === 'en' && <Check className="w-3.5 h-3.5 text-accent" />}
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${language === 'fr' ? 'bg-accent-soft text-accent border-accent font-semibold' : 'bg-surface border-ink/10 text-muted hover:bg-raised'}`}
              >
                {language === 'fr' && <Check className="w-3.5 h-3.5 text-accent" />}
                <span>French</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-edge active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue to Assistant</span>
            </button>
          </div>
        </form>
      </div>

      <div className="text-center py-4 text-xs text-muted">
        You can update your profile details anytime in settings
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
