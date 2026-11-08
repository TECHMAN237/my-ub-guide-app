import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
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
    goBack,
    switchCategory,
    unreadNotificationCount,
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
      level: editLevel,
    });
    setIsEditing(false);
  };

  const links = [
    { label: 'Saved answers and items', route: '/saved' },
    { label: 'Chat history', route: '/history' },
    {
      label: 'Notifications',
      route: '/notifications',
      badge: unreadNotificationCount > 0 ? String(unreadNotificationCount) : undefined,
    },
    { label: 'Help', route: '/help' },
    { label: 'About UB Compass', route: '/about' },
    { label: 'Privacy', route: '/privacy' },
    { label: 'Demo content manager', route: '/admin' },
  ];

  const labelClass = 'mb-1 block text-[14px] font-medium text-ink';

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 pt-1">
          <h1 className="page-title text-ink">Profile</h1>
          <p className="page-lede mt-1">Your details and preferences.</p>
        </div>
      </div>

      <section className="mt-8 border-t border-rule pt-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <p className="text-[18px] font-semibold text-ink">
              {userProfile?.name || 'Guest student'}
            </p>
            <p className="mt-0.5 text-[14px] text-muted">{userProfile?.email || 'Not signed in'}</p>
            <p className="mt-2 text-[16px] text-ink">
              {isEnrolled
                ? `${userProfile?.level || 'Level 100'} · ${userProfile?.department || 'Computer Science'}`
                : `Applying for ${userProfile?.interestedStudyLevel || 'undergraduate'} study`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary btn-sm"
            aria-expanded={isEditing}
          >
            {isEditing ? 'Close' : 'Edit details'}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
          <span>{isEnrolled ? 'Enrolled student' : 'Prospective student'}</span>
          <button
            type="button"
            onClick={() => switchCategory(isEnrolled ? 'prospective' : 'enrolled')}
            className="min-h-[36px] font-medium text-accent underline-offset-2 hover:underline"
          >
            Switch to {isEnrolled ? 'prospective' : 'enrolled'}
          </button>
        </div>
      </section>

      {isEditing && (
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              autoComplete="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className={labelClass}>
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              required
              autoComplete="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="profile-faculty" className={labelClass}>
              Faculty
            </label>
            <input
              id="profile-faculty"
              type="text"
              value={editFaculty}
              onChange={(e) => setEditFaculty(e.target.value)}
              className="field"
            />
          </div>

          {isEnrolled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-level" className={labelClass}>
                  Academic level
                </label>
                <select
                  id="profile-level"
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="field"
                >
                  <option value="Level 100">Level 100</option>
                  <option value="Level 200">Level 200</option>
                  <option value="Level 300">Level 300</option>
                  <option value="Level 400">Level 400</option>
                  <option value="Level 500">Level 500</option>
                </select>
              </div>
              <div>
                <label htmlFor="profile-department" className={labelClass}>
                  Department
                </label>
                <input
                  id="profile-department"
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="field"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold text-ink">Account</h2>
        <div className="mt-1">
          {links.map((link) => (
            <button
              key={link.route}
              type="button"
              onClick={() => navigateTo(link.route)}
              className="row-link w-full text-left"
            >
              <span className="text-[16px] text-ink">{link.label}</span>
              <span className="flex shrink-0 items-center gap-2">
                {link.badge && <span className="tnum text-[14px] text-accent">{link.badge}</span>}
                <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[18px] font-semibold text-ink">Language</h2>
        <div className="mt-2 flex gap-2">
          {(['en', 'fr'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLanguage(value)}
              aria-pressed={language === value}
              className="chip"
            >
              {value === 'en' ? 'English' : 'Français'}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t border-rule pt-5">
        <h2 className="text-[18px] font-semibold text-ink">How answers are produced</h2>
        <dl className="mt-2 text-[14px]">
          {[
            ['Model', 'OpenRouter free tier'],
            ['Voice input', 'Browser speech recognition'],
            ['Read aloud', 'Bilingual text to speech'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-wrap justify-between gap-x-4 border-b border-rule py-2"
            >
              <dt className="text-muted">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <button
        type="button"
        onClick={() => {
          if (window.confirm('Sign out and return to the welcome screen?')) {
            clearUserData();
          }
        }}
        className="mt-8 inline-flex min-h-[44px] items-center gap-2 text-[14px] font-medium text-negative underline-offset-2 hover:underline"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </div>
  );
};
