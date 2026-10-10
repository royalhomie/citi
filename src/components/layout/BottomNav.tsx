import { Home, Wallet, CreditCard, ArrowLeftRight, PieChart, User } from 'lucide-react';
import type { ViewName } from '@/types';

interface BottomNavProps {
  current: ViewName;
  onNavigate: (view: ViewName) => void;
}

const navItems: { id: ViewName; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'transactions', label: 'Activity', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Insights', icon: PieChart },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-1 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-1.5 min-w-[52px] transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  active ? 'text-citi-600' : 'text-slate-400'
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[9px] font-medium transition-colors ${
                  active ? 'text-citi-600' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {active && <div className="w-1 h-1 rounded-full bg-citi-600 -mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
