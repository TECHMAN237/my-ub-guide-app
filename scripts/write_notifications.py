"""Write the new NotificationsView.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'views', 'NotificationsView.tsx'))

JSX = r'''import React from 'react';
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { goBack, navigateTo } = useApp();

  const notifications = [
    { id: 'n1', type: 'info' as const, title: 'Admission application open', body: 'Online applications are now open for the 2025/2026 session.', time: '2 hours ago', icon: FileText },
    { id: 'n2', type: 'reminder' as const, title: 'Registration deadline approaching', body: 'Late registration will incur additional fees. Complete your registration by 20 September.', time: '1 day ago', icon: Calendar },
    { id: 'n3', type: 'success' as const, title: 'Application submitted', body: 'Your admission application has been successfully submitted.', time: '2 days ago', icon: CheckCircle2 },
    { id: 'n4', type: 'alert' as const, title: 'Account requires verification', body: 'Your email address requires verification. Please check your inbox.', time: '3 days ago', icon: AlertCircle },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink hover:bg-raised transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Notifications</h1>
          <p className="text-xs text-muted">Important updates and reminders for your academic journey.</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => (
          <div
            key={i}
            className="bg-surface border border-ink/10 rounded-2xl p-4 shadow-2xs"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                {notif.type === 'info' && <FileText className="w-4 h-4" />}
                {notif.type === 'reminder' && <Calendar className="w-4 h-4" />}
                {notif.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {notif.type === 'alert' && <AlertCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink truncate">{notif.title}</h3>
                <p className="text-xs text-muted truncate">{notif.body}</p>
                <span className="text-[10px] text-muted mt-1">{notif.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
