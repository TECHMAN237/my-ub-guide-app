import {
  UserProfile,
  UserCategory,
  Language,
  Conversation,
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
  INITIAL_RESOURCES,
  INITIAL_CHECKLIST,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const KEYS = {
  USER_PROFILE: 'xena_user_profile',
  ACTIVE_SESSION: 'xena_active_session',
  CONVERSATIONS: 'xena_conversations',
  ACTIVE_CONVERSATION_ID: 'xena_active_conv_id',
  SAVED_ITEMS: 'xena_saved_items',
  CHECKLIST: 'xena_checklist',
  NOTIFICATIONS: 'xena_notifications',
  PROGRAMS: 'xena_programs',
  FEES: 'xena_fees',
  CALENDAR: 'xena_calendar',
  RESOURCES: 'xena_resources',
  LANGUAGE: 'xena_lang',
  APP_INITIALIZED: 'xena_app_initialized',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}", using default.`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key "${key}".`, e);
  }
}

// User Profile
export function getStoredProfile(): UserProfile | null {
  return safeGet<UserProfile | null>(KEYS.USER_PROFILE, null);
}

export function saveStoredProfile(profile: UserProfile): void {
  safeSet(KEYS.USER_PROFILE, profile);
}

export function clearStoredProfile(): void {
  localStorage.removeItem(KEYS.USER_PROFILE);
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
}

// Auth demo session
export function getStoredSession(): { isLoggedIn: boolean; email: string } | null {
  return safeGet<{ isLoggedIn: boolean; email: string } | null>(KEYS.ACTIVE_SESSION, null);
}

export function saveStoredSession(session: { isLoggedIn: boolean; email: string }): void {
  safeSet(KEYS.ACTIVE_SESSION, session);
}

// Language
export function getStoredLanguage(): Language {
  return safeGet<Language>(KEYS.LANGUAGE, 'en');
}

export function saveStoredLanguage(lang: Language): void {
  safeSet(KEYS.LANGUAGE, lang);
}

// Conversations
export function getStoredConversations(): Conversation[] {
  return safeGet<Conversation[]>(KEYS.CONVERSATIONS, []);
}

export function saveStoredConversations(conversations: Conversation[]): void {
  safeSet(KEYS.CONVERSATIONS, conversations);
}

export function getActiveConversationId(): string | null {
  return safeGet<string | null>(KEYS.ACTIVE_CONVERSATION_ID, null);
}

export function saveActiveConversationId(id: string | null): void {
  safeSet(KEYS.ACTIVE_CONVERSATION_ID, id);
}

// Saved items
export function getStoredSavedItems(): SavedItem[] {
  return safeGet<SavedItem[]>(KEYS.SAVED_ITEMS, []);
}

export function saveStoredSavedItems(items: SavedItem[]): void {
  safeSet(KEYS.SAVED_ITEMS, items);
}

// Checklist
export function getStoredChecklist(): ChecklistItem[] {
  return safeGet<ChecklistItem[]>(KEYS.CHECKLIST, INITIAL_CHECKLIST);
}

export function saveStoredChecklist(items: ChecklistItem[]): void {
  safeSet(KEYS.CHECKLIST, items);
}

// Notifications
export function getStoredNotifications(): NotificationItem[] {
  return safeGet<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function saveStoredNotifications(items: NotificationItem[]): void {
  safeSet(KEYS.NOTIFICATIONS, items);
}

// Editable demo data (programs, fees, events, resources)
export function getStoredPrograms(): Program[] {
  return safeGet<Program[]>(KEYS.PROGRAMS, INITIAL_PROGRAMS);
}

export function saveStoredPrograms(programs: Program[]): void {
  safeSet(KEYS.PROGRAMS, programs);
}

export function getStoredFees(): FeeItem[] {
  return safeGet<FeeItem[]>(KEYS.FEES, INITIAL_FEES);
}

export function saveStoredFees(fees: FeeItem[]): void {
  safeSet(KEYS.FEES, fees);
}

export function getStoredCalendarEvents(): CalendarEvent[] {
  return safeGet<CalendarEvent[]>(KEYS.CALENDAR, INITIAL_CALENDAR_EVENTS);
}

export function saveStoredCalendarEvents(events: CalendarEvent[]): void {
  safeSet(KEYS.CALENDAR, events);
}

export function getStoredResources(): ResourceDocument[] {
  return safeGet<ResourceDocument[]>(KEYS.RESOURCES, INITIAL_RESOURCES);
}

export function saveStoredResources(resources: ResourceDocument[]): void {
  safeSet(KEYS.RESOURCES, resources);
}

// Master demo reset
export function resetAllDemoData(): void {
  localStorage.clear();
}
