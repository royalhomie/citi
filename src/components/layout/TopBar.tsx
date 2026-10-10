import { Bell, Search } from 'lucide-react';
import CitiLogo from '@/components/ui/CitiLogo';
import Avatar from '@/components/ui/Avatar';

interface TopBarProps {
  title: string;
  unreadCount: number;
  onBellClick: () => void;
  onProfileClick: () => void;
}

export default function TopBar({ title, unreadCount, onBellClick, onProfileClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 glass border-b border-slate-200/60 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <CitiLogo size={36} />
          </div>
          <h1 className="text-lg lg:text-2xl font-bold text-slate-900">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={onBellClick}
            className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            )}
          </button>
          <button onClick={onProfileClick} className="hidden lg:block">
            <Avatar size="md" className="hover:ring-2 hover:ring-citi-300 transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
}
