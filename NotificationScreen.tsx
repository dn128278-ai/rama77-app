import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Megaphone,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { backendApiStore, AppNotification } from '../../data/backendApiStore';

interface NotificationScreenProps {
  onBack: () => void;
  darkMode?: boolean;
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  onBack,
  darkMode = false,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    backendApiStore.getNotifications()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNotifDetail, setSelectedNotifDetail] = useState<AppNotification | null>(null);

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setNotifications(backendApiStore.getNotifications());
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    backendApiStore.markAllNotificationsAsRead();
  };

  const handleClearAll = () => {
    backendApiStore.clearAllNotifications();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      backendApiStore.markNotificationAsRead(notif.id);
    }
    setSelectedNotifDetail(notif);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'admin') return n.category === 'admin_notice';
    if (selectedCategory === 'market') return n.category === 'market_update';
    if (selectedCategory === 'offer') return n.category === 'bonus_offer';
    if (selectedCategory === 'urgent') return n.priority === 'high' || n.category === 'urgent';
    return true;
  });

  const getCategoryBadge = (category: AppNotification['category'], priority?: string) => {
    if (priority === 'high' || category === 'urgent') {
      return {
        label: 'Urgent Alert',
        icon: AlertTriangle,
        bg: 'bg-red-500/15 text-red-600 border-red-300 dark:border-red-900',
        dot: 'bg-red-500',
      };
    }
    switch (category) {
      case 'admin_notice':
        return {
          label: 'Admin Notice',
          icon: Megaphone,
          bg: 'bg-orange-500/15 text-[#F16521] border-orange-300 dark:border-orange-900',
          dot: 'bg-[#F16521]',
        };
      case 'market_update':
        return {
          label: 'Market Alert',
          icon: Clock,
          bg: 'bg-blue-500/15 text-blue-600 border-blue-300 dark:border-blue-900',
          dot: 'bg-blue-500',
        };
      case 'bonus_offer':
        return {
          label: 'Special Offer',
          icon: Sparkles,
          bg: 'bg-emerald-500/15 text-emerald-600 border-emerald-300 dark:border-emerald-900',
          dot: 'bg-emerald-500',
        };
      case 'result_declared':
        return {
          label: 'Result Out',
          icon: Award,
          bg: 'bg-amber-500/15 text-amber-600 border-amber-300 dark:border-amber-900',
          dot: 'bg-amber-500',
        };
      default:
        return {
          label: 'Notice',
          icon: Bell,
          bg: 'bg-zinc-500/15 text-zinc-600 border-zinc-300 dark:border-zinc-800',
          dot: 'bg-zinc-400',
        };
    }
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden select-none relative ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#F4F5F7] text-zinc-900'
      }`}
    >
      {/* Top Header Bar matching native Android emulator */}
      <div
        className={`px-3.5 py-2.5 flex items-center justify-between border-b shrink-0 shadow-2xs ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200/90'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-[#E85D04] hover:bg-[#d85404] active:scale-95 flex items-center justify-center text-white transition-all shadow-xs cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base tracking-tight text-zinc-900 dark:text-white leading-tight">
                Notices &amp; Alerts
              </h2>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#F16521] text-white text-[10px] font-black">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Live broadcast announcements from Admin
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 hover:text-[#F16521] transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              title="Clear all notices"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div
        className={`px-3 py-2 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 ${
          darkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200/70'
        }`}
      >
        {[
          { id: 'all', label: 'All Notices' },
          { id: 'admin', label: 'Admin Desk' },
          { id: 'market', label: 'Market Timings' },
          { id: 'offer', label: 'Offers & Bonuses' },
          { id: 'urgent', label: 'Urgent' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#F16521] text-white shadow-xs'
                : darkMode
                ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-zinc-900 flex items-center justify-center text-[#F16521]">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
                No Notices Right Now
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px] mt-1 leading-relaxed">
                Jab bhi Admin Panel se koi naya notice ya market update aayega, woh turant yahan dikhega!
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const badge = getCategoryBadge(notif.category, notif.priority);
            const Icon = badge.icon;
            const isUnread = !notif.isRead;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`rounded-2xl p-3.5 border transition-all cursor-pointer shadow-2xs relative overflow-hidden ${
                  darkMode
                    ? isUnread
                      ? 'bg-zinc-900 border-orange-500/40 hover:border-orange-500'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900'
                    : isUnread
                    ? 'bg-white border-orange-300 shadow-orange-100/50 hover:border-orange-400'
                    : 'bg-white/90 border-zinc-200/80 hover:bg-white'
                }`}
              >
                {/* Unread Accent Bar */}
                {isUnread && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#F16521]" />
                )}

                {/* Top Row: Category Badge + Timestamp + Unread Dot */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#F16521] animate-pulse" />
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-400 font-medium">
                    {notif.timestamp}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-xs font-bold leading-snug mb-1 ${
                    isUnread
                      ? 'text-zinc-900 dark:text-white font-extrabold'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {notif.title}
                </h3>

                {/* Message Body */}
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {notif.message}
                </p>

                {/* Bottom Footer Actions */}
                <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono">{notif.date}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        backendApiStore.deleteNotification(notif.id);
                      }}
                      className="hover:text-red-500 cursor-pointer p-0.5"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-orange-500 font-bold flex items-center gap-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal / Dialog for Detailed Notice View (strictly contained in emulator) */}
      {selectedNotifDetail && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div
            className={`w-full max-w-[320px] rounded-3xl p-5 shadow-2xl border space-y-3.5 ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-[#F16521] flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block">
                    Official Notice
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {selectedNotifDetail.date} · {selectedNotifDetail.timestamp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotifDetail(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="font-extrabold text-sm leading-snug">
                {selectedNotifDetail.title}
              </h3>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/80 dark:border-zinc-800 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap max-h-56 overflow-y-auto">
                {selectedNotifDetail.message}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedNotifDetail(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F16521] to-[#E05410] text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-transform text-center"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
