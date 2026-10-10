import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/format';
import { getCategoryColor, getCategoryIcon } from '@/lib/categories';
import type { Transaction } from '@/types';

interface AnalyticsViewProps {
  transactions: Transaction[];
  loading: boolean;
}

export default function AnalyticsView({ transactions, loading }: AnalyticsViewProps) {
  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === 'completed');
    const income = completed.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
    const spending = completed.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
    const net = income - spending;

    const byCategory: Record<string, number> = {};
    completed
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        const cat = t.category;
        byCategory[cat] = (byCategory[cat] || 0) + Math.abs(Number(t.amount));
      });

    const categoryList = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const totalSpending = categoryList.reduce((s, [, v]) => s + v, 0);

    // Simple bar chart data: spending per day for last 7 days
    const days: { label: string; amount: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const amount = completed
        .filter((t) => {
          const td = new Date(t.date);
          return td >= dayStart && td < dayEnd && t.amount < 0;
        })
        .reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

      days.push({
        label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        amount,
      });
    }
    const maxDayAmount = Math.max(...days.map((d) => d.amount), 1);

    return { income, spending, net, categoryList, totalSpending, days, maxDayAmount };
  }, [transactions]);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-4 pb-24 lg:pb-8 max-w-3xl mx-auto">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Income', value: stats.income, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Spending', value: stats.spending, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Net Savings', value: stats.net, icon: Wallet, color: 'text-citi-600', bg: 'bg-citi-50' },
    { label: 'Savings Rate', value: stats.income > 0 ? Math.round((stats.net / stats.income) * 100) : 0, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', isPercent: true },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-3xl mx-auto animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 card-shadow">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-slate-400 mb-0.5">{stat.label}</p>
              <p className={`text-lg font-bold tabular-nums ${stat.color}`}>
                {stat.isPercent ? `${stat.value}%` : formatCurrency(stat.value)}
              </p>
            </div>
          );
        })}
      </div>

      {/* 7-day spending chart */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h3 className="font-bold text-slate-900 mb-1">Spending This Week</h3>
        <p className="text-xs text-slate-400 mb-5">Daily spending breakdown</p>
        <div className="flex items-end justify-between gap-2 h-40">
          {stats.days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-citi-600 to-citi-400 rounded-lg transition-all hover:from-citi-700 hover:to-citi-500 group relative"
                  style={{ height: `${(day.amount / stats.maxDayAmount) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10">
                    {formatCurrency(day.amount)}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h3 className="font-bold text-slate-900 mb-1">Spending by Category</h3>
        <p className="text-xs text-slate-400 mb-4">Where your money went</p>

        {stats.categoryList.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No spending data yet</p>
        ) : (
          <div className="space-y-3">
            {stats.categoryList.map(([category, amount]) => {
              const percent = Math.round((amount / stats.totalSpending) * 100);
              const Icon = getCategoryIcon(category);
              const colorClass = getCategoryColor(category);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 capitalize">{category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">{percent}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-citi-500 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
