import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserCategory,
  Language,
  Conversation,
  ChatMessage,
  SavedItem,
  ChecklistItem,
  NotificationItem,
  Program,
  FeeItem,
  CalendarEvent,
  ResourceDocument
} from '../types';
import {
  INITIAL_PROGRAMS,
  INITIAL_FEES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_RESOURCES
} from '../data/mockData';
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  getStoredSession,
  saveStoredSession,
  getStoredLanguage,
  saveStoredLanguage,
  getStoredConversations,
  saveStoredConversations,
  getActiveConversationId,
  saveActiveConversationId,
  getStoredSavedItems,
  saveStoredSavedItems,
  getStoredChecklist,
  saveStoredChecklist,
  getStoredNotifications,
  saveStoredNotifications,
  resetAllDemoData
} from '../services/storageService';
import { aiService } from '../services/aiService';

export interface AppContextType {
  userProfile: UserProfile | null;
  userCategory: UserCategory;
  isLoggedIn: boolean;
  language: Language;
  currentRoute: string;
  routeParams: Record<string, any>;
  navigate: (route: string) => void;
  navigateTo: (route: string, params?: Record<string, any>) => void;
  goBack: () => void;
  switchCategory: (targetCategory?: UserCategory) => void;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  savedItems: SavedItem[];
  checklist: ChecklistItem[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  unreadNotificationCount: number;
  isAiLoading: boolean;
  isSendingMessage: boolean;
  aiError: string | null;
  chatError: string | null;
  lastFailedMessage: string | null;
  isForceMockMode: boolean;
  isSimulatingFailure: boolean;
  simulateAiFailure: boolean;
  setSimulateAiFailure: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Domain entities
  programs: Program[];
  fees: FeeItem[];
  calendarEvents: CalendarEvent[];
  resources: ResourceDocument[];
  addProgram: (p: Program) => void;
  deleteProgram: (id: string) => void;
  addFee: (f: FeeItem) => void;
  deleteFee: (id: string) => void;
  addCalendarEvent: (e: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  // Actions
  setUserCategory: (category: UserCategory) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  loginDemo: (email: string, name?: string) => void;
  signupDemo: (name: string, email: string) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  createNewConversation: () => Conversation;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  saveItem: (item: any, type?: any) => void;
  removeItem: (idOrTitle: string, type?: any) => void;
  toggleSaveItem: (item: { type: SavedItem['type']; title: string; subtitle?: string; data: any }) => void;
  isItemSaved: (typeOrTitle: string, idOrTitle?: string) => boolean;
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;
  markNotificationRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markAllNotificationsAsRead: () => void;
  clearUserData: () => void;
  resetAppDemoData: () => void;
  resetAllData: () => void;
  setForceMockMode: (val: boolean) => void;
  setSimulateFailure: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getStoredProfile());
  const [userCategory, setUserCategoryState] = useState<UserCategory>(() => {
    const prof = getStoredProfile();
    return prof?.category || 'prospective';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredSession());
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage());

  // Routing and parameters
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});
  const [historyStack, setHistoryStack] = useState<string[]>([window.location.pathname || '/']);

  // Dynamic Domain Data
  const [programs, setPrograms] = useState<Program[]>(() => INITIAL_PROGRAMS);
  const [fees, setFees] = useState<FeeItem[]>(() => INITIAL_FEES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => INITIAL_CALENDAR_EVENTS);
  const [resources, setResources] = useState<ResourceDocument[]>(() => INITIAL_RESOURCES);

  // App & Chat Data
  const [conversations, setConversations] = useState<Conversation[]>(() => getStoredConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => getActiveConversationId());
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => getStoredSavedItems());
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => getStoredChecklist());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStoredNotifications());

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [isForceMockMode, setIsForceMockMode] = useState<boolean>(() => aiService.isForceMockMode());
  const [isSimulatingFailure, setIsSimulatingFailure] = useState<boolean>(() => aiService.isSimulatingFailure());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // Browser popstate handler
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((route: string, params?: Record<string, any>) => {
    if (params) {
      setRouteParams(params);
    }
    setHistoryStack(prev => [...prev, route]);
    if (window.location.pathname !== route) {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((route: string) => {
    navigateTo(route);
  }, [navigateTo]);

  const goBack = useCallback(() => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop(); // remove current
      const prevRoute = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      if (window.location.pathname !== prevRoute) {
        window.history.pushState({}, '', prevRoute);
      }
      setCurrentRoute(prevRoute);
    } else {
      navigateTo('/home');
    }
  }, [historyStack, navigateTo]);

  // Sync profile changes
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated: UserProfile = {
        id: prev?.id || `user-${Date.now()}`,
        name: updates.name !== undefined ? updates.name : (prev?.name || 'Ferdinand Tanyi'),
        email: updates.email !== undefined ? updates.email : (prev?.email || 'student@uniguide.edu.cm'),
        category: updates.category || prev?.category || userCategory,
        language: updates.language || prev?.language || language,
        ...prev,
        ...updates
      };
      saveStoredProfile(updated);
      if (updated.category) {
        setUserCategoryState(updated.category);
      }
      return updated;
    });
  }, [userCategory, language]);

  const setUserCategory = useCallback((category: UserCategory) => {
    setUserCategoryState(category);
    if (userProfile) {
      updateProfile({ category });
    }
  }, [userProfile, updateProfile]);

  const switchCategory = useCallback((targetCategory?: UserCategory) => {
    const nextCat: UserCategory = targetCategory !== undefined
      ? targetCategory
      : (userCategory === 'prospective' ? 'enrolled' : 'prospective');
    setUserCategory(nextCat);
    showToast(`Switched to ${nextCat === 'prospective' ? 'Prospective' : 'Enrolled'} Mode`);
  }, [userCategory, setUserCategory, showToast]);

  const loginDemo = useCallback((email: string, name?: string) => {
    saveStoredSession({ isLoggedIn: true, email });
    setIsLoggedIn(true);
    if (!userProfile) {
      updateProfile({
        name: name || 'Ferdinand Tanyi',
        email,
        category: userCategory,
        language
      });
    }
    showToast('Signed in successfully');
  }, [userProfile, userCategory, language, updateProfile, showToast]);

  const signupDemo = useCallback((name: string, email: string) => {
    saveStoredSession({ isLoggedIn: true, email });
    setIsLoggedIn(true);
    updateProfile({
      name,
      email,
      category: userCategory,
      language
    });
    showToast('Account created successfully');
  }, [userCategory, language, updateProfile, showToast]);

  const logout = useCallback(() => {
    clearStoredProfile();
    setUserProfile(null);
    setIsLoggedIn(false);
    showToast('Logged out');
    navigateTo('/');
  }, [navigateTo, showToast]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveStoredLanguage(lang);
    if (userProfile) {
      updateProfile({ language: lang });
    }
    showToast(lang === 'fr' ? 'Langue changée en Français' : 'Language switched to English');
  }, [userProfile, updateProfile, showToast]);

  // Active conversation helper
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createNewConversation = useCallback((): Conversation => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: language === 'fr' ? 'Nouvelle conversation' : 'New Orientation Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveStoredConversations(updated);
    setActiveConversationId(newConv.id);
    saveActiveConversationId(newConv.id);
    setAiError(null);
    return newConv;
  }, [conversations, language]);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    saveActiveConversationId(id);
    setAiError(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    saveStoredConversations(updated);
    if (activeConversationId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null;
      setActiveConversationId(nextId);
      saveActiveConversationId(nextId);
    }
    showToast('Conversation deleted');
  }, [conversations, activeConversationId, showToast]);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    saveStoredConversations([]);
    setActiveConversationId(null);
    saveActiveConversationId(null);
    showToast('Chat history cleared');
  }, [showToast]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setAiError(null);
    setLastFailedMessage(null);
    setIsAiLoading(true);

    let conv = activeConversation;
    if (!conv) {
      conv = createNewConversation();
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTitle = conv.messages.length === 0
      ? (trimmed.length > 32 ? trimmed.substring(0, 32) + '...' : trimmed)
      : conv.title;

    const convWithUserMsg: Conversation = {
      ...conv,
      title: updatedTitle,
      updatedAt: new Date().toISOString(),
      messages: [...conv.messages, userMsg]
    };

    const updatedConversations = conversations.map(c => c.id === conv!.id ? convWithUserMsg : c);
    if (!conversations.some(c => c.id === conv!.id)) {
      updatedConversations.unshift(convWithUserMsg);
    }
    setConversations(updatedConversations);
    saveStoredConversations(updatedConversations);

    try {
      const aiResponse = await aiService.sendMessage(
        trimmed,
        conv.messages,
        userProfile,
        language
      );

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: aiResponse.sources,
        suggestedFollowUps: aiResponse.suggestedFollowUps,
        evidenceStatus: aiResponse.evidenceStatus
      };

      const finalConv: Conversation = {
        ...convWithUserMsg,
        messages: [...convWithUserMsg.messages, assistantMsg],
        updatedAt: new Date().toISOString()
      };

      const finalConversations = updatedConversations.map(c => c.id === conv!.id ? finalConv : c);
      setConversations(finalConversations);
      saveStoredConversations(finalConversations);
    } catch (err: any) {
      console.error('AI send error:', err);
      const errMsg = err.message || 'An error occurred while generating a response.';
      setAiError(errMsg);
      setLastFailedMessage(trimmed);
      showToast('Error generating AI answer');
    } finally {
      setIsAiLoading(false);
    }
  }, [activeConversation, conversations, createNewConversation, userProfile, language, showToast]);

  const retryLastMessage = useCallback(async () => {
    if (lastFailedMessage) {
      const msg = lastFailedMessage;
      setLastFailedMessage(null);
      await sendMessage(msg);
    }
  }, [lastFailedMessage, sendMessage]);

  // Saved Items
  const toggleSaveItem = useCallback((item: { type: SavedItem['type']; title: string; subtitle?: string; data: any }) => {
    setSavedItems(prev => {
      const exists = prev.some(i => i.title.toLowerCase() === item.title.toLowerCase());
      let next: SavedItem[];
      if (exists) {
        next = prev.filter(i => i.title.toLowerCase() !== item.title.toLowerCase());
        showToast('Removed from saved items');
      } else {
        const newItem: SavedItem = {
          id: `saved-${Date.now()}`,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          data: item.data,
          savedAt: new Date().toLocaleDateString()
        };
        next = [newItem, ...prev];
        showToast('Saved to your collection');
      }
      saveStoredSavedItems(next);
      return next;
    });
  }, [showToast]);

  const saveItem = useCallback((item: any, type?: any) => {
    setSavedItems(prev => {
      const title = item.title || item.name || 'Saved Item';
      const itemType = item.type || type || 'resource';
      const exists = prev.some(i =>
        i.title.toLowerCase() === title.toLowerCase() ||
        (item.id && i.data?.id === item.id)
      );
      if (exists) return prev;
      const newItem: SavedItem = {
        id: item.id || `saved-${Date.now()}`,
        type: itemType,
        title: title,
        subtitle: item.subtitle || (item.degreeType ? `${item.degreeType} • ${item.facultyName}` : undefined),
        data: item.data || item,
        savedAt: new Date().toLocaleDateString()
      };
      const next = [newItem, ...prev];
      saveStoredSavedItems(next);
      showToast('Saved to your collection');
      return next;
    });
  }, [showToast]);

  const removeItem = useCallback((idOrTitle: string, _type?: any) => {
    setSavedItems(prev => {
      const next = prev.filter(i =>
        i.id !== idOrTitle &&
        i.data?.id !== idOrTitle &&
        i.title.toLowerCase() !== idOrTitle.toLowerCase()
      );
      saveStoredSavedItems(next);
      return next;
    });
    showToast('Removed from saved items');
  }, [showToast]);

  const isItemSaved = useCallback((typeOrTitle: string, idOrTitle?: string): boolean => {
    if (idOrTitle !== undefined) {
      return savedItems.some(i =>
        (i.data?.id === idOrTitle || i.id === idOrTitle || i.title.toLowerCase() === idOrTitle.toLowerCase()) &&
        (!typeOrTitle || i.type === typeOrTitle)
      );
    }
    return savedItems.some(i =>
      i.title.toLowerCase() === typeOrTitle.toLowerCase() ||
      i.id === typeOrTitle ||
      i.data?.id === typeOrTitle
    );
  }, [savedItems]);

  // Checklist
  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist(prev => {
      const next = prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
      saveStoredChecklist(next);
      return next;
    });
  }, []);

  const resetChecklist = useCallback(() => {
    setChecklist(prev => {
      const next = prev.map(item => ({ ...item, completed: false }));
      saveStoredChecklist(next);
      return next;
    });
    showToast('Admissions checklist reset');
  }, [showToast]);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveStoredNotifications(next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      saveStoredNotifications(next);
      return next;
    });
    showToast('All notifications marked as read');
  }, [showToast]);

  // Mode toggles
  const handleSetForceMockMode = useCallback((val: boolean) => {
    setIsForceMockMode(val);
    aiService.setForceMockMode(val);
    showToast(`Force Offline Mock Mode: ${val ? 'Enabled' : 'Disabled'}`);
  }, [showToast]);

  const handleSetSimulateFailure = useCallback((val: boolean) => {
    setIsSimulatingFailure(val);
    aiService.setSimulateFailure(val);
    showToast(`Simulate AI Failure: ${val ? 'Enabled' : 'Disabled'}`);
  }, [showToast]);

  const resetAppDemoData = useCallback(() => {
    resetAllDemoData();
    setUserProfile(null);
    setUserCategoryState('prospective');
    setIsLoggedIn(false);
    setConversations([]);
    setActiveConversationId(null);
    setSavedItems([]);
    setPrograms(INITIAL_PROGRAMS);
    setFees(INITIAL_FEES);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setResources(INITIAL_RESOURCES);
    setChecklist(getStoredChecklist());
    setNotifications(getStoredNotifications());
    showToast('Demo data reset to official defaults');
    navigateTo('/');
  }, [navigateTo, showToast]);

  // Admin CRUD operations
  const addProgram = useCallback((p: Program) => {
    setPrograms(prev => [p, ...prev]);
    showToast(`Added program "${p.name}"`);
  }, [showToast]);

  const deleteProgram = useCallback((id: string) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
    showToast('Program removed');
  }, [showToast]);

  const addFee = useCallback((f: FeeItem) => {
    setFees(prev => [f, ...prev]);
    showToast(`Fee schedule added for ${f.programName}`);
  }, [showToast]);

  const deleteFee = useCallback((id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
    showToast('Fee schedule item removed');
  }, [showToast]);

  const addCalendarEvent = useCallback((e: CalendarEvent) => {
    setCalendarEvents(prev => [e, ...prev]);
    showToast(`Added event "${e.title}"`);
  }, [showToast]);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Calendar event removed');
  }, [showToast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        userProfile,
        userCategory,
        isLoggedIn,
        language,
        currentRoute,
        routeParams,
        navigate,
        navigateTo,
        goBack,
        switchCategory,
        conversations,
        activeConversation,
        savedItems,
        checklist,
        notifications,
        unreadNotificationsCount: unreadCount,
        unreadNotificationCount: unreadCount,
        isAiLoading,
        isSendingMessage: isAiLoading,
        aiError,
        chatError: aiError,
        lastFailedMessage,
        isForceMockMode,
        isSimulatingFailure,
        simulateAiFailure: isSimulatingFailure,
        setSimulateAiFailure: handleSetSimulateFailure,
        toastMessage,
        showToast,
        programs,
        fees,
        calendarEvents,
        resources,
        addProgram,
        deleteProgram,
        addFee,
        deleteFee,
        addCalendarEvent,
        deleteCalendarEvent,
        setUserCategory,
        updateProfile,
        loginDemo,
        signupDemo,
        logout,
        setLanguage,
        createNewConversation,
        selectConversation,
        deleteConversation,
        clearAllConversations,
        sendMessage,
        retryLastMessage,
        saveItem,
        removeItem,
        toggleSaveItem,
        isItemSaved,
        toggleChecklistItem,
        resetChecklist,
        markNotificationRead,
        markNotificationAsRead: markNotificationRead,
        markAllNotificationsRead,
        markAllNotificationsAsRead: markAllNotificationsRead,
        clearUserData: resetAppDemoData,
        resetAppDemoData,
        resetAllData: resetAppDemoData,
        setForceMockMode: handleSetForceMockMode,
        setSimulateFailure: handleSetSimulateFailure
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
