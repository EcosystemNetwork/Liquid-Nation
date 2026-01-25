import { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { useWallet } from '../context/WalletContext';
import { useEVMWallet } from '../context/EVMWalletContext';
import './FormPanel.css';

function CreateOrder({ chainThemes, onNavigate }) {
  const { createOrder, loading, error } = useOrders();
  const { address: btcAddress, connected: btcConnected, getUtxos } = useWallet();
  const { address: evmAddress, connected: evmConnected } = useEVMWallet();

  const [currentStep, setCurrentStep] = useState(1);
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

  const effectiveBtcAddress = manualBtcAddress || btcAddress;
  const effectiveEvmAddress = manualEvmAddress || evmAddress;

  const chains = Object.keys(chainThemes);
  const availableAssets = chains;

  useEffect(() => {
    const fetchUtxos = async () => {
      if (btcConnected && btcAddress && getUtxos) {
        setLoadingUtxos(true);
        try {
          const fetchedUtxos = await getUtxos(btcAddress);
          console.log('Fetched UTXOs:', fetchedUtxos);
          setUtxos(fetchedUtxos || []);
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

  const validateStep1 = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setSubmitError('Please enter a valid amount');
      return false;
    }
    if (!premium || parseFloat(premium) < 0) {
      setSubmitError('Please enter a valid premium');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateStep2 = () => {
    if (acceptedTokens.length === 0) {
      setSubmitError('Please select at least one accepted token');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!effectiveBtcAddress && !effectiveEvmAddress) {
      setSubmitError('Please connect a wallet or enter a testnet address');
      return false;
    }
    if (btcConnected && !selectedUtxo) {
      setSubmitError('Please select a UTXO to fund your order');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setSubmitError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubmitError(null);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!validateStep3()) return;

    (async () => {
      try {
        setIsSubmitting(true);

      const newOrder = {
        orderType,
        asset: `${amount} ${asset}`,
        chain,
        accepts: acceptedTokens,
        partial: partialFills,
        premium: `${premium}%`,
        btcWallet: effectiveBtcAddress,
        evmWallet: effectiveEvmAddress,
        fundingUtxo: selectedUtxo ? `${selectedUtxo.txid}:${selectedUtxo.vout}` : '',
        fundingUtxoValue: selectedUtxo ? selectedUtxo.value : 0,
      };

      console.log('📤 Creating order with data:', newOrder);
      await createOrder(newOrder);

      // Reset form
      setCurrentStep(1);
      setOrderType('limit-buy');
      setAsset('BTC');
      setAmount('');
      setChain('ETH');
      setAcceptedTokens([]);
      setPartialFills(true);
      setPremium('');

      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err) {
      console.error('Failed to create order:', err);
      setSubmitError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  })();
  };

  const steps = [
    { number: 1, title: 'Order Details', description: 'Set type, asset & amount' },
    { number: 2, title: 'Token Selection', description: 'Choose accepted tokens' },
    { number: 3, title: 'Wallet & Funding', description: 'Connect wallet & select UTXO' }
  ];

  return (
    <section className="form-panel" aria-label="Create order">
      <div className="form-panel-header">
        <h1>Create Order</h1>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem 2rem 1rem',
        position: 'relative'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: '2.75rem',
          left: '2rem',
          right: '2rem',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--color--prime), var(--color--prime-second))',
            width: `${((currentStep - 1) / 2) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              zIndex: 1
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: currentStep >= step.number
                ? 'linear-gradient(135deg, var(--color--prime), var(--color--prime-second))'
                : 'rgba(255, 255, 255, 0.05)',
              border: currentStep >= step.number ? 'none' : '2px solid rgba(255, 255, 255, 0.2)',
              color: currentStep >= step.number ? 'white' : 'rgba(255, 255, 255, 0.4)',
              fontWeight: '700',
              fontSize: '1.125rem',
              transition: 'all 0.3s ease',
              marginBottom: '0.75rem'
            }}>
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <div style={{ textAlign: 'center', maxWidth: '140px' }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: currentStep >= step.number ? 'white' : 'rgba(255, 255, 255, 0.5)',
                marginBottom: '0.25rem'
              }}>
                {step.title}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.4)'
              }}>
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-panel-content">
        <div onSubmit={handleSubmit}>
          {/* Step 1: Order Details */}
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-section">
                <label className="form-label">Order Type</label>
                <div className="order-type-buttons">
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'limit-buy' ? 'active' : ''}`}
                    onClick={() => setOrderType('limit-buy')}
                  >
                    Limit Buy
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'limit-sell' ? 'active' : ''}`}
                    onClick={() => setOrderType('limit-sell')}
                  >
                    Limit Sell
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'market-buy' ? 'active' : ''}`}
                    onClick={() => setOrderType('market-buy')}
                  >
                    Market Buy
                  </button>
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'market-sell' ? 'active' : ''}`}
                    onClick={() => setOrderType('market-sell')}
                  >
                    Market Sell
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
            </div>
          )}

          {/* Step 2: Token Selection */}
          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-group">
                <label className="form-label">Accepted Tokens</label>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Select which tokens you're willing to accept for this order
                </p>
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
                          : '#666',
                        transform: acceptedTokens.includes(token) ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {chainThemes[token].label}
                    </button>
                  ))}
                </div>
                {acceptedTokens.length > 0 && (
                  <p style={{ color: '#4a9', fontSize: '0.875rem', marginTop: '1rem' }}>
                    ✓ {acceptedTokens.length} token{acceptedTokens.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={partialFills}
                    onChange={(e) => setPartialFills(e.target.checked)}
                  />
                  <span>Allow partial fills</span>
                </label>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  Your order can be filled in multiple smaller transactions
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Wallet & Funding */}
          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="form-section">
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
                        ✓ Connected: {btcAddress?.slice(0, 12)}...{btcAddress?.slice(-6)}
                      </p>
                    )}
                    {manualBtcAddress && (
                      <p className="form-help" style={{ color: '#4a9', marginTop: '8px' }}>
                        ✓ Using manual address
                      </p>
                    )}
                  </div>

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
                        ✓ Connected: {evmAddress?.slice(0, 8)}...{evmAddress?.slice(-6)}
                      </p>
                    )}
                  </div>
                </div>

                {/* UTXO Selection */}
                {btcConnected && (
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">Select UTXO to Fund Order</label>
                    {loadingUtxos ? (
                      <p className="form-help">Loading UTXOs...</p>
                    ) : utxos.length === 0 ? (
                      <p className="form-help" style={{ color: '#f90' }}>
                        No UTXOs found. Make sure you have testnet BTC in your wallet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {utxos.map((utxo) => (
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
                              transition: 'all 0.2s ease'
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
              </div>
            </div>
          )}

          {(submitError || error) && (
            <div className="form-error" style={{
              padding: '12px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33',
              marginTop: '1rem'
            }}>
              {submitError || error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-actions" style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-submit"
                style={{ flex: 1 }}
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-submit"
                disabled={isSubmitting || loading || (!effectiveBtcAddress && !effectiveEvmAddress)}
                style={{ flex: 1 }}
              >
                {isSubmitting || loading ? 'Creating...' : 'Create Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default CreateOrder;