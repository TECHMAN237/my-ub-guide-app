import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { HomeChatView } from '../views/HomeChatView';

const data = vi.hoisted(() => ({ value: {} as any }));
vi.mock('../context/AppContext', () => ({ useApp: () => data.value }));
vi.mock('../components/chat/ChatComposer', () => ({ ChatComposer: () => <input aria-label="Your question" /> }));
afterEach(cleanup);

const context = () => ({
  language: 'en', userCategory: 'enrolled', userProfile: null, activeConversation: null,
  conversations: [], checklist: [], calendarEvents: [], navigateTo: vi.fn(),
  sendMessage: vi.fn(), selectConversation: vi.fn(),
});

describe('Home guidance uses the latest actual information', () => {
  it('selects the earliest ongoing or upcoming milestone despite insertion order', () => {
    data.value = { ...context(), calendarEvents: [
      { title: 'Later exams', status: 'upcoming', startDate: '2027-06-01', displayDate: 'June' },
      { title: 'Old deadline', status: 'completed', startDate: '2026-01-01', displayDate: 'January' },
      { title: 'Registration now', status: 'ongoing', startDate: '2026-11-01', displayDate: 'November' },
    ] };
    render(<HomeChatView />);
    expect(screen.getByText('Registration now')).toBeTruthy();
    expect(screen.queryByText('Later exams')).toBeNull();
  });

  it('orders unique recent questions by message timestamp across conversations', () => {
    const message = (text: string, timestamp: string) => ({ text, timestamp, sender: 'user' });
    data.value = { ...context(), conversations: [
      { id: 'new', title: 'New chat', updatedAt: '2026-11-04T12:00:00Z', messages: [message('Newest question', '2026-11-04T12:00:00Z'), message('Repeated question', '2026-11-04T11:00:00Z')] },
      { id: 'old', title: 'Old chat', updatedAt: '2026-11-01T12:00:00Z', messages: [message('Oldest question', '2026-11-01T12:00:00Z'), message('Repeated question', '2026-11-01T11:00:00Z'), message('Third question', '2026-11-02T12:00:00Z')] },
    ] };
    const { container } = render(<HomeChatView />);
    const questions = [...container.querySelectorAll('.questions-panel .question-row span')].map((node) => node.textContent);
    expect(questions).toEqual(['Newest question', 'Repeated question', 'Third question']);
  });
});
