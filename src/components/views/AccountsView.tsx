import { TrendingUp, ArrowUpRight, Copy } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import Skeleton from '@/components/ui/Skeleton';
import type { Account } from '@/types';

interface AccountsViewProps {
  accounts: Account[];
  loading: boolean;
  onTransfer: () => void;
}

export default function AccountsView({ accounts, loading, onTransfer }: AccountsViewProps) {
  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-4 pb-24 lg:pb-8 max-w-3xl mx-auto">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  const totalAssets = accounts.filter((a) => a.type !== 'credit').reduce((s, a) => s + Number(a.balance), 0);

  return (
    <div className="p-4 lg:p-8 space-y-4 pb-24 lg:pb-8 max-w-3xl mx-auto animate-fade-in">
      {/* Total Summary */}
      <div className="bg-gradient-to-br from-citi-700 to-citi-900 rounded-3xl p-6 text-white">
        <p className="text-sm text-citi-200 mb-1">Total Assets</p>
        <p className="text-3xl font-bold tabular-nums mb-4">{formatCurrency(totalAssets)}</p>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">+2.4%</span>
          <span className="text-citi-300 text-xs">vs last month</span>
        </div>
      </div>

      {/* Account Cards */}
      {accounts.map((account) => {
        const isCredit = account.type === 'credit';
        return (
          <div key={account.id} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCredit
                      ? 'bg-orange-50 text-orange-600'
                      : account.type === 'savings'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-citi-50 text-citi-600'
                  }`}
                >
                  {isCredit ? <ArrowUpRight className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{account.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{account.type} Account</p>
                </div>
              </div>
              <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {account.currency}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Current Balance</p>
                <p className="text-xl font-bold tabular-nums text-slate-900">
                  {formatCurrency(Number(account.balance))}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Available</p>
                <p className="text-xl font-bold tabular-nums text-slate-900">
                  {formatCurrency(Number(account.available_balance))}
                </p>
              </div>
            </div>

            {account.type === 'savings' && account.interest_rate > 0 && (
              <div className="bg-emerald-50 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
                <span className="text-sm text-emerald-700 font-medium">Annual Percentage Yield</span>
                <span className="text-sm font-bold text-emerald-700">{account.interest_rate}% APY</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Account Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-medium text-slate-700">{account.account_number}</p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(account.account_number)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Routing Number</p>
                <p className="font-mono font-medium text-slate-700">{account.routing_number}</p>
              </div>
            </div>

            <button
              onClick={onTransfer}
              className="w-full mt-4 py-3 bg-citi-600 hover:bg-citi-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              Transfer Money
            </button>
          </div>
        );
      })}
    </div>
  );
}
