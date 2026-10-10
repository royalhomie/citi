/*
# Citibank Banking App — Database Schema

## Overview
Creates the core banking schema for a single-tenant (no auth) demo banking app.
All amounts are stored in USD. The app uses the anon key to read/write its own data,
so policies allow both anon and authenticated roles.

## New Tables

### accounts
- `id` (uuid, primary key)
- `name` (text) — display name e.g. "Checking Plus", "Savings Maximizer"
- `type` (text) — account type: checking, savings, credit
- `balance` (numeric) — current balance in USD
- `available_balance` (numeric) — available balance (balance minus pending holds)
- `account_number` (text) — masked account number for display
- `routing_number` (text) — routing number
- `currency` (text, default 'USD')
- `interest_rate` (numeric) — APY for savings accounts
- `created_at` (timestamptz)

### transactions
- `id` (uuid, primary key)
- `account_id` (uuid, FK -> accounts)
- `description` (text) — merchant or description
- `category` (text) — e.g. groceries, dining, transfer, deposit, payment
- `amount` (numeric) — positive for income/deposit, negative for spending
- `status` (text) — completed, pending
- `merchant` (text, nullable)
- `location` (text, nullable)
- `date` (timestamptz)
- `created_at` (timestamptz)

### cards
- `id` (uuid, primary key)
- `account_id` (uuid, FK -> accounts)
- `holder_name` (text)
- `card_type` (text) — debit, credit
- `brand` (text) — Visa, Mastercard
- `last_four` (text) — last 4 digits
- `expiry` (text) — MM/YY
- `color` (text) — gradient theme key for card visual
- `credit_limit` (numeric, nullable) — credit limit
- `spent` (numeric, default 0) — amount spent on credit card
- `is_frozen` (boolean, default false)
- `created_at` (timestamptz)

### beneficiaries
- `id` (uuid, primary key)
- `name` (text)
- `bank_name` (text)
- `account_number` (text)
- `routing_number` (text)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- All policies allow anon + authenticated CRUD (single-tenant demo app, intentionally shared data).
*/

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'checking',
  balance numeric(12,2) NOT NULL DEFAULT 0,
  available_balance numeric(12,2) NOT NULL DEFAULT 0,
  account_number text NOT NULL,
  routing_number text NOT NULL DEFAULT '021000089',
  currency text NOT NULL DEFAULT 'USD',
  interest_rate numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  amount numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  merchant text,
  location text,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  holder_name text NOT NULL DEFAULT 'JOHN DOE',
  card_type text NOT NULL DEFAULT 'debit',
  brand text NOT NULL DEFAULT 'Visa',
  last_four text NOT NULL,
  expiry text NOT NULL,
  color text NOT NULL DEFAULT 'navy',
  credit_limit numeric(12,2),
  spent numeric(12,2) NOT NULL DEFAULT 0,
  is_frozen boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bank_name text NOT NULL,
  account_number text NOT NULL,
  routing_number text NOT NULL DEFAULT '021000089',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

-- Accounts policies
DROP POLICY IF EXISTS "anon_select_accounts" ON accounts;
CREATE POLICY "anon_select_accounts" ON accounts FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_accounts" ON accounts;
CREATE POLICY "anon_insert_accounts" ON accounts FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_accounts" ON accounts;
CREATE POLICY "anon_update_accounts" ON accounts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_accounts" ON accounts;
CREATE POLICY "anon_delete_accounts" ON accounts FOR DELETE
  TO anon, authenticated USING (true);

-- Transactions policies
DROP POLICY IF EXISTS "anon_select_transactions" ON transactions;
CREATE POLICY "anon_select_transactions" ON transactions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_transactions" ON transactions;
CREATE POLICY "anon_insert_transactions" ON transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_transactions" ON transactions;
CREATE POLICY "anon_update_transactions" ON transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_transactions" ON transactions;
CREATE POLICY "anon_delete_transactions" ON transactions FOR DELETE
  TO anon, authenticated USING (true);

-- Cards policies
DROP POLICY IF EXISTS "anon_select_cards" ON cards;
CREATE POLICY "anon_select_cards" ON cards FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_cards" ON cards;
CREATE POLICY "anon_insert_cards" ON cards FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_cards" ON cards;
CREATE POLICY "anon_update_cards" ON cards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_cards" ON cards;
CREATE POLICY "anon_delete_cards" ON cards FOR DELETE
  TO anon, authenticated USING (true);

-- Beneficiaries policies
DROP POLICY IF EXISTS "anon_select_beneficiaries" ON beneficiaries;
CREATE POLICY "anon_select_beneficiaries" ON beneficiaries FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_beneficiaries" ON beneficiaries;
CREATE POLICY "anon_insert_beneficiaries" ON beneficiaries FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_beneficiaries" ON beneficiaries;
CREATE POLICY "anon_update_beneficiaries" ON beneficiaries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_beneficiaries" ON beneficiaries;
CREATE POLICY "anon_delete_beneficiaries" ON beneficiaries FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);
