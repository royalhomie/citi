import { ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine, Smartphone } from 'lucide-react';

interface QuickActionsProps {
  onTransfer: () => void;
  onDeposit: () => void;
  onPay: () => void;
}

export default function QuickActions({ onTransfer, onDeposit, onPay }: QuickActionsProps) {
  const actions = [
    { label: 'Transfer', icon: ArrowLeftRight, onClick: onTransfer, color: 'bg-citi-50 text-citi-600' },
    { label: 'Deposit', icon: ArrowDownToLine, onClick: onDeposit, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pay Bills', icon: ArrowUpFromLine, onClick: onPay, color: 'bg-amber-50 text-amber-600' },
    { label: 'Send', icon: Smartphone, onClick: onTransfer, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 ${action.color}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-700">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
