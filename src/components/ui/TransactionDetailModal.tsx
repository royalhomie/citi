import { MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import type { Transaction, Account } from '@/types';

interface TransactionDetailModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  accountName?: string;
}

export default function TransactionDetailModal({ open, onClose, transaction, accountName }: TransactionDetailModalProps) {
  if (!transaction) return null;

  const Icon = getCategoryIcon(transaction.category);
  const colorClass = getCategoryColor(transaction.category);
  const isPositive = transaction.amount > 0;

  return (
    <Modal open={open} onClose={onClose} title="Transaction Details">
      <div className="space-y-5">
        {/* Icon + amount */}
        <div className="flex flex-col items-center py-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${colorClass}`}>
            <Icon className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-400 mb-1">{transaction.description}</p>
          <p className={`text-3xl font-bold tabular-nums ${isPositive ? 'text-green-600' : 'text-slate-900'}`}>
            {formatCurrency(transaction.amount, { showSign: true })}
          </p>
          <div className={`flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            transaction.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {transaction.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5" />}
            <span className="capitalize">{transaction.status}</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Category</span>
            <span className="font-medium capitalize text-slate-700">{transaction.category}</span>
          </div>
          {transaction.merchant && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Merchant</span>
              <span className="font-medium text-slate-700">{transaction.merchant}</span>
            </div>
          )}
          {accountName && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Account</span>
              <span className="font-medium text-slate-700">{accountName}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Date</span>
            <span className="font-medium text-slate-700">{formatDate(transaction.date)} · {formatTime(transaction.date)}</span>
          </div>
          {transaction.location && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
              <span className="font-medium text-slate-700">{transaction.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Transaction ID</span>
            <span className="font-mono text-xs text-slate-500">{transaction.id.slice(0, 12)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-sm transition-colors">
            Report Issue
          </button>
          <button className="flex-1 py-3 bg-citi-600 hover:bg-citi-700 text-white rounded-xl font-medium text-sm transition-colors">
            Download Receipt
          </button>
        </div>
      </div>
    </Modal>
  );
}
