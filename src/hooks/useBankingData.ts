import { useSyncExternalStore, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type {
  Account,
  Transaction,
  Card,
  Beneficiary,
  Notification,
  Goal,
} from '@/types';

/* -------------------------------------------------------------------------- */
/*  Local demo data store                                                     */
/*                                                                            */
/*  There is no backend. All data lives in a small in-memory store that every */
/*  component shares, so a deposit made in DepositModal immediately shows up  */
/*  in the dashboard, accounts, transactions and analytics views. Data resets */
/*  on page reload.                                                           */
/* -------------------------------------------------------------------------- */

interface BankingState {
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];
  beneficiaries: Beneficiary[];
  notifications: Notification[];
  goals: Goal[];
}

/* ------------------------------ Seed data --------------------------------- */

const ACC_CHECKING = 'acc-checking';
const ACC_SAVINGS = 'acc-savings';
const ACC_CREDIT = 'acc-credit';

function daysAgo(days: number, hour = 12, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function monthsFromNow(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

type TxSeed = Omit<Transaction, 'id' | 'created_at' | 'status' | 'merchant' | 'location'> &
  Partial<Pick<Transaction, 'status' | 'merchant' | 'location'>>;

function buildTransactions(): Transaction[] {
  const seeds: TxSeed[] = [
    { account_id: ACC_CHECKING, description: 'Whole Foods Market', category: 'groceries', amount: -87.43, merchant: 'Whole Foods Market', location: 'New York, NY', date: daysAgo(0, 9, 12) },
    { account_id: ACC_CREDIT, description: 'Blue Bottle Coffee', category: 'dining', amount: -6.75, merchant: 'Blue Bottle Coffee', location: 'New York, NY', date: daysAgo(0, 8, 41), status: 'pending' },
    { account_id: ACC_CHECKING, description: 'Uber Ride', category: 'transport', amount: -24.8, merchant: 'Uber', location: 'New York, NY', date: daysAgo(1, 19, 5) },
    { account_id: ACC_CREDIT, description: 'Nobu Downtown', category: 'dining', amount: -186.2, merchant: 'Nobu Downtown', location: 'New York, NY', date: daysAgo(1, 21, 30) },
    { account_id: ACC_CHECKING, description: 'Payroll Deposit', category: 'deposit', amount: 4850, merchant: 'Hartwell & Co.', location: 'Direct Deposit', date: daysAgo(2, 6, 0) },
    { account_id: ACC_CREDIT, description: 'Netflix Subscription', category: 'entertainment', amount: -15.49, merchant: 'Netflix', location: 'Online', date: daysAgo(2, 3, 0) },
    { account_id: ACC_CHECKING, description: 'Con Edison', category: 'utilities', amount: -142.67, merchant: 'Con Edison', location: 'Online', date: daysAgo(3, 10, 15) },
    { account_id: ACC_CREDIT, description: 'Apple Store', category: 'shopping', amount: -299, merchant: 'Apple Store', location: 'New York, NY', date: daysAgo(4, 15, 22) },
    { account_id: ACC_CHECKING, description: 'Trader Joe\'s', category: 'groceries', amount: -64.12, merchant: 'Trader Joe\'s', location: 'Brooklyn, NY', date: daysAgo(4, 18, 10) },
    { account_id: ACC_CHECKING, description: 'CVS Pharmacy', category: 'health', amount: -32.18, merchant: 'CVS Pharmacy', location: 'New York, NY', date: daysAgo(5, 13, 45) },
    { account_id: ACC_CREDIT, description: 'Delta Air Lines', category: 'travel', amount: -412.6, merchant: 'Delta Air Lines', location: 'Online', date: daysAgo(6, 11, 0) },
    { account_id: ACC_CHECKING, description: 'Shell Gas Station', category: 'transport', amount: -58.9, merchant: 'Shell', location: 'Jersey City, NJ', date: daysAgo(7, 17, 20) },
    { account_id: ACC_SAVINGS, description: 'Interest Payment', category: 'deposit', amount: 156.4, merchant: 'Citibank', location: 'Citi', date: daysAgo(8, 0, 5) },
    { account_id: ACC_CREDIT, description: 'Spotify Premium', category: 'entertainment', amount: -11.99, merchant: 'Spotify', location: 'Online', date: daysAgo(9, 3, 0) },
    { account_id: ACC_CHECKING, description: 'Transfer to Citi Savings Plus', category: 'transfer', amount: -500, merchant: 'Internal Transfer', location: 'Online', date: daysAgo(10, 9, 30) },
    { account_id: ACC_SAVINGS, description: 'Transfer from Citigold Checking', category: 'transfer', amount: 500, merchant: 'Internal Transfer', location: 'Online', date: daysAgo(10, 9, 30) },
    { account_id: ACC_CHECKING, description: 'Sweetgreen', category: 'dining', amount: -17.85, merchant: 'Sweetgreen', location: 'New York, NY', date: daysAgo(11, 12, 40) },
    { account_id: ACC_CREDIT, description: 'AMC Theatres', category: 'entertainment', amount: -42, merchant: 'AMC Theatres', location: 'New York, NY', date: daysAgo(12, 20, 15) },
    { account_id: ACC_CHECKING, description: 'Equinox Membership', category: 'health', amount: -245, merchant: 'Equinox', location: 'Online', date: daysAgo(13, 4, 0) },
    { account_id: ACC_CHECKING, description: 'Mobile Check Deposit', category: 'deposit', amount: 620, merchant: 'Citi Mobile Deposit', location: 'Mobile App', date: daysAgo(14, 14, 10) },
    { account_id: ACC_CREDIT, description: 'Zara', category: 'shopping', amount: -138.5, merchant: 'Zara', location: 'New York, NY', date: daysAgo(15, 16, 25) },
    { account_id: ACC_CHECKING, description: 'Verizon Wireless', category: 'utilities', amount: -96.4, merchant: 'Verizon', location: 'Online', date: daysAgo(17, 7, 0) },
    { account_id: ACC_CHECKING, description: 'Payroll Deposit', category: 'deposit', amount: 4850, merchant: 'Hartwell & Co.', location: 'Direct Deposit', date: daysAgo(17, 6, 0) },
    { account_id: ACC_CREDIT, description: 'Lyft Ride', category: 'transport', amount: -19.3, merchant: 'Lyft', location: 'New York, NY', date: daysAgo(19, 22, 5) },
    { account_id: ACC_CHECKING, description: 'Whole Foods Market', category: 'groceries', amount: -112.36, merchant: 'Whole Foods Market', location: 'New York, NY', date: daysAgo(21, 10, 30) },
    { account_id: ACC_CREDIT, description: 'Marriott Hotels', category: 'travel', amount: -389, merchant: 'Marriott', location: 'Boston, MA', date: daysAgo(24, 9, 0) },
    { account_id: ACC_CHECKING, description: 'Transfer to Sarah Mitchell', category: 'transfer', amount: -250, merchant: 'Sarah Mitchell', location: 'Online', date: daysAgo(26, 18, 0) },
  ];

  return seeds
    .map((s, i) => ({
      id: `tx-seed-${i + 1}`,
      status: 'completed' as const,
      merchant: null,
      location: null,
      created_at: s.date,
      ...s,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function buildSeed(): BankingState {
  const accounts: Account[] = [
    {
      id: ACC_CHECKING,
      name: 'Citigold Checking',
      type: 'checking',
      balance: 1187.55,
      available_balance: 1173.55,
      account_number: '4821937560',
      routing_number: '021000089',
      currency: 'USD',
      interest_rate: 0.01,
      created_at: daysAgo(900),
    },
    {
      id: ACC_SAVINGS,
      name: 'Citi Savings Plus',
      type: 'savings',
      balance: 1734,
      available_balance: 1743,
      account_number: '4821937614',
      routing_number: '021000089',
      currency: 'USD',
      interest_rate: 4.35,
      created_at: daysAgo(900),
    },
    {
      id: ACC_CREDIT,
      name: 'Citi Rewards Credit',
      type: 'credit',
      balance: 2340.18,
      available_balance: 2634.82,
      account_number: '5424187734',
      routing_number: '021000089',
      currency: 'USD',
      interest_rate: 19.99,
      created_at: daysAgo(700),
    },
  ];

  const cards: Card[] = [
    {
      id: 'card-debit',
      account_id: ACC_CHECKING,
      holder_name: 'IBEH CHIDERA',
      card_type: 'debit',
      brand: 'Visa',
      last_four: '4821',
      expiry: '08/28',
      color: 'navy',
      credit_limit: null,
      spent: 0,
      is_frozen: false,
      created_at: daysAgo(600),
    },
    {
      id: 'card-credit',
      account_id: ACC_CREDIT,
      holder_name: 'IBEH CHIDERA',
      card_type: 'credit',
      brand: 'Mastercard',
      last_four: '7734',
      expiry: '03/29',
      color: 'gold',
      credit_limit: 15000,
      spent: 2340.18,
      is_frozen: false,
      created_at: daysAgo(500),
    },
  ];

  const beneficiaries: Beneficiary[] = [
    { id: 'ben-1', name: 'Sarah Mitchell', bank_name: 'Chase Bank', account_number: '•••• 3321', routing_number: '021000021', created_at: daysAgo(300) },
    { id: 'ben-2', name: 'David Chen', bank_name: 'Bank of America', account_number: '•••• 8870', routing_number: '026009593', created_at: daysAgo(240) },
    { id: 'ben-3', name: 'Maria Rodriguez', bank_name: 'Wells Fargo', account_number: '•••• 5512', routing_number: '121000248', created_at: daysAgo(120) },
    { id: 'ben-4', name: 'Brooklyn Property Mgmt', bank_name: 'TD Bank', account_number: '•••• 1049', routing_number: '031101266', created_at: daysAgo(60) },
  ];

  const notifications: Notification[] = [
    { id: 'notif-1', title: 'Payroll deposit received', body: 'Your paycheck of $4,850.00 has been deposited to Citigold Checking.', type: 'transaction', is_read: false, icon: 'arrow-down', created_at: minutesAgo(45) },
    { id: 'notif-2', title: 'New sign-in detected', body: 'We noticed a sign-in to your account from a new device in New York, NY.', type: 'security', is_read: false, icon: 'shield', created_at: minutesAgo(180) },
    { id: 'notif-3', title: 'You earned 450 reward points', body: 'Thanks for using your Citi Rewards card. Redeem points anytime.', type: 'reward', is_read: false, icon: 'gift', created_at: daysAgo(1, 10, 15) },
    { id: 'notif-4', title: 'Statement ready', body: 'Your September statement for Citi Rewards Credit is available.', type: 'info', is_read: true, icon: 'file-text', created_at: daysAgo(3, 8, 0) },
    { id: 'notif-5', title: 'Credit utilization alert', body: 'Your credit card balance has reached 15% of your limit.', type: 'alert', is_read: true, icon: 'alert-triangle', created_at: daysAgo(5, 14, 30) },
  ];

  const goals: Goal[] = [
    { id: 'goal-1', name: 'Vacation to Japan', target_amount: 6000, current_amount: 3850, icon: 'plane', color: 'citi', deadline: monthsFromNow(8), created_at: daysAgo(200) },
    { id: 'goal-2', name: 'Emergency Fund', target_amount: 25000, current_amount: 18400, icon: 'shield', color: 'emerald', deadline: monthsFromNow(14), created_at: daysAgo(400) },
    { id: 'goal-3', name: 'New Car Down Payment', target_amount: 12000, current_amount: 4100, icon: 'car', color: 'amber', deadline: monthsFromNow(20), created_at: daysAgo(150) },
  ];

  return { accounts, transactions: buildTransactions(), cards, beneficiaries, notifications, goals };
}

/* ------------------------------- The store -------------------------------- */

let state: BankingState = buildSeed();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): BankingState {
  return state;
}

function update(patch: Partial<BankingState>) {
  state = { ...state, ...patch };
  emit();
}

let idCounter = 0;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function makeSetter<K extends keyof BankingState>(key: K): Dispatch<SetStateAction<BankingState[K]>> {
  return (value) => {
    const next =
      typeof value === 'function'
        ? (value as (prev: BankingState[K]) => BankingState[K])(state[key])
        : value;
    update({ [key]: next } as Partial<BankingState>);
  };
}

const setters = {
  setAccounts: makeSetter('accounts'),
  setTransactions: makeSetter('transactions'),
  setCards: makeSetter('cards'),
  setBeneficiaries: makeSetter('beneficiaries'),
  setNotifications: makeSetter('notifications'),
  setGoals: makeSetter('goals'),
};

/* ------------------------------- Actions ---------------------------------- */

export interface DepositInput {
  accountId: string;
  amount: number;
  method: 'mobile' | 'cash';
}

export interface TransferInput {
  fromAccountId: string;
  toType: 'account' | 'beneficiary';
  toAccountId?: string;
  beneficiaryId?: string;
  amount: number;
  note?: string;
}

export interface NewGoalInput {
  name: string;
  targetAmount: number;
  deadline?: string | null;
}

function pushNotification(
  list: Notification[],
  n: Pick<Notification, 'title' | 'body' | 'type' | 'icon'>
): Notification[] {
  return [
    { id: newId('notif'), is_read: false, created_at: new Date().toISOString(), ...n },
    ...list,
  ];
}

export const bankingActions = {
  /** Credits a non-credit account and records the transaction. Throws on invalid input. */
  deposit({ accountId, amount, method }: DepositInput): void {
    if (!amount || amount <= 0) throw new Error('Enter a valid amount');
    const account = state.accounts.find((a) => a.id === accountId);
    if (!account) throw new Error('Account not found');
    if (account.type === 'credit') throw new Error('Deposits to credit accounts are not supported');

    const now = new Date().toISOString();
    const tx: Transaction = {
      id: newId('tx'),
      account_id: accountId,
      description: method === 'mobile' ? 'Mobile Check Deposit' : 'Cash Deposit',
      category: 'deposit',
      amount: round2(amount),
      status: 'completed',
      merchant: method === 'mobile' ? 'Citi Mobile Deposit' : 'Citi Branch',
      location: 'Mobile App',
      date: now,
      created_at: now,
    };

    update({
      transactions: [tx, ...state.transactions],
      accounts: state.accounts.map((a) =>
        a.id === accountId
          ? {
              ...a,
              balance: round2(Number(a.balance) + amount),
              available_balance: round2(Number(a.available_balance) + amount),
            }
          : a
      ),
      notifications: pushNotification(state.notifications, {
        title: 'Deposit completed',
        body: `$${amount.toFixed(2)} was added to ${account.name}.`,
        type: 'transaction',
        icon: 'arrow-down',
      }),
    });
  },

  /** Moves money between accounts or to a saved recipient. Throws on invalid input. */
  transfer({ fromAccountId, toType, toAccountId, beneficiaryId, amount, note }: TransferInput): void {
    if (!amount || amount <= 0) throw new Error('Enter a valid amount');
    const from = state.accounts.find((a) => a.id === fromAccountId);
    if (!from) throw new Error('Source account not found');
    if (from.type === 'credit') throw new Error('Cannot transfer from a credit account');
    if (amount > Number(from.available_balance)) throw new Error('Insufficient funds');

    const now = new Date().toISOString();
    const txs: Transaction[] = [];
    let accounts = state.accounts;
    let cards = state.cards;
    let recipientName: string;

    if (toType === 'account') {
      const to = state.accounts.find((a) => a.id === toAccountId);
      if (!to) throw new Error('Destination account not found');
      if (to.id === from.id) throw new Error('Choose a different destination account');
      recipientName = to.name;

      txs.push({
        id: newId('tx'),
        account_id: to.id,
        description: `Transfer from ${from.name}`,
        category: 'transfer',
        amount: round2(amount),
        status: 'completed',
        merchant: 'Internal Transfer',
        location: 'Online',
        date: now,
        created_at: now,
      });

      accounts = accounts.map((a) => {
        if (a.id !== to.id) return a;
        // Paying a credit account reduces what is owed and frees up credit.
        return a.type === 'credit'
          ? {
              ...a,
              balance: round2(Math.max(0, Number(a.balance) - amount)),
              available_balance: round2(Number(a.available_balance) + amount),
            }
          : {
              ...a,
              balance: round2(Number(a.balance) + amount),
              available_balance: round2(Number(a.available_balance) + amount),
            };
      });

      if (to.type === 'credit') {
        cards = cards.map((c) =>
          c.account_id === to.id ? { ...c, spent: round2(Math.max(0, Number(c.spent) - amount)) } : c
        );
      }
    } else {
      const ben = state.beneficiaries.find((b) => b.id === beneficiaryId);
      if (!ben) throw new Error('Recipient not found');
      recipientName = ben.name;
    }

    const outgoing: Transaction = {
      id: newId('tx'),
      account_id: from.id,
      description: `Transfer to ${recipientName}`,
      category: 'transfer',
      amount: -round2(amount),
      status: 'completed',
      merchant: toType === 'beneficiary' ? recipientName : 'Internal Transfer',
      location: 'Online',
      date: now,
      created_at: now,
    };

    accounts = accounts.map((a) =>
      a.id === from.id
        ? {
            ...a,
            balance: round2(Number(a.balance) - amount),
            available_balance: round2(Number(a.available_balance) - amount),
          }
        : a
    );

    const trimmedNote = note?.trim();
    update({
      accounts,
      cards,
      transactions: [outgoing, ...txs, ...state.transactions],
      notifications: pushNotification(state.notifications, {
        title: 'Transfer sent',
        body: `$${amount.toFixed(2)} sent to ${recipientName}${trimmedNote ? ` — "${trimmedNote}"` : ''}.`,
        type: 'transaction',
        icon: 'bell',
      }),
    });
  },

  markNotificationRead(id: string): void {
    update({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    });
  },

  markAllNotificationsRead(): void {
    update({ notifications: state.notifications.map((n) => ({ ...n, is_read: true })) });
  },

  removeNotification(id: string): void {
    update({ notifications: state.notifications.filter((n) => n.id !== id) });
  },

  /** Adds money to a savings goal. */
  contributeToGoal(goalId: string, amount: number): void {
    if (!amount || amount <= 0) throw new Error('Enter a valid amount');
    const goal = state.goals.find((g) => g.id === goalId);
    if (!goal) throw new Error('Goal not found');

    const newAmount = round2(Number(goal.current_amount) + amount);
    const reached = newAmount >= Number(goal.target_amount) && Number(goal.current_amount) < Number(goal.target_amount);

    update({
      goals: state.goals.map((g) => (g.id === goalId ? { ...g, current_amount: newAmount } : g)),
      notifications: reached
        ? pushNotification(state.notifications, {
            title: 'Goal reached!',
            body: `You hit your target for "${goal.name}". Nice work.`,
            type: 'reward',
            icon: 'target',
          })
        : state.notifications,
    });
  },

  addGoal({ name, targetAmount, deadline = null }: NewGoalInput): void {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Enter a goal name');
    if (!targetAmount || targetAmount <= 0) throw new Error('Enter a valid target amount');

    const colors = ['citi', 'emerald', 'amber'];
    const icons = ['target', 'plane', 'home', 'graduation'];
    const index = state.goals.length;
    const goal: Goal = {
      id: newId('goal'),
      name: trimmed,
      target_amount: round2(targetAmount),
      current_amount: 0,
      icon: icons[index % icons.length],
      color: colors[index % colors.length],
      deadline,
      created_at: new Date().toISOString(),
    };
    update({ goals: [...state.goals, goal] });
  },

  toggleCardFreeze(cardId: string): void {
    const card = state.cards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');
    const frozen = !card.is_frozen;

    update({
      cards: state.cards.map((c) => (c.id === cardId ? { ...c, is_frozen: frozen } : c)),
      notifications: pushNotification(state.notifications, {
        title: frozen ? 'Card frozen' : 'Card unfrozen',
        body: frozen
          ? `Your card ending in ${card.last_four} is frozen. New purchases will be declined.`
          : `Your card ending in ${card.last_four} is active again.`,
        type: 'security',
        icon: 'shield',
      }),
    });
  },

  /** Restores the original demo data. */
  reset(): void {
    state = buildSeed();
    emit();
  },
};

/* --------------------------------- Hook ----------------------------------- */

export function useBankingData() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Data is already in memory, so there is nothing to re-fetch. Kept so existing
  // `onRefresh` / `onSuccess` props keep working unchanged.
  const refresh = useCallback(async () => {}, []);

  return {
    ...snapshot,
    ...setters,
    loading: false,
    error: null as string | null,
    refresh,
    actions: bankingActions,
  };
}
