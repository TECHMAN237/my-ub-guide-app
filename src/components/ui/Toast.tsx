import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[420px] -translate-x-1/2 rounded-[10px] border border-rule bg-raised px-4 py-3 text-[14px] text-ink md:bottom-8"
    >
      {toastMessage}
    </div>
  );
};
