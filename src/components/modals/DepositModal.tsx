import { useState } from 'react';
import { Check, Loader2, Camera } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { bankingActions } from '@/hooks/useBankingData';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  onSuccess: () => void;
}

const quickAmounts = [50, 100, 250, 500];

export default function DepositModal({ open, onClose, accounts, onSuccess }: DepositModalProps) {
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mobile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositAccounts = accounts.filter((a) => a.type !== 'credit');

  const reset = () => {
    setAccountId('');
    setAmount('');
    setMethod('mobile');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!accountId) return setError('Select an account');
    if (!parsedAmount || parsedAmount <= 0) return setError('Enter a valid amount');

    setLoading(true);
    try {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) throw new Error('Account not found');

      // Brief delay so the "Processing..." state is visible in the demo.
      await new Promise((resolve) => setTimeout(resolve, 600));

      bankingActions.deposit({
        accountId,
        amount: parsedAmount,
        method: method === 'mobile' ? 'mobile' : 'cash',
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Deposit Check">
      {success ? (
        <div className="flex flex-col items-center py-10 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Deposit Successful</h3>
          <p className="text-sm text-slate-500">
            {formatCurrency(parseFloat(amount) || 0)} added to your account
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Method toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMethod('mobile')}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                method === 'mobile' ? 'bg-citi-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Camera className="w-5 h-5" />
              Mobile Check
            </button>
            <button
              onClick={() => setMethod('cash')}
              className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                method === 'cash' ? 'bg-citi-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span className="text-lg font-bold">$</span>
              Cash Deposit
            </button>
          </div>

          {method === 'mobile' && (
            <div className="bg-citi-50 rounded-xl p-4 flex items-center gap-3">
              <Camera className="w-8 h-8 text-citi-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-citi-900">Take a photo of your check</p>
                <p className="text-xs text-citi-700">Front and back. Funds available instantly.</p>
              </div>
            </div>
          )}

          {/* Account selection */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Deposit To</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
            >
              <option value="">Select account</option>
              {depositAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {acc.account_number}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
              />
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                ${amt}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-citi-600 hover:bg-citi-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>Deposit {amount && parseFloat(amount) > 0 ? formatCurrency(parseFloat(amount)) : ''}</>
            )}
          </button>
        </div>
      )}
    </Modal>
  );
}
