import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface BalanceDisplayProps {
  amount: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function BalanceDisplay({ amount, label, size = 'lg', className = '' }: BalanceDisplayProps) {
  const [visible, setVisible] = useState(true);

  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  };

  return (
    <div className={className}>
      {label && <p className="text-sm text-slate-400 mb-1 font-medium">{label}</p>}
      <div className="flex items-center gap-3">
        <span className={`${sizes[size]} font-bold tracking-tight tabular-nums`}>
          {visible ? formatCurrency(amount) : '••••••'}
        </span>
        <button
          onClick={() => setVisible(!visible)}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label={visible ? 'Hide balance' : 'Show balance'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
