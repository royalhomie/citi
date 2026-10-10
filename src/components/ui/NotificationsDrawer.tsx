import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Shield, Gift, FileText, AlertTriangle, ArrowDownToLine, Target, Trash2 } from 'lucide-react';
import { bankingActions } from '@/hooks/useBankingData';
import { formatTime } from '@/lib/format';
import type { Notification } from '@/types';

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRefresh: () => void;
}

const iconMap: Record<string, typeof Bell> = {
  bell: Bell,
  shield: Shield,
  gift: Gift,
  'file-text': FileText,
  'alert-triangle': AlertTriangle,
  'arrow-down': ArrowDownToLine,
  target: Target,
};

const typeColors: Record<string, string> = {
  transaction: 'bg-emerald-100 text-emerald-600',
  security: 'bg-red-100 text-red-600',
  reward: 'bg-amber-100 text-amber-600',
  info: 'bg-citi-100 text-citi-600',
  alert: 'bg-orange-100 text-orange-600',
};

export default function NotificationsDrawer({ open, onClose, notifications, onRefresh }: NotificationsDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  const markAllRead = () => {
    if (!notifications.some((n) => !n.is_read)) return;
    bankingActions.markAllNotificationsRead();
    onRefresh();
  };

  const markRead = (id: string) => {
    bankingActions.markNotificationRead(id);
    onRefresh();
  };

  const removeNotification = (id: string) => {
    bankingActions.removeNotification(id);
    onRefresh();
  };

  if (!open) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slide-down flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-citi-600 font-medium">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-citi-600 font-medium hover:text-citi-700 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No notifications</p>
              <p className="text-xs text-slate-400 mt-1">You're all caught up</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = iconMap[n.icon] || Bell;
              const colorClass = typeColors[n.type] || 'bg-slate-100 text-slate-600';
              return (
                <div
                  key={n.id}
                  className={`group relative p-4 rounded-xl transition-colors ${
                    n.is_read ? 'bg-white' : 'bg-citi-50/50'
                  } hover:bg-slate-50`}
                >
                  {!n.is_read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-citi-500" />}
                  <div className="flex items-start gap-3 pl-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => !n.is_read && markRead(n.id)}>
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[11px] text-slate-400 mt-1.5">{formatTime(n.created_at)}</p>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
