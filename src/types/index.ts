export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  available_balance: number;
  account_number: string;
  routing_number: string;
  currency: string;
  interest_rate: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  description: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending';
  merchant: string | null;
  location: string | null;
  date: string;
  created_at: string;
}

export interface Card {
  id: string;
  account_id: string;
  holder_name: string;
  card_type: 'debit' | 'credit';
  brand: string;
  last_four: string;
  expiry: string;
  color: string;
  credit_limit: number | null;
  spent: number;
  is_frozen: boolean;
  created_at: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'transaction' | 'security' | 'reward' | 'info' | 'alert';
  is_read: boolean;
  icon: string;
  created_at: string;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string;
  color: string;
  deadline: string | null;
  created_at: string;
}

export type ViewName = 'dashboard' | 'accounts' | 'cards' | 'transactions' | 'analytics' | 'profile';
