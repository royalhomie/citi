import { LayoutDashboard, Wallet, CreditCard, ArrowLeftRight, PieChart, User } from 'lucide-react';
import CitiLogo from '@/components/ui/CitiLogo';
import Avatar from '@/components/ui/Avatar';
import type { ViewName } from '@/types';
import { USER } from '@/lib/user';

interface SidebarProps {
  current: ViewName;
  onNavigate: (view: ViewName) => void;
}

const navItems: { id: ViewName; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
];

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-citi-950 text-white h-screen sticky top-0 shrink-0">
      <div className="px-6 py-6 flex items-center gap-3">
        <CitiLogo size={40} variant="light" />
        <div>
          <p className="font-bold text-lg leading-tight">Citibank</p>
          <p className="text-[11px] text-citi-300">Mobile Banking</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 text-[11px] uppercase tracking-wider text-citi-400/60 font-semibold mb-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-citi-500 text-white shadow-lg shadow-citi-500/30'
                  : 'text-citi-200 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </button>
          );
        })}
        <p className="px-3 text-[11px] uppercase tracking-wider text-citi-400/60 font-semibold mb-2 mt-4">Account</p>
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
            current === 'profile'
              ? 'bg-citi-500 text-white shadow-lg shadow-citi-500/30'
              : 'text-citi-200 hover:bg-white/5 hover:text-white'
          }`}
        >
          <User className="w-5 h-5 shrink-0" />
          Profile
        </button>
      </nav>

      <button
        onClick={() => onNavigate('profile')}
        className="p-4 m-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-left"
      >
        <div className="flex items-center gap-3 mb-3">
          <Avatar size="md" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{USER.name}</p>
            <p className="text-xs text-citi-300 truncate">{USER.email}</p>
          </div>
        </div>
        <div className="text-xs text-citi-400">
          <p>{USER.tier}</p>
          <p className="text-citi-300/60 mt-1">Member since {USER.memberSince}</p>
        </div>
      </button>
    </aside>
  );
}
