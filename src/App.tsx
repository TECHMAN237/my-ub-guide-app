import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { DrawerMenu } from './components/layout/DrawerMenu';
import { Toast } from './components/ui/Toast';

import { SplashView } from './views/SplashView';
import { UserTypeSelectionView } from './views/UserTypeSelectionView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { SignUpView, LoginView, HelpView, AboutView, PrivacyView } from './views/StaticPagesView';
import { HomeChatView } from './views/HomeChatView';
import { DedicatedChatView } from './views/DedicatedChatView';
import { ProgramsListView } from './views/ProgramsListView';
import { ProgramDetailView } from './views/ProgramDetailView';
import { ProgramComparisonView } from './views/ProgramComparisonView';
import { AdmissionsView } from './views/AdmissionsView';
import { AdmissionsChecklistView } from './views/AdmissionsChecklistView';
import { FeesView } from './views/FeesView';
import { AcademicCalendarView } from './views/AcademicCalendarView';
import { DepartmentsView } from './views/DepartmentsView';
import { ResourcesView } from './views/ResourcesView';
import { ResourceDetailView } from './views/ResourceDetailView';
import { SavedItemsView } from './views/SavedItemsView';
import { HistoryView } from './views/HistoryView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { AdminView } from './views/AdminView';

const MainLayout: React.FC = () => {
  const { currentRoute, userProfile, isLoggedIn } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Full-screen onboarding / auth views where top app header & bottom nav are hidden
  const isFullScreenView =
    currentRoute === '/' ||
    currentRoute === '/welcome' ||
    currentRoute === '/auth/login' ||
    currentRoute === '/auth/signup' ||
    currentRoute === '/setup/user-type' ||
    currentRoute === '/setup/profile';

  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        // Default entry page: LoginView for unauthenticated visitors, HomeChatView for authenticated users
        if (userProfile || isLoggedIn) {
          return <HomeChatView />;
        }
        return <LoginView />;
      case '/auth/login':
        if (userProfile || isLoggedIn) {
          return <HomeChatView />;
        }
        return <LoginView />;
      case '/welcome':
      case '/landing':
        return <SplashView />;
      case '/setup/user-type':
        return <UserTypeSelectionView />;
      case '/setup/profile':
        return <ProfileSetupView />;
      case '/auth/signup':
        return <SignUpView />;
      case '/home':
        return <HomeChatView />;
      case '/chat':
        return <DedicatedChatView />;
      case '/programs':
        return <ProgramsListView />;
      case '/program-comparison':
        return <ProgramComparisonView />;
      case '/admissions':
        return <AdmissionsView />;
      case '/admissions/checklist':
        return <AdmissionsChecklistView />;
      case '/fees':
        return <FeesView />;
      case '/academic-calendar':
        return <AcademicCalendarView />;
      case '/departments':
        return <DepartmentsView />;
      case '/resources':
        return <ResourcesView />;
      case '/saved':
        return <SavedItemsView />;
      case '/history':
        return <HistoryView />;
      case '/notifications':
        return <NotificationsView />;
      case '/profile':
      case '/settings':
        return <ProfileSettingsView />;
      case '/admin':
        return <AdminView />;
      case '/help':
        return <HelpView />;
      case '/about':
        return <AboutView />;
      case '/privacy':
        return <PrivacyView />;
      default:
        if (currentRoute.startsWith('/programs/')) {
          return <ProgramDetailView />;
        }
        if (currentRoute.startsWith('/resources/')) {
          return <ResourceDetailView />;
        }
        if (currentRoute.startsWith('/chat/')) {
          return <DedicatedChatView />;
        }
        if (userProfile || isLoggedIn) {
          return <HomeChatView />;
        }
        return <LoginView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#17233B] flex flex-col antialiased selection:bg-[#1463F3] selection:text-white">
      {/* Toast alert */}
      <Toast />

      {/* Top Header on standard views */}
      {!isFullScreenView && (
        <AppHeader onOpenMenu={() => setIsMenuOpen(true)} />
      )}

      {/* Slide-out Navigation Drawer */}
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Fixed Bottom Tab Navigation */}
      {!isFullScreenView && <BottomNavigation />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
