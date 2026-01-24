import { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { useWallet } from '../context/WalletContext';
import { useEVMWallet } from '../context/EVMWalletContext';
import './FormPanel.css';

function CreateOrder({ chainThemes, onNavigate }) {
  const { createOrder, loading, error } = useOrders();
  const { address: btcAddress, connected: btcConnected, getUtxos } = useWallet();
  const { address: evmAddress, connected: evmConnected } = useEVMWallet();

  const [orderType, setOrderType] = useState('limit-buy');
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [chain, setChain] = useState('ETH');
  const [acceptedTokens, setAcceptedTokens] = useState([]);
  const [partialFills, setPartialFills] = useState(true);
  const [premium, setPremium] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UTXO state
  const [utxos, setUtxos] = useState([]);
  const [selectedUtxo, setSelectedUtxo] = useState(null);
  const [loadingUtxos, setLoadingUtxos] = useState(false);

  // Manual wallet address inputs for testnet
  const [manualBtcAddress, setManualBtcAddress] = useState('');
  const [manualEvmAddress, setManualEvmAddress] = useState('');

  // Use manual address if provided, otherwise use connected wallet
  const effectiveBtcAddress = manualBtcAddress || btcAddress;
  const effectiveEvmAddress = manualEvmAddress || evmAddress;

  const chains = Object.keys(chainThemes);
  const availableAssets = chains; // Use the same chains/tokens as available assets

  // Fetch UTXOs when BTC wallet is connected
  useEffect(() => {
    const fetchUtxos = async () => {
      if (btcConnected && btcAddress && getUtxos) {
        setLoadingUtxos(true);
        try {
          const fetchedUtxos = await getUtxos(btcAddress);
          console.log('Fetched UTXOs:', fetchedUtxos);
          setUtxos(fetchedUtxos || []);
          // Auto-select first UTXO if available
          if (fetchedUtxos && fetchedUtxos.length > 0) {
            setSelectedUtxo(fetchedUtxos[0]);
          }
        } catch (err) {
          console.error('Failed to fetch UTXOs:', err);
          setUtxos([]);
        } finally {
          setLoadingUtxos(false);
        }
      }
    };
    fetchUtxos();
  }, [btcConnected, btcAddress, getUtxos]);

  const handleTokenToggle = (token) => {
    if (acceptedTokens.includes(token)) {
      setAcceptedTokens(acceptedTokens.filter(t => t !== token));
    } else {
      setAcceptedTokens([...acceptedTokens, token]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate wallet - either connected or manual address required
    if (!effectiveBtcAddress && !effectiveEvmAddress) {
      setSubmitError('Please connect a wallet or enter a testnet address');
      return;
    }

    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      setSubmitError('Please enter a valid amount');
      return;
    }

    if (acceptedTokens.length === 0) {
      setSubmitError('Please select at least one accepted token');
      return;
    }

    // Validate UTXO selection for connected wallets
    if (btcConnected && !selectedUtxo) {
      setSubmitError('Please select a UTXO to fund your order');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the order with all the form data including wallet addresses and UTXO
      const newOrder = {
        orderType,
        asset: `${amount} ${asset}`,
        chain,
        accepts: acceptedTokens,
        partial: partialFills,
        premium: `${premium}%`,
        btcWallet: effectiveBtcAddress,
        evmWallet: effectiveEvmAddress,
        // Include UTXO for funding the order
        fundingUtxo: selectedUtxo ? `${selectedUtxo.txid}:${selectedUtxo.vout}` : '',
        fundingUtxoValue: selectedUtxo ? selectedUtxo.value : 0,
      };

      console.log('📤 Creating order with data:', newOrder);
      console.log('📦 Selected UTXO:', selectedUtxo);

      await createOrder(newOrder);

      // Reset form
      setOrderType('limit-buy');
      setAsset('BTC');
      setAmount('');
      setChain('ETH');
      setAcceptedTokens([]);
      setPartialFills(true);
      setPremium('');
      // Keep wallet addresses for convenience

      // Navigate back to dashboard to see the newly created order
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      setSubmitError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-panel" aria-label="Create order">
      <div className="form-panel-header">
        <h1>Create Order</h1>
      </div>

      <div className="form-panel-content">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="form-label">Order Type</label>
            <div className="order-type-buttons">
              <button
                type="button"
                className={`order-type-btn ${orderType === 'limit-buy' ? 'active' : ''}`}
                onClick={() => setOrderType('limit-buy')}
              >
                Limit Buy Order
              </button>
              <button
                type="button"
                className={`order-type-btn ${orderType === 'limit-sell' ? 'active' : ''}`}
                onClick={() => setOrderType('limit-sell')}
              >
                Limit Sell Order
              </button>
              <button
                type="button"
                className={`order-type-btn ${orderType === 'market-buy' ? 'active' : ''}`}
                onClick={() => setOrderType('market-buy')}
              >
                Market Buy Order
              </button>
              <button
                type="button"
                className={`order-type-btn ${orderType === 'market-sell' ? 'active' : ''}`}
                onClick={() => setOrderType('market-sell')}
              >
                Market Sell Order
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="asset">Asset</label>
              <select
                id="asset"
                className="form-select"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                required
              >
                {availableAssets.map(assetName => (
                  <option key={assetName} value={assetName}>
                    {chainThemes[assetName].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="chain">Chain</label>
              <select
                id="chain"
                className="form-select"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
              >
                {chains.map(chainName => (
                  <option key={chainName} value={chainName}>
                    {chainThemes[chainName].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="premium">Premium (%)</label>
              <input
                type="number"
                id="premium"
                className="form-input"
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
                placeholder="0.0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Wallet Selection</label>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="btcWallet">Bitcoin Testnet Address</label>
                <input
                  type="text"
                  id="btcWallet"
                  className="form-input"
                  value={manualBtcAddress}
                  onChange={(e) => setManualBtcAddress(e.target.value)}
                  placeholder="tb1p... or tb1q... (testnet4 address)"
                  style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
                />
                {btcConnected && !manualBtcAddress && (
                  <p className="form-help" style={{ color: '#4a9', marginTop: '8px' }}>
                    ✓ Connected wallet: {btcAddress?.slice(0, 12)}...{btcAddress?.slice(-6)}
                  </p>
                )}
                {!btcConnected && !manualBtcAddress && (
                  <p className="form-help" style={{ color: 'var(--text-subtle)', marginTop: '8px' }}>
                    Enter your testnet4 Bitcoin address or connect a wallet
                  </p>
                )}
                {manualBtcAddress && (
                  <p className="form-help" style={{ color: '#4a9', marginTop: '8px' }}>
                    ✓ Using manual address
                  </p>
                )}
              </div>

              {/* UTXO Selection */}
              {btcConnected && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Select UTXO to Fund Order</label>
                  {loadingUtxos ? (
                    <p className="form-help">Loading UTXOs...</p>
                  ) : utxos.length === 0 ? (
                    <p className="form-help" style={{ color: '#f90' }}>
                      No UTXOs found. Make sure you have testnet BTC in your wallet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {utxos.map((utxo, index) => (
                        <button
                          key={`${utxo.txid}:${utxo.vout}`}
                          type="button"
                          onClick={() => setSelectedUtxo(utxo)}
                          style={{
                            padding: '0.75rem 1rem',
                            background: selectedUtxo?.txid === utxo.txid && selectedUtxo?.vout === utxo.vout
                              ? 'linear-gradient(135deg, var(--color--prime) 0%, var(--color--prime-second) 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid',
                            borderColor: selectedUtxo?.txid === utxo.txid && selectedUtxo?.vout === utxo.vout
                              ? 'transparent'
                              : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: 'Manrope, sans-serif',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              {utxo.txid.slice(0, 8)}...{utxo.txid.slice(-8)}:{utxo.vout}
                            </span>
                            <span style={{ fontWeight: '600', color: '#4a9' }}>
                              {(utxo.value / 100000000).toFixed(8)} tBTC
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedUtxo && (
                    <p className="form-help" style={{ color: '#4a9', marginTop: '8px' }}>
                      ✓ Selected: {(selectedUtxo.value / 100000000).toFixed(8)} tBTC
                    </p>
                  )}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="evmWallet">EVM Address (Optional)</label>
                <input
                  type="text"
                  id="evmWallet"
                  className="form-input"
                  value={manualEvmAddress}
                  onChange={(e) => setManualEvmAddress(e.target.value)}
                  placeholder="0x... (for cross-chain orders)"
                  style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
                />
                {evmConnected && !manualEvmAddress && (
                  <p className="form-help" style={{ color: '#4a9', marginTop: '8px' }}>
                    ✓ Connected wallet: {evmAddress?.slice(0, 8)}...{evmAddress?.slice(-6)}
                  </p>
                )}
                {!evmConnected && !manualEvmAddress && (
                  <p className="form-help" style={{ color: 'var(--text-subtle)', marginTop: '8px' }}>
                    Optional: For cross-chain swaps
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Accepted Tokens</label>
            <div className="token-selector">
              {chains.map(token => (
                <button
                  key={token}
                  type="button"
                  className={`token-selector-btn ${acceptedTokens.includes(token) ? 'selected' : ''}`}
                  onClick={() => handleTokenToggle(token)}
                  style={{
                    background: acceptedTokens.includes(token)
                      ? chainThemes[token].background
                      : '#f0f0f0',
                    color: acceptedTokens.includes(token)
                      ? chainThemes[token].textColor
                      : '#666'
                  }}
                >
                  {chainThemes[token].label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={partialFills}
                onChange={(e) => setPartialFills(e.target.checked)}
              />
              <span>Allow partial fills</span>
            </label>
          </div>

          {(submitError || error) && (
            <div className="form-error" style={{
              padding: '12px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              marginBottom: '16px'
            }}>
              {submitError || error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting || loading || (!effectiveBtcAddress && !effectiveEvmAddress)}
            >
              {isSubmitting || loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateOrder;
