import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredProfile,
  saveStoredProfile,
  clearStoredProfile,
  getStoredLanguage,
  saveStoredLanguage,
  getStoredSavedItems,
  saveStoredSavedItems,
  getStoredChecklist,
  saveStoredChecklist,
  resetAllDemoData
} from '../services/storageService';
import { UserProfile, SavedItem } from '../types';

describe('Storage and Profile Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return null when no profile is stored', () => {
    expect(getStoredProfile()).toBeNull();
  });

  it('should save and retrieve a valid user profile', () => {
    const profile: UserProfile = {
      id: 'test-user-1',
      name: 'Ferdinand Tanyi',
      email: 'ferdinand@uniguide.edu.cm',
      category: 'enrolled',
      language: 'en',
      level: 'Level 100',
      faculty: 'Faculty of Science',
      department: 'Computer Science'
    };
    saveStoredProfile(profile);

    const retrieved = getStoredProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Ferdinand Tanyi');
    expect(retrieved?.category).toBe('enrolled');
    expect(retrieved?.level).toBe('Level 100');
  });

  it('should clear stored profile and session', () => {
    const profile: UserProfile = {
      id: 'test-user-2',
      name: 'Sarah Bi',
      email: 'sarah@example.com',
      category: 'prospective',
      language: 'fr'
    };
    saveStoredProfile(profile);
    expect(getStoredProfile()).not.toBeNull();

    clearStoredProfile();
    expect(getStoredProfile()).toBeNull();
  });

  it('should persist and update language preference', () => {
    expect(getStoredLanguage()).toBe('en');
    saveStoredLanguage('fr');
    expect(getStoredLanguage()).toBe('fr');
  });

  it('should save, retrieve, and update saved items', () => {
    const item: SavedItem = {
      id: 'saved-1',
      type: 'program',
      title: 'Computer Science',
      savedAt: '2026-10-24',
      data: { name: 'Computer Science' }
    };
    saveStoredSavedItems([item]);

    const retrieved = getStoredSavedItems();
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].title).toBe('Computer Science');
  });

  it('should handle corrupted localStorage gracefully without crashing', () => {
    localStorage.setItem('xena_user_profile', 'MALFORMED_JSON_STRING{;');
    expect(getStoredProfile()).toBeNull();
  });

  it('should reset all demo data cleanly', () => {
    saveStoredLanguage('fr');
    saveStoredProfile({
      id: 'id-3',
      name: 'Test',
      email: 'test@test.com',
      category: 'prospective',
      language: 'en'
    });
    resetAllDemoData();
    expect(getStoredProfile()).toBeNull();
    expect(getStoredLanguage()).toBe('en');
  });
});
