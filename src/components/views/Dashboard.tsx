import { TrendingUp, TrendingDown, ArrowUpRight, Gift } from 'lucide-react';
import BalanceDisplay from '@/components/ui/BalanceDisplay';
import BankCard from '@/components/ui/BankCard';
import QuickActions from '@/components/ui/QuickActions';
import TransactionItem from '@/components/ui/TransactionItem';
import TransactionDetailModal from '@/components/ui/TransactionDetailModal';
import SavingsGoals from '@/components/ui/SavingsGoals';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';
import { formatCurrency } from '@/lib/format';
import { USER, getGreeting } from '@/lib/user';
import { useState } from 'react';
import type { Account, Transaction, Card, Goal } from '@/types';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  goals: Goal[];
  loading: boolean;
  onTransfer: () => void;
  onDeposit: () => void;
  onPay: () => void;
  onViewAllTransactions: () => void;
  onCardClick: () => void;
  onProfileClick: () => void;
  onRefresh: () => void;
}

export default function Dashboard({
  accounts, transactions, cards, goals, loading,
  onTransfer, onDeposit, onPay, onViewAllTransactions, onCardClick, onProfileClick, onRefresh,
}: DashboardProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const totalBalance = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const availableBalance = accounts
    .filter((a) => a.type !== 'credit')
    .reduce((sum, a) => sum + Number(a.available_balance), 0);

  const monthlyIncome = transactions
    .filter((t) => t.amount > 0 && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlySpending = transactions
    .filter((t) => t.amount < 0 && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const primaryCard = cards[0];
  const recentTransactions = transactions.slice(0, 6);

  const getAccountName = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.name || 'Unknown Account';

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-5xl mx-auto animate-fade-in">
      {/* Hero balance card */}
      <div className="relative bg-gradient-to-br from-citi-950 via-citi-900 to-citi-800 rounded-3xl p-6 lg:p-8 text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-citi-500/10" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-citi-500/10" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-citi-400/5" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar size="md" ring />
              <div>
                <p className="text-sm text-citi-200">{getGreeting()},</p>
                <p className="text-base font-bold">{USER.name.split(' ')[0]}</p>
              </div>
            </div>
            <button onClick={onProfileClick} className="text-[11px] bg-white/10 px-3 py-1.5 rounded-full text-citi-200 font-medium hover:bg-white/15 transition-colors">
              {accounts.length} Accounts
            </button>
          </div>

          <BalanceDisplay amount={totalBalance} size="xl" className="mb-5" />

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium">{formatCurrency(availableBalance)}</span>
              <span className="text-citi-300 text-xs">available</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-xs text-citi-200">Income</span>
              </div>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-red-400/20 flex items-center justify-center">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                </div>
                <span className="text-xs text-citi-200">Spending</span>
              </div>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(monthlySpending)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 lg:p-5 card-shadow">
        <QuickActions onTransfer={onTransfer} onDeposit={onDeposit} onPay={onPay} />
      </div>

      {/* Rewards banner */}
      <button
        onClick={onProfileClick}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white flex items-center justify-between hover:scale-[1.01] transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift className="w-5.5 h-5.5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">{USER.rewardsPoints.toLocaleString()} Reward Points</p>
            <p className="text-xs text-white/80">Tap to redeem for travel & cash back</p>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/60" />
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Primary Card */}
        {primaryCard && (
          <div className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">My Card</h3>
              <button
                onClick={onCardClick}
                className="text-xs text-citi-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <BankCard card={primaryCard} className="w-full max-w-sm mx-auto" />
          </div>
        )}

        {/* Account summary */}
        <div className="bg-white rounded-2xl p-5 card-shadow space-y-3">
          <h3 className="font-bold text-slate-900 mb-2">Accounts</h3>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    account.type === 'credit'
                      ? 'bg-orange-50 text-orange-600'
                      : account.type === 'savings'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-citi-50 text-citi-600'
                  }`}
                >
                  {account.type === 'savings' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{account.name}</p>
                  <p className="text-xs text-slate-400">{account.account_number}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold tabular-nums text-slate-900">
                  {formatCurrency(Number(account.balance))}
                </p>
                {account.type === 'savings' && account.interest_rate > 0 && (
                  <p className="text-[11px] text-emerald-600 font-medium">{account.interest_rate}% APY</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Goals */}
      <SavingsGoals goals={goals} onRefresh={onRefresh} />

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Recent Activity</h3>
          <button
            onClick={onViewAllTransactions}
            className="text-xs text-citi-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-1">
          {recentTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={() => setSelectedTx(tx)}
            />
          ))}
        </div>
      </div>

      <TransactionDetailModal
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        accountName={selectedTx ? getAccountName(selectedTx.account_id) : undefined}
      />
    </div>
  );
}
