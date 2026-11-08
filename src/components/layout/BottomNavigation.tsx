import React from 'react';
import { Home, MessageSquare, Compass, BookOpen, Bookmark, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { currentRoute, navigateTo, userCategory, language } = useApp();

  const isFr = language === 'fr';
  const isEnrolled = userCategory === 'enrolled';

  const isExploreActive =
    currentRoute === '/programs' ||
    currentRoute.startsWith('/programs/') ||
    currentRoute === '/program-comparison' ||
    currentRoute === '/resources' ||
    currentRoute.startsWith('/resources/') ||
    currentRoute === '/admissions' ||
    currentRoute.startsWith('/admissions/') ||
    currentRoute === '/fees' ||
    currentRoute === '/academic-calendar' ||
    currentRoute === '/departments';

  const items = [
    {
      id: 'home',
      label: isFr ? 'Accueil' : 'Home',
      icon: Home,
      route: '/home',
      active: currentRoute === '/home' || currentRoute === '/',
    },
    {
      id: 'chat',
      label: isFr ? 'Discussion' : 'Chat',
      icon: MessageSquare,
      route: '/chat',
      active: currentRoute === '/chat' || currentRoute.startsWith('/chat/'),
    },
    {
      id: 'explore',
      label: isEnrolled
        ? isFr
          ? 'Ressources'
          : 'Resources'
        : isFr
          ? 'Explorer'
          : 'Explore',
      icon: isEnrolled ? BookOpen : Compass,
      route: isEnrolled ? '/resources' : '/programs',
      active: isExploreActive,
    },
    {
      id: 'saved',
      label: isFr ? 'Enregistrés' : 'Saved',
      icon: Bookmark,
      route: '/saved',
      active: currentRoute === '/saved',
    },
    {
      id: 'profile',
      label: isFr ? 'Profil' : 'Profile',
      icon: User,
      route: '/profile',
      active: currentRoute === '/profile' || currentRoute === '/settings',
    },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-rule pb-safe md:hidden"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.route)}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] px-1 transition-colors ${
                item.active ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
              aria-current={item.active ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 ${item.active ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              <span
                className={`text-[12px] leading-none ${
                  item.active ? 'font-semibold' : 'font-medium'
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
