import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import type { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export default function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const Icon = getCategoryIcon(transaction.category);
  const isPositive = transaction.amount > 0;
  const colorClass = getCategoryColor(transaction.category);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-slate-400">{formatDate(transaction.date)}</p>
          <span className="text-slate-300">·</span>
          <p className="text-xs text-slate-400 capitalize">{transaction.category}</p>
          {transaction.status === 'pending' && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-amber-600 font-medium">Pending</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold tabular-nums ${isPositive ? 'text-green-600' : 'text-slate-900'}`}>
          {formatCurrency(transaction.amount, { showSign: true })}
        </p>
        <p className="text-xs text-slate-400">{formatTime(transaction.date)}</p>
      </div>
    </button>
  );
}
