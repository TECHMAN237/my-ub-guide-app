import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

type NotificationKind = 'info' | 'reminder' | 'success' | 'alert';

const KIND_LABELS: Record<NotificationKind, string> = {
  info: 'Update',
  reminder: 'Reminder',
  success: 'Confirmed',
  alert: 'Action needed',
};

export const NotificationsView: React.FC = () => {
  const { goBack } = useApp();

  const notifications: {
    id: string;
    type: NotificationKind;
    title: string;
    body: string;
    time: string;
  }[] = [
    {
      id: 'n1',
      type: 'info',
      title: 'Admission applications are open',
      body: 'Online applications are now open for the 2025/2026 session.',
      time: '2 hours ago',
    },
    {
      id: 'n2',
      type: 'reminder',
      title: 'Registration deadline approaching',
      body: 'Late registration incurs additional fees. Complete your registration by 20 September.',
      time: '1 day ago',
    },
    {
      id: 'n3',
      type: 'success',
      title: 'Application submitted',
      body: 'Your admission application has been submitted successfully.',
      time: '2 days ago',
    },
    {
      id: 'n4',
      type: 'alert',
      title: 'Account needs verification',
      body: 'Your email address has not been verified. Check your inbox.',
      time: '3 days ago',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-28 pt-4 sm:px-8 md:pb-16">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={goBack}
          className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 pt-1">
          <h1 className="page-title text-ink">Notifications</h1>
          <p className="page-lede mt-1">Updates and reminders about your application.</p>
        </div>
      </div>

      <div className="mt-6">
        {notifications.map((notification) => (
          <article key={notification.id} className="border-t border-rule py-4 first:border-t-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <p className="text-[14px] text-muted">{KIND_LABELS[notification.type]}</p>
              <p className="text-[14px] text-muted">{notification.time}</p>
            </div>
            <h2 className="mt-1 text-[16px] font-medium text-ink">{notification.title}</h2>
            <p className="measure mt-0.5 text-[16px] leading-relaxed text-muted">
              {notification.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
