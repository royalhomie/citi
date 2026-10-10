/*
# Citibank Banking App — Notifications & Savings Goals Tables

## Overview
Adds two new tables to support a notifications feed and savings goals tracker.

## New Tables

### notifications
- `id` (uuid, primary key)
- `title` (text) — notification headline
- `body` (text) — notification detail text
- `type` (text) — transaction, security, reward, info, alert
- `is_read` (boolean, default false)
- `icon` (text) — icon key for the notification
- `created_at` (timestamptz)

### goals
- `id` (uuid, primary key)
- `name` (text) — goal name e.g. "Vacation Fund"
- `target_amount` (numeric) — goal target in USD
- `current_amount` (numeric) — amount saved so far
- `icon` (text) — icon key
- `color` (text) — gradient theme
- `deadline` (date, nullable) — target date
- `created_at` (timestamptz)

## Security
- RLS enabled on both tables.
- Anon + authenticated CRUD (single-tenant demo app).
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  icon text NOT NULL DEFAULT 'bell',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  target_amount numeric(12,2) NOT NULL DEFAULT 0,
  current_amount numeric(12,2) NOT NULL DEFAULT 0,
  icon text NOT NULL DEFAULT 'target',
  color text NOT NULL DEFAULT 'citi',
  deadline date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Notifications policies
DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE
  TO anon, authenticated USING (true);

-- Goals policies
DROP POLICY IF EXISTS "anon_select_goals" ON goals;
CREATE POLICY "anon_select_goals" ON goals FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_goals" ON goals;
CREATE POLICY "anon_insert_goals" ON goals FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_goals" ON goals;
CREATE POLICY "anon_update_goals" ON goals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_goals" ON goals;
CREATE POLICY "anon_delete_goals" ON goals FOR DELETE
  TO anon, authenticated USING (true);
