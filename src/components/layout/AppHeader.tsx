import React from "react";
import { Globe, Menu, ChevronLeft, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu: () => void;
}

const CompassMark: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.25 14.35 9.65 21.75 12 14.35 14.35 12 21.75 9.65 14.35 2.25 12 9.65 9.65Z"
      fill="currentColor"
    />
  </svg>
);

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenMenu,
}) => {
  const {
    currentRoute,
    navigateTo,
    goBack,
    unreadNotificationCount,
    language,
    setLanguage,
  } = useApp();

  const handleBack = () => {
    if (onBack) onBack();
    else goBack();
  };

  const isFr = language === "fr";

  const links = [
    { route: "/home", label: isFr ? "Accueil" : "Home" },
    { route: "/chat", label: isFr ? "Discussion" : "Chat" },
    { route: "/programs", label: isFr ? "Programmes" : "Programmes" },
    { route: "/saved", label: isFr ? "Enregistrés" : "Saved" },
  ];

  return (
    <header className="app-header sticky top-0 z-40 bg-ground border-b border-rule">
      <a className="skip-link" href="#main-content">
        {isFr ? "Aller au contenu" : "Skip to content"}
      </a>
      <div className="shell-width mx-auto h-20 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-11 h-11 -ml-2 rounded-[10px] flex items-center justify-center text-ink hover:bg-raised transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateTo("/home")}
              className="flex items-center gap-2.5 min-w-0 group"
              aria-label="UB Compass home"
            >
              <CompassMark className="w-6 h-6 text-accent shrink-0 transition-transform group-hover:rotate-45" />
              <span className="brand-copy text-left">
                <span className="block text-[18px] font-semibold text-ink leading-none whitespace-nowrap">
                  UB Compass
                </span>
                <span className="brand-context">
                  {isFr ? "Université de Buea" : "University of Buea"}
                </span>
              </span>
            </button>
          )}

          {title && (
            <span className="text-[14px] text-muted truncate border-l border-rule pl-3 ml-1">
              {title}
            </span>
          )}
        </div>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active =
              currentRoute === link.route ||
              (link.route !== "/home" && currentRoute.startsWith(link.route));
            return (
              <button
                key={link.route}
                type="button"
                onClick={() => navigateTo(link.route)}
                aria-current={active ? "page" : undefined}
                className={`h-11 px-3 rounded-[10px] text-[14px] transition-colors ${
                  active
                    ? "bg-raised text-ink font-semibold"
                    : "text-muted font-medium hover:text-ink hover:bg-raised"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setLanguage(isFr ? "en" : "fr")}
            className="h-11 px-2.5 rounded-[10px] text-[14px] font-medium text-muted hover:text-ink hover:bg-raised transition-colors flex items-center gap-1.5"
            title={isFr ? "Passer en anglais" : "Switch to French"}
            aria-label={isFr ? "Passer en anglais" : "Switch to French"}
          >
            <Globe className="hidden sm:block w-4 h-4" />
            <span>{isFr ? "FR" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/notifications")}
            className="relative hidden sm:flex w-11 h-11 rounded-[10px] items-center justify-center text-muted hover:text-ink hover:bg-raised transition-colors"
            aria-label={isFr ? "Notifications" : "Notifications"}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-negative ring-2 ring-ground" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="h-11 px-3 rounded-[10px] flex items-center gap-2 text-muted hover:text-ink hover:bg-raised transition-colors"
            aria-label={isFr ? "Ouvrir le menu" : "Open menu"}
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline text-[14px] font-medium">
              {isFr ? "Menu" : "Menu"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export { CompassMark };
