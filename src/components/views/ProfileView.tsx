import {
  User, Mail, Phone, Shield, Bell, CreditCard, HelpCircle, LogOut,
  ChevronRight, Gift, Settings, Fingerprint, Globe, Moon, Star,
  type LucideIcon,
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { USER } from '@/lib/user';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types';

interface ProfileViewProps {
  accounts: Account[];
  onNavigate: (view: 'cards') => void;
  onSignOut?: () => void;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  value: string;
  action?: () => void;
  danger?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function ProfileView({ accounts, onNavigate, onSignOut }: ProfileViewProps) {
  const totalBalance = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((s, a) => s + Number(a.balance), 0);

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', value: USER.name },
        { icon: Mail, label: 'Email', value: USER.email },
        { icon: CreditCard, label: 'Linked Cards', value: '3 cards', action: () => onNavigate('cards') },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: Fingerprint, label: 'Biometric Login', value: 'Enabled' },
        { icon: Shield, label: 'Two-Factor Authentication', value: 'Active' },
        { icon: Settings, label: 'Privacy & Permissions', value: '' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On' },
        { icon: Globe, label: 'Language', value: 'English' },
        { icon: Moon, label: 'Dark Mode', value: 'Off' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', value: '' },
        { icon: Star, label: 'Rate the App', value: '' },
        { icon: LogOut, label: 'Sign Out', value: '', danger: true, action: onSignOut },
      ],
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-2xl mx-auto animate-fade-in">
      {/* Profile header card */}
      <div className="bg-gradient-to-br from-citi-950 via-citi-900 to-citi-800 rounded-3xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-citi-500/10" />
        <div className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-citi-500/10" />

        <div className="relative">
          <Avatar size="xl" className="mx-auto ring-4 ring-white/10" />
          <h2 className="text-xl font-bold mt-4">{USER.name}</h2>
          <p className="text-sm text-citi-200 mt-0.5">{USER.email}</p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs bg-amber-400/20 text-amber-300 px-3 py-1.5 rounded-full font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              {USER.tier}
            </span>
            <span className="text-xs text-citi-300">Member since {USER.memberSince}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-xs text-citi-200 mb-1">Total Balance</p>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-xs text-citi-200 mb-1">Reward Points</p>
              <p className="text-lg font-bold tabular-nums text-amber-300">
                {USER.rewardsPoints.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm">{USER.rewardsPoints.toLocaleString()} Points Available</p>
            <p className="text-xs text-white/80">Redeem for travel, cash back, and more</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60" />
      </div>

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl card-shadow overflow-hidden">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 pt-4 pb-2">
            {section.title}
          </p>
          <div className="divide-y divide-slate-50">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.danger ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.danger ? 'text-red-500' : 'text-slate-900'}`}>
                      {item.label}
                    </p>
                    {item.value && (
                      <p className="text-xs text-slate-400 truncate">{item.value}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-center text-xs text-slate-400 pt-2">
        Citibank Mobile Banking · Version 2.4.1
      </p>
    </div>
  );
}
