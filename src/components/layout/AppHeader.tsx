import React from 'react';
import { Bot, Bell, Menu, Globe, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenMenu
}) => {
  const {
    currentRoute,
    navigateTo,
    goBack,
    unreadNotificationCount,
    language,
    setLanguage,
    userCategory
  } = useApp();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E1E8F2] px-4 h-14 flex items-center justify-between">
      {/* Left side: Back button or App Brand */}
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 -ml-1 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : null}

        {title ? (
          <h1 className="text-sm sm:text-base font-semibold text-[#17233B] truncate max-w-[200px] sm:max-w-xs">
            {title}
          </h1>
        ) : (
          <button
            type="button"
            onClick={() => navigateTo('/home')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#102A56] to-[#1463F3] flex items-center justify-center text-white shadow-xs shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#17233B] group-hover:text-[#1463F3] transition-colors leading-tight">
                  My UB Guide
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Assistant Online" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">
                {userCategory === 'enrolled' ? 'Enrolled Student' : 'University Guide'}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Right side: Language, Notifications, Menu */}
      <div className="flex items-center gap-1">
        {/* Language switch button */}
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-[#1463F3] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
          title="Switch language (EN/FR)"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{language}</span>
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => navigateTo('/notifications')}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#1463F3] hover:bg-slate-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Menu Toggle */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#1463F3] hover:bg-slate-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
