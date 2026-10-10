import { CreditCard, Snowflake, Wifi } from 'lucide-react';
import { formatCardNumber } from '@/lib/format';
import type { Card as CardType } from '@/types';

interface BankCardProps {
  card: CardType;
  accountNumber?: string;
  onClick?: () => void;
  className?: string;
}

const cardThemes: Record<string, string> = {
  navy: 'from-citi-900 via-citi-800 to-citi-950',
  gold: 'from-amber-700 via-amber-600 to-yellow-800',
  platinum: 'from-slate-600 via-slate-500 to-slate-800',
};

export default function BankCard({ card, accountNumber, onClick, className = '' }: BankCardProps) {
  const gradient = cardThemes[card.color] || cardThemes.navy;

  return (
    <div
      onClick={onClick}
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${className}`}
      style={{ aspectRatio: '1.586' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-white/[0.03]" />

      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
              {card.card_type === 'credit' ? 'Citi Rewards' : 'Citigold'}
            </p>
            <p className="text-xs text-white/40 mt-0.5">{card.brand}</p>
          </div>
          <div className="flex items-center gap-2">
            {card.is_frozen && (
              <span className="flex items-center gap-1 text-[10px] bg-sky-400/20 text-sky-200 px-2 py-1 rounded-full font-medium">
                <Snowflake className="w-3 h-3" /> Frozen
              </span>
            )}
            <Wifi className="w-5 h-5 rotate-90 text-white/40" />
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 opacity-80" />
          <CreditCard className="w-5 h-5 text-white/30" />
        </div>

        <div>
          <p className="text-base sm:text-lg font-medium tracking-[0.15em] tabular-nums mb-3">
            {formatCardNumber(card.last_four)}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/50 mb-0.5">Card Holder</p>
              <p className="text-sm font-medium tracking-wide">{card.holder_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-white/50 mb-0.5">Expires</p>
              <p className="text-sm font-medium tabular-nums">{card.expiry}</p>
            </div>
          </div>
        </div>
      </div>

      {accountNumber && (
        <div className="absolute top-5 right-5 text-right" style={{ display: 'none' }}>
          <p className="text-[9px] text-white/50">{accountNumber}</p>
        </div>
      )}
    </div>
  );
}
