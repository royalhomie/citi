import { Snowflake, Unlock, Eye, EyeOff, Settings2 } from 'lucide-react';
import { useState } from 'react';
import BankCard from '@/components/ui/BankCard';
import Skeleton from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/format';
import { bankingActions } from '@/hooks/useBankingData';
import type { Card, Account } from '@/types';

interface CardsViewProps {
  cards: Card[];
  accounts: Account[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CardsView({ cards, accounts, loading, onRefresh }: CardsViewProps) {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-4 pb-24 lg:pb-8 max-w-3xl mx-auto">
        <Skeleton className="h-80 w-full max-w-sm rounded-2xl" />
        <Skeleton className="h-80 w-full max-w-sm rounded-2xl" />
      </div>
    );
  }

  const toggleReveal = (cardId: string) => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  const toggleFreeze = async (cardId: string) => {
    setBusy(cardId);
    try {
      // Short delay so the button's disabled state is visible in the demo.
      await new Promise((resolve) => setTimeout(resolve, 300));
      bankingActions.toggleCardFreeze(cardId);
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle freeze:', err);
    } finally {
      setBusy(null);
    }
  };

  const getAccountName = (accountId: string) =>
    accounts.find((a) => a.id === accountId)?.name || 'Unknown';

  return (
    <div className="p-4 lg:p-8 space-y-6 pb-24 lg:pb-8 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{cards.length} cards active</p>
      </div>

      {cards.map((card) => {
        const revealed = revealedCards.has(card.id);
        const isCredit = card.card_type === 'credit';
        const creditAvailable = card.credit_limit ? Number(card.credit_limit) - Number(card.spent) : 0;
        const utilization = card.credit_limit
          ? Math.round((Number(card.spent) / Number(card.credit_limit)) * 100)
          : 0;

        return (
          <div key={card.id} className="bg-white rounded-2xl p-5 card-shadow">
            <BankCard card={card} className="w-full max-w-sm mx-auto" />

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Linked Account</span>
                <span className="text-sm font-medium text-slate-900">{getAccountName(card.account_id)}</span>
              </div>

              {isCredit && card.credit_limit && (
                <div className="space-y-2 py-2 border-b border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Credit Available</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatCurrency(creditAvailable)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Used: {formatCurrency(Number(card.spent))}</span>
                    <span className="text-slate-400">{utilization}% of {formatCurrency(Number(card.credit_limit))}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-amber-500' : 'bg-citi-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => toggleReveal(card.id)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  {revealed ? <EyeOff className="w-5 h-5 text-slate-600" /> : <Eye className="w-5 h-5 text-slate-600" />}
                  <span className="text-xs font-medium text-slate-600">{revealed ? 'Hide' : 'Details'}</span>
                </button>
                <button
                  onClick={() => toggleFreeze(card.id)}
                  disabled={busy === card.id}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  {card.is_frozen ? (
                    <Unlock className="w-5 h-5 text-slate-600" />
                  ) : (
                    <Snowflake className="w-5 h-5 text-slate-600" />
                  )}
                  <span className="text-xs font-medium text-slate-600">
                    {card.is_frozen ? 'Unfreeze' : 'Freeze'}
                  </span>
                </button>
                <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Settings2 className="w-5 h-5 text-slate-600" />
                  <span className="text-xs font-medium text-slate-600">Settings</span>
                </button>
              </div>

              {revealed && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 animate-slide-down">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Card Type</span>
                    <span className="font-medium capitalize text-slate-700">{card.card_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Brand</span>
                    <span className="font-medium text-slate-700">{card.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Four</span>
                    <span className="font-mono font-medium text-slate-700">{card.last_four}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expires</span>
                    <span className="font-mono font-medium text-slate-700">{card.expiry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-medium ${card.is_frozen ? 'text-sky-600' : 'text-emerald-600'}`}>
                      {card.is_frozen ? 'Frozen' : 'Active'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
