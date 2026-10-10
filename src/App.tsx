import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import Dashboard from '@/components/views/Dashboard';
import AccountsView from '@/components/views/AccountsView';
import CardsView from '@/components/views/CardsView';
import TransactionsView from '@/components/views/TransactionsView';
import AnalyticsView from '@/components/views/AnalyticsView';
import ProfileView from '@/components/views/ProfileView';
import TransferModal from '@/components/modals/TransferModal';
import DepositModal from '@/components/modals/DepositModal';
import NotificationsDrawer from '@/components/ui/NotificationsDrawer';
import LoginScreen from '@/components/auth/LoginScreen';
import { useBankingData, bankingActions } from '@/hooks/useBankingData';
import type { ViewName } from '@/types';

const viewTitles: Record<ViewName, string> = {
  dashboard: 'Dashboard',
  accounts: 'My Accounts',
  cards: 'My Cards',
  transactions: 'Transactions',
  analytics: 'Analytics',
  profile: 'My Profile',
};

function MainApp({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<ViewName>('dashboard');
  const [transferOpen, setTransferOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { accounts, transactions, cards, beneficiaries, notifications, goals, loading, refresh } = useBankingData();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const handleNavigate = (v: ViewName) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  const handleActionSuccess = () => {
    refresh();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar current={view} onNavigate={handleNavigate} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          title={viewTitles[view]}
          unreadCount={unreadCount}
          onBellClick={() => setNotifOpen(true)}
          onProfileClick={() => handleNavigate('profile')}
        />

        <main className="flex-1">
          {view === 'dashboard' && (
            <Dashboard
              accounts={accounts}
              transactions={transactions}
              cards={cards}
              goals={goals}
              loading={loading}
              onTransfer={() => setTransferOpen(true)}
              onDeposit={() => setDepositOpen(true)}
              onPay={() => setTransferOpen(true)}
              onViewAllTransactions={() => handleNavigate('transactions')}
              onCardClick={() => handleNavigate('cards')}
              onProfileClick={() => handleNavigate('profile')}
              onRefresh={refresh}
            />
          )}
          {view === 'accounts' && (
            <AccountsView
              accounts={accounts}
              loading={loading}
              onTransfer={() => setTransferOpen(true)}
            />
          )}
          {view === 'cards' && (
            <CardsView cards={cards} accounts={accounts} loading={loading} onRefresh={refresh} />
          )}
          {view === 'transactions' && (
            <TransactionsView transactions={transactions} accounts={accounts} loading={loading} />
          )}
          {view === 'analytics' && (
            <AnalyticsView transactions={transactions} loading={loading} />
          )}
          {view === 'profile' && (
            <ProfileView accounts={accounts} onNavigate={handleNavigate} onSignOut={onSignOut} />
          )}
        </main>
      </div>

      <BottomNav current={view} onNavigate={handleNavigate} />

      <NotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onRefresh={refresh}
      />

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        accounts={accounts}
        beneficiaries={beneficiaries}
        onSuccess={handleActionSuccess}
      />
      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        accounts={accounts}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}

export default function App() {
  // Auth lives in memory only, so every app launch starts at the sign-in screen.
  const [authenticated, setAuthenticated] = useState(false);

  const handleSignOut = () => {
    bankingActions.reset(); // next sign-in starts from the same static demo data
    setAuthenticated(false);
    window.scrollTo({ top: 0 });
  };

  if (!authenticated) {
    return <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  return <MainApp onSignOut={handleSignOut} />;
}
