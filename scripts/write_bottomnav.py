"""Write the new BottomNavigation.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'components', 'layout', 'BottomNavigation.tsx'))

JSX = r'''import React from 'react';
import { Home, MessageSquare, Compass, BookOpen, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const { currentRoute, navigateTo, userCategory } = useApp();

  const isExploreActive =
    currentRoute === '/programs' ||
    currentRoute.startsWith('/programs/') ||
    currentRoute === '/resources' ||
    currentRoute.startsWith('/resources/') ||
    currentRoute === '/admissions' ||
    currentRoute === '/fees' ||
    currentRoute === '/academic-calendar';

  const isChatActive = currentRoute === '/chat' || currentRoute.startsWith('/chat/');
  const isHomeActive = currentRoute === '/home';
  const isProfileActive = currentRoute === '/profile' || currentRoute === '/settings';

  const exploreLabel = userCategory === 'enrolled' ? 'Resources' : 'Explore';
  const ExploreIcon = userCategory === 'enrolled' ? BookOpen : Compass;

  const handleExploreClick = () => {
    if (userCategory === 'enrolled') {
      navigateTo('/resources');
    } else {
      navigateTo('/programs');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-ink/10 h-15 sm:h-16 pb-safe shadow-xs shadow-ink">
      <div className="max-w-lg mx-auto grid grid-cols-4 h-full items-center px-2">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigateTo('/home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${isHomeActive ? 'text-accent' : 'text-muted hover:text-ink'}`}
        >
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </button>

        {/* Chat */}
        <button
          type="button"
          onClick={() => navigateTo('/chat')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${isChatActive ? 'text-accent' : 'text-muted hover:text-ink'}`}
        >
          <MessageSquare className={`w-5 h-5 ${isChatActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Chat</span>
        </button>

        {/* Explore / Resources */}
        <button
          type="button"
          onClick={handleExploreClick}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${isExploreActive ? 'text-accent' : 'text-muted hover:text-ink'}`}
        >
          <ExploreIcon className={`w-5 h-5 ${isExploreActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">{exploreLabel}</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigateTo('/profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${isProfileActive ? 'text-accent' : 'text-muted hover:text-ink'}`}
        >
          <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
