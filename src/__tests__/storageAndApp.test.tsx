import { describe, it, expect, beforeEach } from 'vitest';
import * as storage from '../services/storageService';
import { UserProfile, SavedItem } from '../types';

describe('Storage Service & Domain Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves user profile correctly', () => {
    expect(storage.getStoredProfile()).toBeNull();

    const profile: UserProfile = {
      id: 'test-1',
      name: 'Ferdinand Tanyi',
      email: 'ferdinand@example.com',
      category: 'enrolled',
      language: 'en',
      faculty: 'Faculty of Science',
      department: 'Computer Science',
      level: 'Level 100',
    };

    storage.saveStoredProfile(profile);
    const retrieved = storage.getStoredProfile();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Ferdinand Tanyi');
    expect(retrieved?.category).toBe('enrolled');
    expect(retrieved?.level).toBe('Level 100');
  });

  it('handles saved items without duplicates', () => {
    const item1: SavedItem = {
      id: 's-1',
      type: 'program',
      title: 'Computer Science',
      data: { id: 'prog-cs' },
      savedAt: '2025-10-24'
    };

    storage.saveStoredSavedItems([item1]);
    const items = storage.getStoredSavedItems();
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Computer Science');
  });

  it('persists and toggles checklist items properly', () => {
    const checklist = storage.getStoredChecklist();
    expect(checklist.length).toBeGreaterThan(0);

    const firstItem = checklist[0];
    const initialStatus = firstItem.completed;

    const modified = checklist.map(c => c.id === firstItem.id ? { ...c, completed: !initialStatus } : c);
    storage.saveStoredChecklist(modified);

    const retrieved = storage.getStoredChecklist();
    expect(retrieved[0].completed).toBe(!initialStatus);
  });

  it('resets all demo data cleanly', () => {
    storage.saveStoredProfile({
      id: 'temp',
      name: 'Test',
      email: 'test@test.com',
      category: 'prospective',
      language: 'en'
    });

    storage.resetAllDemoData();
    expect(storage.getStoredProfile()).toBeNull();
  });
});
