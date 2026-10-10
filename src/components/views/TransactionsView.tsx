import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Inbox } from 'lucide-react';
import TransactionItem from '@/components/ui/TransactionItem';
import TransactionDetailModal from '@/components/ui/TransactionDetailModal';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Transaction, Account } from '@/types';

interface TransactionsViewProps {
  transactions: Transaction[];
  accounts: Account[];
  loading: boolean;
}

const categories = ['all', 'deposit', 'transfer', 'groceries', 'dining', 'transport', 'shopping', 'entertainment', 'utilities', 'health', 'travel'];

export default function TransactionsView({ transactions, accounts, loading }: TransactionsViewProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) ||
        (tx.merchant?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesCategory = filter === 'all' || tx.category === filter;
      const matchesAccount = accountFilter === 'all' || tx.account_id === accountFilter;
      return matchesSearch && matchesCategory && matchesAccount;
    });
  }, [transactions, search, filter, accountFilter]);

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filtered.forEach((tx) => {
      const key = formatDate(tx.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    return groups;
  }, [filtered]);

  const totalIn = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const getAccountName = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.name || 'Unknown Account';

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-3 pb-24 lg:pb-8 max-w-2xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-4 pb-24 lg:pb-8 max-w-2xl mx-auto animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="text-xs text-slate-400 mb-1">Money In</p>
          <p className="text-lg font-bold text-green-600 tabular-nums">{formatCurrency(totalIn)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="text-xs text-slate-400 mb-1">Money Out</p>
          <p className="text-lg font-bold text-slate-900 tabular-nums">{formatCurrency(totalOut)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500 transition-all card-shadow"
        />
      </div>

      {/* Account filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </div>
        <button
          onClick={() => setAccountFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            accountFilter === 'all' ? 'bg-citi-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Accounts
        </button>
        {accounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setAccountFilter(acc.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              accountFilter === acc.id ? 'bg-citi-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {acc.name}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
              filter === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">No transactions found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-4 lg:p-5 card-shadow space-y-4">
          {Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                {date}
              </p>
              <div className="space-y-1">
                {txs.map((tx) => (
                  <TransactionItem key={tx.id} transaction={tx} onClick={() => setSelectedTx(tx)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionDetailModal
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        accountName={selectedTx ? getAccountName(selectedTx.account_id) : undefined}
      />
    </div>
  );
}
