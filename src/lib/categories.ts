import {
  ShoppingCart,
  UtensilsCrossed,
  Car,
  Film,
  Zap,
  Heart,
  ArrowDownToLine,
  ArrowLeftRight,
  CreditCard,
  Wallet,
  Plane,
  ShoppingBag,
  Coffee,
  Smartphone,
  Banknote,
  Receipt,
  type LucideIcon,
} from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  groceries: ShoppingCart,
  dining: UtensilsCrossed,
  transport: Car,
  entertainment: Film,
  utilities: Zap,
  health: Heart,
  deposit: ArrowDownToLine,
  transfer: ArrowLeftRight,
  payment: CreditCard,
  shopping: ShoppingBag,
  travel: Plane,
  coffee: Coffee,
  subscription: Smartphone,
  cash: Banknote,
  other: Receipt,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] || Wallet;
}

export const categoryColors: Record<string, string> = {
  groceries: 'bg-emerald-100 text-emerald-700',
  dining: 'bg-orange-100 text-orange-700',
  transport: 'bg-blue-100 text-blue-700',
  entertainment: 'bg-pink-100 text-pink-700',
  utilities: 'bg-amber-100 text-amber-700',
  health: 'bg-red-100 text-red-700',
  deposit: 'bg-green-100 text-green-700',
  transfer: 'bg-indigo-100 text-indigo-700',
  payment: 'bg-cyan-100 text-cyan-700',
  shopping: 'bg-purple-100 text-purple-700',
  travel: 'bg-sky-100 text-sky-700',
  cash: 'bg-gray-100 text-gray-700',
  other: 'bg-slate-100 text-slate-700',
};

export function getCategoryColor(category: string): string {
  return categoryColors[category] || 'bg-slate-100 text-slate-700';
}
