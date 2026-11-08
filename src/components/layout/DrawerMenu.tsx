import React, { useEffect, useRef } from 'react';
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
    resetAllData,
    language,
  } = useApp();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFr = language === 'fr';

  const handleNav = (route: string) => {
    onClose();
    navigateTo(route);
  };

  const profileInitial = userProfile?.name?.charAt(0) || 'G';

  const sections = [
    {
      title: isFr ? 'Université' : 'University',
      items: [
        { route: '/programs', icon: Compass, label: isFr ? 'Programmes' : 'Programmes' },
        {
          route: '/program-comparison',
          icon: Layers,
          label: isFr ? 'Comparer les programmes' : 'Compare programmes',
        },
        {
          route: '/admissions',
          icon: FileCheck2,
          label: isFr ? 'Admissions et étapes' : 'Admissions and steps',
        },
        { route: '/fees', icon: CreditCard, label: isFr ? 'Frais de scolarité' : 'School fees' },
        {
          route: '/academic-calendar',
          icon: Calendar,
          label: isFr ? 'Calendrier académique' : 'Academic calendar',
        },
        {
          route: '/departments',
          icon: Building2,
          label: isFr ? 'Facultés et départements' : 'Faculties and departments',
        },
        {
          route: '/resources',
          icon: BookOpen,
          label: isFr ? 'Ressources étudiantes' : 'Student resources',
        },
      ],
    },
    {
      title: isFr ? 'Votre compte' : 'Your account',
      items: [
        { route: '/saved', icon: Bookmark, label: isFr ? 'Éléments enregistrés' : 'Saved items' },
        {
          route: '/history',
          icon: History,
          label: isFr ? 'Historique des discussions' : 'Conversation history',
        },
        { route: '/profile', icon: Settings, label: isFr ? 'Profil et réglages' : 'Profile and settings' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[rgba(21,33,28,0.42)]"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="w-[min(88vw,380px)] h-full bg-surface shadow-pop flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-rule">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-raised text-ink flex items-center justify-center text-[16px] font-semibold shrink-0">
              {profileInitial}
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-ink leading-tight truncate">
                {userProfile?.name || (isFr ? 'Invité' : 'Guest')}
              </p>
              <p className="text-[14px] text-muted leading-tight">
                {userCategory === 'enrolled'
                  ? isFr
                    ? 'Étudiant inscrit'
                    : 'Enrolled student'
                  : isFr
                    ? 'Candidat'
                    : 'Prospective student'}
              </p>
            </div>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            className="w-11 h-11 -mr-1 rounded-[10px] flex items-center justify-center text-muted hover:text-ink hover:bg-raised transition-colors"
            aria-label={isFr ? 'Fermer le menu' : 'Close menu'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 bg-raised">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] text-muted">{isFr ? 'Mode étudiant' : 'Student mode'}</p>
              <p className="text-[16px] font-semibold text-ink">
                {userCategory === 'enrolled'
                  ? isFr
                    ? 'Inscrit'
                    : 'Enrolled'
                  : isFr
                    ? 'Prospectif'
                    : 'Prospective'}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                switchCategory(userCategory === 'prospective' ? 'enrolled' : 'prospective')
              }
              className="text-[14px] font-semibold text-accent hover:text-accent-edge transition-colors"
            >
              {isFr ? 'Changer' : 'Change'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {sections.map((section) => (
            <div key={section.title} className="pt-3">
              <p className="px-3 pb-1 text-[14px] text-muted">{section.title}</p>
              {section.items.map(({ route, icon: Icon, label }) => (
                <button
                  key={route}
                  type="button"
                  onClick={() => handleNav(route)}
                  className="w-full min-h-12 flex items-center gap-3 px-3 rounded-[10px] text-[16px] font-medium text-ink hover:bg-raised transition-colors text-left"
                >
                  <Icon className="w-[18px] h-[18px] text-muted shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          ))}

          <div className="pt-3">
            <p className="px-3 pb-1 text-[14px] text-muted">{isFr ? 'Outils' : 'Tools'}</p>
            <button
              type="button"
              onClick={() => handleNav('/admin')}
              className="w-full min-h-12 flex items-center gap-3 px-3 rounded-[10px] text-[16px] font-medium text-ink hover:bg-raised transition-colors text-left"
            >
              <Database className="w-[18px] h-[18px] text-muted shrink-0" />
              <span>{isFr ? 'Gestion du contenu démo' : 'Demo content manager'}</span>
            </button>
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-[14px] text-muted">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                {isFr ? 'Simuler une panne IA' : 'Simulate AI failure'}
              </span>
              <button
                type="button"
                onClick={() => setSimulateAiFailure(!simulateAiFailure)}
                className={`h-8 px-3 rounded-[10px] text-[14px] font-semibold transition-colors ${
                  simulateAiFailure
                    ? 'bg-negative text-white'
                    : 'bg-raised text-ink hover:bg-rule'
                }`}
                aria-pressed={simulateAiFailure}
              >
                {simulateAiFailure ? (isFr ? 'Active' : 'On') : isFr ? 'Inactive' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-rule">
          <div className="flex items-center gap-4 text-[14px] text-muted">
            <button
              type="button"
              onClick={() => handleNav('/help')}
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{isFr ? 'Aide' : 'Help'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('/about')}
              className="hover:text-ink transition-colors"
            >
              {isFr ? 'À propos' : 'About'}
            </button>
            <button
              type="button"
              onClick={() => handleNav('/privacy')}
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>{isFr ? 'Confidentialité' : 'Privacy'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  isFr
                    ? 'Réinitialiser toutes les données de démonstration ?'
                    : 'Reset all demo data and restore defaults?'
                )
              ) {
                resetAllData();
              }
            }}
            className="mt-3 flex items-center gap-1.5 text-[14px] font-medium text-negative hover:opacity-80 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isFr ? 'Réinitialiser les données' : 'Reset demo data'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
