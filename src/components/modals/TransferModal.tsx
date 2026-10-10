import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { bankingActions } from '@/hooks/useBankingData';
import { formatCurrency } from '@/lib/format';
import type { Account, Beneficiary } from '@/types';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  beneficiaries: Beneficiary[];
  onSuccess: () => void;
}

export default function TransferModal({ open, onClose, accounts, beneficiaries, onSuccess }: TransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState('');
  const [toType, setToType] = useState<'account' | 'beneficiary'>('account');
  const [toAccountId, setToAccountId] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromAccount = accounts.find((a) => a.id === fromAccountId);
  const transferableAccounts = accounts.filter((a) => a.type !== 'credit');

  const reset = () => {
    setFromAccountId('');
    setToAccountId('');
    setBeneficiaryId('');
    setAmount('');
    setNote('');
    setError(null);
    setSuccess(false);
    setToType('account');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!fromAccountId) return setError('Select a source account');
    if (toType === 'account' && !toAccountId) return setError('Select a destination account');
    if (toType === 'beneficiary' && !beneficiaryId) return setError('Select a recipient');
    if (!parsedAmount || parsedAmount <= 0) return setError('Enter a valid amount');
    if (fromAccount && parsedAmount > Number(fromAccount.available_balance))
      return setError('Insufficient funds');

    setLoading(true);
    try {
      // Brief delay so the "Sending..." state is visible in the demo.
      await new Promise((resolve) => setTimeout(resolve, 600));

      bankingActions.transfer({
        fromAccountId,
        toType,
        toAccountId: toType === 'account' ? toAccountId : undefined,
        beneficiaryId: toType === 'beneficiary' ? beneficiaryId : undefined,
        amount: parsedAmount,
        note,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Transfer Money">
      {success ? (
        <div className="flex flex-col items-center py-10 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Transfer Complete</h3>
          <p className="text-sm text-slate-500">
            {formatCurrency(parseFloat(amount) || 0)} sent successfully
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* From account */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">From</label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
            >
              <option value="">Select account</option>
              {transferableAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {formatCurrency(Number(acc.balance))}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setToType('account')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                toType === 'account' ? 'bg-citi-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Between Accounts
            </button>
            <button
              onClick={() => setToType('beneficiary')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                toType === 'beneficiary' ? 'bg-citi-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              To Recipient
            </button>
          </div>

          {/* To account/beneficiary */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">To</label>
            {toType === 'account' ? (
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
              >
                <option value="">Select account</option>
                {accounts
                  .filter((a) => a.id !== fromAccountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — {acc.account_number}
                    </option>
                  ))}
              </select>
            ) : (
              <select
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
              >
                <option value="">Select recipient</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.bank_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center -my-1">
            <div className="w-8 h-8 rounded-full bg-citi-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-citi-600 rotate-90" />
            </div>
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
            {fromAccount && (
              <p className="text-xs text-slate-400 mt-1.5">
                Available: {formatCurrency(Number(fromAccount.available_balance))}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-citi-500/40 focus:border-citi-500"
            />
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
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Send {amount && parseFloat(amount) > 0 ? formatCurrency(parseFloat(amount)) : 'Transfer'}
              </>
            )}
          </button>
        </div>
      )}
    </Modal>
  );
}
