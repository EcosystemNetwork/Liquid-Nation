import React, { useState } from 'react';
import Home from './Home';
import Dashboard from './components/Dashboard';
import Offers from './components/Offers';
import CreateOrder from './components/CreateOrder';
import FillOrder from './components/FillOrder';
import Settings from './components/Settings';
import Swap from './components/Swap';
import { chainThemes } from './data';
import { OrderProvider, useOrders } from './context/OrderContext';
import { useWallet } from './context/WalletContext';
import { useEVMWallet } from './context/EVMWalletContext';
import SigningModal from './components/SigningModal';
import WalletConnect from './components/WalletConnect';

function MainApp({ onBackToLanding, initialPage = 'dashboard' }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [fillOrderId, setFillOrderId] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address: btcAddress, connected: btcConnected } = useWallet();
  const { address: evmAddress, connected: evmConnected } = useEVMWallet();
  const {
    signingModalOpen,
    signingData,
    closeSigningModal,
    onSigningSuccess,
    onSigningError
  } = useOrders();

  const handleNavigate = (page, orderId = null) => {
    if (page === 'fill' && orderId) {
      setFillOrderId(orderId);
    }
    setCurrentPage(page);
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard chainThemes={chainThemes} onNavigate={handleNavigate} />;
      case 'offers':
        return <Offers chainThemes={chainThemes} onNavigate={handleNavigate} />;
      case 'create':
        return <CreateOrder chainThemes={chainThemes} onNavigate={handleNavigate} />;
      case 'fill':
        return <FillOrder orderId={fillOrderId} chainThemes={chainThemes} onNavigate={handleNavigate} />;
      case 'swap':
        return <Swap chainThemes={chainThemes} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard chainThemes={chainThemes} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <button
          className="logo-mark"
          aria-label="Back to home"
          onClick={onBackToLanding}
          type="button"
        >
          <img src="/name.png" alt="Liquid Nation" className="logo-image" style={{ height: '35px' }} />
        </button>

        <nav className="top-nav">
          <button
            className="top-nav-item"
            onClick={onBackToLanding}
            type="button"
          >
            Home
          </button>
          <button
            className={`top-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={`top-nav-item ${currentPage === 'offers' ? 'active' : ''}`}
            onClick={() => handleNavigate('offers')}
            type="button"
          >
            Offers
          </button>
          <button
            className={`top-nav-item ${currentPage === 'swap' ? 'active' : ''}`}
            onClick={() => handleNavigate('swap')}
            type="button"
          >
            Swap
          </button>
          <button
            className={`top-nav-item ${currentPage === 'create' ? 'active' : ''}`}
            onClick={() => handleNavigate('create')}
            type="button"
          >
            Create
          </button>
          <button
            className={`top-nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigate('settings')}
            type="button"
          >
            Settings
          </button>
        </nav>

        <div className="top-bar-actions">
          <button
            className="wallet-connect-btn"
            onClick={() => setShowWalletModal(true)}
            type="button"
          >
            {btcConnected || evmConnected ? (
              <span>
                {btcConnected && formatAddress(btcAddress)}
                {btcConnected && evmConnected && ' | '}
                {evmConnected && formatAddress(evmAddress)}
              </span>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>

      {showWalletModal && (
        <WalletConnect onClose={() => setShowWalletModal(false)} />
      )}

      {signingModalOpen && signingData && (
        <SigningModal
          isOpen={signingModalOpen}
          onClose={closeSigningModal}
          transactionData={signingData}
          onSuccess={onSigningSuccess}
          onError={onSigningError}
        />
      )}
    </div>
  );
}


function App() {
  const [showApp, setShowApp] = useState(false);
  const [initialPage, setInitialPage] = useState('dashboard');

  const handleLaunchApp = (page = 'dashboard') => {
    setInitialPage(page);
    setShowApp(true);
  };

  const handleBackToLanding = () => {
    setShowApp(false);
  };

  if (showApp) {
    return (
      <OrderProvider>
        <MainApp onBackToLanding={handleBackToLanding} initialPage={initialPage} />
      </OrderProvider>
    );
  }

  return <Home onLaunchApp={handleLaunchApp} />;
}

export default App;

