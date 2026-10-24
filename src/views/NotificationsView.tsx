import React from 'react';
import { ArrowLeft, Bell, Check, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    goBack,
    navigateTo
  } = useApp();

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.actionRoute) {
      navigateTo(notif.actionRoute);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'academic':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#17233B] tracking-tight">
              Notifications
            </h1>
            <p className="text-xs text-slate-500">Official university bulletins & reminders</p>
          </div>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-[#1463F3] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E1E8F2] p-6 shadow-2xs">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 mb-1">No notifications</p>
          <p className="text-xs text-slate-400">You're all caught up with university announcements.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white border-[#E1E8F2] opacity-80'
                  : 'bg-blue-50/40 border-blue-200 shadow-2xs'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-xs font-bold ${notif.read ? 'text-[#17233B]' : 'text-[#1463F3]'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-normal">
                  {notif.message}
                </p>

                {notif.actionRoute && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-[#1463F3] hover:underline">
                    View Details &rarr;
                  </span>
                )}
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[#1463F3] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
