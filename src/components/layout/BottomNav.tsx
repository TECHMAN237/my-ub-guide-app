import React from 'react';
import { Home, MessageSquare, Compass, BookOpen, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, userCategory, language } = useApp();

  const isFr = language === 'fr';
  const isProspective = userCategory === 'prospective';

  const navItems = [
    {
      id: 'home',
      label: isFr ? 'Accueil' : 'Home',
      icon: Home,
      route: '/home',
      isActive: currentRoute === '/home' || currentRoute === '/'
    },
    {
      id: 'chat',
      label: isFr ? 'Discussion' : 'Chat',
      icon: MessageSquare,
      route: '/chat',
      isActive: currentRoute === '/chat'
    },
    {
      id: 'explore-resources',
      label: isProspective ? (isFr ? 'Programmes' : 'Explore') : (isFr ? 'Ressources' : 'Resources'),
      icon: isProspective ? Compass : BookOpen,
      route: isProspective ? '/programs' : '/resources',
      isActive: isProspective
        ? currentRoute.startsWith('/programs') || currentRoute === '/program-comparison'
        : currentRoute.startsWith('/resources')
    },
    {
      id: 'profile',
      label: isFr ? 'Profil' : 'Profile',
      icon: User,
      route: '/profile',
      isActive: currentRoute === '/profile' || currentRoute === '/settings'
    }
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E1E8F2] safe-bottom"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center justify-center min-h-[44px] py-1 text-center transition-colors focus:outline-none"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    active
                      ? 'text-[#1463F3] stroke-[2.4] scale-105'
                      : 'text-[#68758B] stroke-[1.8] hover:text-[#17233B]'
                  }`}
                />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1463F3]" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 truncate ${
                  active ? 'text-[#1463F3] font-semibold' : 'text-[#68758B]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
