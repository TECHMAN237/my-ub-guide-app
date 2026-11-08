import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FACULTIES, INITIAL_DEPARTMENTS, INITIAL_PROGRAMS } from '../data/mockData';

export const ProfileSetupView: React.FC = () => {
  const { navigateTo, userCategory, userProfile, updateProfile } = useApp();

  const isEnrolled = userCategory === 'enrolled';

  const [name, setName] = useState(
    userProfile?.name || (isEnrolled ? 'Ferdinand Tanyi' : 'Alex Mbarga')
  );
  const [email, setEmail] = useState(
    userProfile?.email ||
      (isEnrolled ? 'ferdinand.tanyi@student.uniguide.edu.cm' : 'alex.mbarga@gmail.com')
  );
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

  const labelClass = 'mb-1 block text-[14px] font-medium text-ink';

  return (
    <div className="min-h-screen bg-ground px-5 py-8">
      <div className="mx-auto w-full max-w-[560px]">
        <button
          type="button"
          onClick={() => navigateTo('/setup/user-type')}
          className="-ml-2 mb-6 flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="page-title text-ink">Tell us about you</h1>
        <p className="page-lede mt-1">
          A few details so answers match your faculty, level and status.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="setup-name" className={labelClass}>
              Full name
            </label>
            <input
              id="setup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="setup-email" className={labelClass}>
              Email
            </label>
            <input
              id="setup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="setup-phone" className={labelClass}>
              Phone <span className="text-muted">(optional)</span>
            </label>
            <input
              id="setup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="field"
            />
          </div>

          {!isEnrolled && (
            <>
              <fieldset>
                <legend className={labelClass}>Interested in</legend>
                <div className="flex gap-2">
                  {(['undergraduate', 'postgraduate'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStudyLevel(value)}
                      aria-pressed={studyLevel === value}
                      className="chip flex-1 justify-center"
                    >
                      {value === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="setup-faculty" className={labelClass}>
                  Faculty <span className="text-muted">(if you know)</span>
                </label>
                <select
                  id="setup-faculty"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="field"
                >
                  {INITIAL_FACULTIES.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="setup-program" className={labelClass}>
                  Programme of interest <span className="text-muted">(optional)</span>
                </label>
                <select
                  id="setup-program"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="field"
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

          {isEnrolled && (
            <>
              <div>
                <label htmlFor="setup-level" className={labelClass}>
                  Academic level
                </label>
                <select
                  id="setup-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="field"
                >
                  <option value="Level 100">First year (Level 100)</option>
                  <option value="Level 200">Second year (Level 200)</option>
                  <option value="Level 300">Third year (Level 300)</option>
                  <option value="Level 400">Fourth year (Level 400)</option>
                  <option value="Level 500">Fifth year (Level 500)</option>
                </select>
              </div>

              <div>
                <label htmlFor="setup-enrolled-faculty" className={labelClass}>
                  Faculty
                </label>
                <select
                  id="setup-enrolled-faculty"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="field"
                >
                  {INITIAL_FACULTIES.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="setup-department" className={labelClass}>
                  Department
                </label>
                <select
                  id="setup-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="field"
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

          <fieldset>
            <legend className={labelClass}>Preferred language</legend>
            <div className="flex gap-2">
              {(['en', 'fr'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  aria-pressed={language === value}
                  className="chip flex-1 justify-center"
                >
                  {value === 'en' ? 'English' : 'French'}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary w-full">
            Continue to UB Compass
          </button>
        </form>

        <p className="mt-4 text-center text-[14px] text-muted">
          You can change these details later in profile settings.
        </p>
      </div>
    </div>
  );
};
