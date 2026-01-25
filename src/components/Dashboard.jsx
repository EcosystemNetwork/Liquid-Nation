import { useState, useRef, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { useWallet } from '../context/WalletContext';
import { useEVMWallet } from '../context/EVMWalletContext';
import TransactionHistory from './TransactionHistory';
import './Dashboard.css';

function Avatar({ symbol, color }) {
  return (
    <div className="avatar" style={{ backgroundColor: color }}>
      <span>{symbol}</span>
    </div>
  );
}

function TokenBadge({ token, chainThemes }) {
  const theme = chainThemes[token] || chainThemes.ETH;
  return (
    <div className="chain-badge" style={{ background: theme.background, color: theme.textColor }}>
      {theme.label}
    </div>
  );
}

function StatusProgress({ percent }) {
  const value = percent ? parseInt(percent) : 0;

  if (value === 0) {
    return <span className="status-zero">0%</span>;
  }

  // Color based on progress
  const color = value >= 100 ? '#5bc35b' : value > 50 ? '#f5a623' : '#4bb4e6';

  return (
    <div
      className="status-progress"
      style={{
        background: `conic-gradient(${color} ${value * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
      }}
    >
      <div className="status-progress-inner">
        {value}%
      </div>
    </div>
  );
}

function Dashboard({ chainThemes, onNavigate }) {
  const { orders, deleteOrder, cancelAllOrders, loading } = useOrders();
  const { address: btcAddress } = useWallet();
  const { address: evmAddress } = useEVMWallet();

  // Filter for user's orders
  const userOrders = orders.filter(order => {
    if (!btcAddress && !evmAddress) return true;
    return (btcAddress && order.btcWallet === btcAddress) ||
      (evmAddress && order.evmWallet === evmAddress) ||
      (btcAddress && order.makerAddress === btcAddress) ||
      (evmAddress && order.makerAddress === evmAddress);
  });

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTxHistory, setShowTxHistory] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Calculate pagination
  const totalOrders = userOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalOrders);
  const paginatedOrders = userOrders.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
    setShowDropdown(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await deleteOrder(orderId);
        if (paginatedOrders.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error('Failed to cancel order:', err);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const handleCancelAllOrders = async () => {
    if (userOrders.length === 0) return;
    if (window.confirm(`Are you sure you want to cancel all ${userOrders.length} order${userOrders.length > 1 ? 's' : ''}?`)) {
      try {
        const userName = userOrders[0]?.name;
        if (userName) {
          await cancelAllOrders(userName);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Failed to cancel all orders:', err);
        alert('Failed to cancel orders. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Main Orders Panel */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <h1>My Orders</h1>
          <div className="header-actions">
            {userOrders.length > 0 && (
              <button
                type="button"
                className="btn-cancel-all"
                onClick={handleCancelAllOrders}
              >
                Cancel All
              </button>
            )}
            <button
              type="button"
              className="btn-create"
              onClick={() => onNavigate('create')}
            >
              Create Order
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading orders...</p>
          </div>
        ) : userOrders.length === 0 ? (
          <div className="empty-state">
            <p>You don't have any open orders yet.</p>
            <p>Click "Create Order" to get started!</p>
          </div>
        ) : (
          <>
            <div className="orders-table">
              <div className="table-header">
                <span>Profile / Actions</span>
                <span>Asset</span>
                <span>Chain</span>
                <span>Accepts</span>
                <span>Partial</span>
                <span>Status</span>
                <span>Premium</span>
                <span></span>
              </div>

              {paginatedOrders.map((offer) => (
                <div className="table-row" key={`${offer.name}-${offer.orderId}`}>
                  <div className="profile-cell">
                    <div className="profile-info">
                      <Avatar symbol={offer.avatar} color={offer.avatarColor} />
                      <span className="profile-name">{offer.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-cancel-row"
                      onClick={() => handleCancelOrder(offer.orderId)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="asset-text">{offer.asset}</div>
                  <div>
                    <TokenBadge token={offer.chain} chainThemes={chainThemes} />
                  </div>
                  <div className="accepts-cell">
                    {offer.accepts.map((token) => (
                      <TokenBadge key={`${offer.orderId}-${token}`} token={token} chainThemes={chainThemes} />
                    ))}
                  </div>
                  <div className="partial-text">{offer.partial ? 'Yes' : 'No'}</div>
                  <div>
                    <StatusProgress percent={offer.status} />
                  </div>
                  <div className="premium-text">{offer.premium}</div>
                  <div className="order-actions">
                    <button
                      type="button"
                      className="btn-view-order"
                      onClick={() => onNavigate('order', offer.id || offer.orderId)}
                    >
                      My Order
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel-footer">
              <div></div>
              <div className="pagination">
                <span>Orders Per Page:</span>
                <div className="dropdown" ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {itemsPerPage} ▼
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      {[10, 25, 50, 100].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleItemsPerPageChange(value)}
                          className={itemsPerPage === value ? 'active' : ''}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span>
                  {totalOrders === 0 ? '0-0 of 0' : `${startIndex + 1}-${endIndex} of ${totalOrders}`}
                </span>
                <button
                  type="button"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transaction History Panel */}
      <div className="tx-history-panel">
        <div
          className="tx-history-header"
          onClick={() => setShowTxHistory(!showTxHistory)}
        >
          <span>📜</span>
          <h2>Transaction History</h2>
          <span>{showTxHistory ? '▲' : '▼'}</span>
        </div>
        {showTxHistory && <TransactionHistory />}
      </div>
    </div>
  );
}

export default Dashboard;
