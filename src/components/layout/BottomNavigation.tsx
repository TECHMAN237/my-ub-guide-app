import React from 'react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E1E8F2] h-15 sm:h-16 pb-safe shadow-xs">
      <div className="max-w-lg mx-auto grid grid-cols-4 h-full items-center px-2">
        {/* Home */}
        <button
          type="button"
          onClick={() => navigateTo('/home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            isHomeActive ? 'text-[#1463F3]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </button>

        {/* Chat */}
        <button
          type="button"
          onClick={() => navigateTo('/chat')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            isChatActive ? 'text-[#1463F3]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${isChatActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Chat</span>
        </button>

        {/* Explore / Resources */}
        <button
          type="button"
          onClick={handleExploreClick}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            isExploreActive ? 'text-[#1463F3]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ExploreIcon className={`w-5 h-5 ${isExploreActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">{exploreLabel}</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigateTo('/profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] cursor-pointer ${
            isProfileActive ? 'text-[#1463F3]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
