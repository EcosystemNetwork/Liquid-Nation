/**
 * SigningModal Component
 * 
 * Handles the transaction signing flow for order creation, filling, and cancellation.
 * Displays unsigned transactions and guides users through the signing process.
 */

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { broadcastOrder } from '../services/api';
import './SigningModal.css';

const SigningModal = ({
  isOpen,
  onClose,
  orderId,
  unsignedTxs = [],
  signingInstructions = {},
  spell = {},
  onSuccess,
  onError,
}) => {
  const [step, setStep] = useState(1);
  const [signedTxHex, setSignedTxHex] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txResult, setTxResult] = useState(null);

  const wallet = useWallet();
  const { connected, signPsbt, address } = wallet || {};

  // Check if this is a mock transaction (contains "mock" in hex or txid)
  const isMockTransaction = unsignedTxs.length > 0 && (
    unsignedTxs[0]?.hex?.includes('mock') ||
    unsignedTxs[0]?.txid?.includes('mock') ||
    unsignedTxs[0]?.hex?.length < 100
  );

  // Check if the hex is a valid PSBT (starts with "cHNidP" in base64 or "70736274" in hex)
  const isPsbtFormat = unsignedTxs.length > 0 && (
    unsignedTxs[0]?.hex?.startsWith('cHNidP') || // base64 PSBT magic
    unsignedTxs[0]?.hex?.startsWith('70736274') // hex PSBT magic "psbt"
  );

  // Charms transactions are ZK-proved raw transactions, not PSBTs
  const isCharmsTransaction = unsignedTxs.length > 0 && !isPsbtFormat && !isMockTransaction;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('SigningModal opened with data:', {
        unsignedTxs,
        orderId,
        signingInstructions,
      });
      setStep(1);
      setSignedTxHex('');
      setError(null);
      setTxResult(null);
    }
  }, [isOpen, unsignedTxs, orderId, signingInstructions]);

  // Log wallet status for debugging
  useEffect(() => {
    console.log('SigningModal wallet status:', {
      connected,
      hasSignPsbt: typeof signPsbt === 'function',
      address,
      walletObject: wallet,
    });
  }, [connected, signPsbt, address, wallet]);

  // Sign the transaction with wallet
  const handleSign = useCallback(async () => {
    console.log('handleSign called:', {
      connected,
      hasSignPsbt: !!signPsbt,
      isMockTransaction,
      isPsbtFormat,
      isCharmsTransaction
    });

    if (unsignedTxs.length === 0) {
      setError('No transaction to sign');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const unsignedTx = unsignedTxs[0];

      // Case 1: Mock transactions - simulate signing
      if (isMockTransaction) {
        console.log('Mock transaction - simulating signature');
        setSignedTxHex(`signed_mock_${unsignedTx.txid || 'tx'}`);
        setStep(2);
        return;
      }

      // Case 2: Charms ZK-proved transactions - no wallet signing needed
      // These transactions are already proved with ZK proofs and just need to be broadcast
      if (isCharmsTransaction) {
        console.log('Charms ZK-proved transaction - ready for broadcast');
        console.log('Transaction hex:', unsignedTx.hex?.substring(0, 80) + '...');
        // Use the raw transaction hex directly - it's already signed by the ZK proof
        setSignedTxHex(unsignedTx.hex);
        setStep(2);
        return;
      }

      // Case 3: PSBT format - use wallet signing
      if (isPsbtFormat && connected && typeof signPsbt === 'function') {
        console.log('PSBT format detected - using wallet signPsbt');
        try {
          const signedPsbt = await signPsbt(unsignedTx.hex, {
            finalize: true,
            broadcast: false,
          });
          console.log('signPsbt returned:', signedPsbt?.substring(0, 50) + '...');
          setSignedTxHex(signedPsbt);
          setStep(2);
          return;
        } catch (walletErr) {
          console.error('Wallet PSBT signing failed:', walletErr);
          throw walletErr;
        }
      }

      // Fallback: If we have a transaction but couldn't categorize it, try direct broadcast
      if (unsignedTx.hex) {
        console.log('Unknown format - attempting direct broadcast with raw hex');
        setSignedTxHex(unsignedTx.hex);
        setStep(2);
        return;
      }

      setError('Unable to process transaction. Unknown format.');
    } catch (err) {
      console.error('Signing error:', err);
      setError(`Failed to process transaction: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [connected, signPsbt, unsignedTxs, isMockTransaction, isPsbtFormat, isCharmsTransaction]);

  // Broadcast the signed transaction
  const handleBroadcast = useCallback(async () => {
    if (!signedTxHex) {
      setError('No signed transaction to broadcast');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await broadcastOrder(orderId, signedTxHex);

      if (result.status === 'confirmed' || result.status === 'success') {
        setTxResult(result);
        setStep(3);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        throw new Error(result.message || 'Broadcast failed');
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      setError(`Failed to broadcast: ${err.message}`);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [signedTxHex, orderId, onSuccess, onError]);

  // Handle manual transaction input
  const handleManualInput = (e) => {
    setSignedTxHex(e.target.value);
    if (e.target.value) {
      setStep(2);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="signing-modal-overlay" onClick={onClose}>
      <div className="signing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h2>🔐 Sign Transaction</h2>
          <p className="modal-subtitle">
            {signingInstructions.message || 'Complete the transaction signing process'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="signing-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Review</span>
          </div>
          <div className="step-connector" />
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Sign</span>
          </div>
          <div className="step-connector" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Broadcast</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Step 1: Review Transaction */}
        {step === 1 && (
          <div className="step-content">
            <h3>📋 Transaction Details</h3>

            {/* Wallet Status */}
            <div className={`wallet-status-banner ${connected ? 'connected' : 'disconnected'}`}>
              <span>{connected ? '🔗' : '⚠️'}</span>
              <p>
                {connected
                  ? <>Wallet connected: <code>{address?.slice(0, 8)}...{address?.slice(-6)}</code></>
                  : <strong>No Bitcoin wallet connected</strong>
                }
              </p>
            </div>

            {isMockTransaction && (
              <div className="mock-banner">
                <span>🧪</span>
                <p><strong>Mock Mode:</strong> This is a simulated transaction. No real Bitcoin will be sent.</p>
              </div>
            )}

            {isCharmsTransaction && (
              <div className="charms-banner" style={{ background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.1))', border: '1px solid rgba(138, 43, 226, 0.3)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span>✨</span>
                <p style={{ margin: 0 }}><strong>Charms ZK Transaction:</strong> This transaction is verified with zero-knowledge proofs. Click to proceed to broadcast.</p>
              </div>
            )}

            {unsignedTxs && unsignedTxs.length > 0 ? (
              <div className="tx-details">
                <div className="tx-info-row">
                  <span className="label">Transaction ID:</span>
                  <span className="value mono">{unsignedTxs[0]?.txid || 'Pending...'}</span>
                </div>
                <div className="tx-info-row">
                  <span className="label">Inputs to sign:</span>
                  <span className="value">{unsignedTxs[0]?.inputs_to_sign?.length || 1}</span>
                </div>

                {unsignedTxs[0]?.hex && (
                  <details className="tx-hex-details">
                    <summary>View Transaction Hex</summary>
                    <pre className="tx-hex">{unsignedTxs[0].hex}</pre>
                  </details>
                )}
              </div>
            ) : (
              <div className="no-tx">
                <p>No transaction data available</p>
                <p className="tx-debug" style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  Debug: unsignedTxs = {JSON.stringify(unsignedTxs)}
                </p>
              </div>
            )}

            {/* Instructions */}
            {signingInstructions.steps?.length > 0 && (
              <div className="instructions">
                <h4>Instructions:</h4>
                <ol>
                  {signingInstructions.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="modal-actions">
              {/* Charms ZK Transaction - No wallet signing needed */}
              {isCharmsTransaction ? (
                <button
                  className="btn-primary"
                  onClick={handleSign}
                  disabled={isLoading || unsignedTxs.length === 0}
                >
                  {isLoading ? '⏳ Processing...' : '✨ Proceed to Broadcast'}
                </button>
              ) : isMockTransaction ? (
                <button
                  className="btn-primary"
                  onClick={handleSign}
                  disabled={isLoading || unsignedTxs.length === 0}
                >
                  {isLoading ? '⏳ Simulating...' : '🧪 Simulate Signature (Mock)'}
                </button>
              ) : connected ? (
                <button
                  className="btn-primary"
                  onClick={handleSign}
                  disabled={isLoading || unsignedTxs.length === 0}
                >
                  {isLoading ? '⏳ Signing...' : '✍️ Sign with Wallet'}
                </button>
              ) : (
                <div className="wallet-not-connected">
                  <p>Please connect your Bitcoin wallet to sign</p>
                  <button className="btn-secondary" onClick={onClose}>
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Manual signing option */}
            <details className="manual-sign">
              <summary>Sign manually (advanced)</summary>
              <div className="manual-sign-content">
                <p>Copy the transaction hex above, sign it with your wallet, and paste the signed transaction below:</p>
                <textarea
                  placeholder="Paste signed transaction hex here..."
                  value={signedTxHex}
                  onChange={handleManualInput}
                  rows={4}
                />
              </div>
            </details>
          </div>
        )}

        {/* Step 2: Confirm and Broadcast */}
        {step === 2 && (
          <div className="step-content">
            <h3>✅ Transaction Signed</h3>

            <div className="signed-status">
              <div className="success-icon">✓</div>
              <p>Your transaction has been signed successfully!</p>
            </div>

            <div className="tx-details">
              <div className="tx-info-row">
                <span className="label">Signed Transaction:</span>
                <span className="value truncated mono">{signedTxHex.slice(0, 32)}...</span>
              </div>
            </div>

            <div className="broadcast-warning">
              <span>⚡</span>
              <p>Broadcasting will lock your tokens in the escrow contract. This action cannot be undone.</p>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn-primary"
                onClick={handleBroadcast}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Broadcasting...' : '📡 Broadcast Transaction'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && txResult && (
          <div className="step-content">
            <h3>🎉 Transaction Confirmed!</h3>

            <div className="success-status">
              <div className="success-icon large">✓</div>
              <p>Your tokens are now locked in escrow</p>
            </div>

            <div className="tx-details">
              <div className="tx-info-row">
                <span className="label">Transaction ID:</span>
                <a
                  href={`https://mempool.space/testnet4/tx/${txResult.txid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="value link mono"
                >
                  {txResult.txid}
                </a>
              </div>
              <div className="tx-info-row">
                <span className="label">Status:</span>
                <span className="value status-confirmed">{txResult.status}</span>
              </div>
            </div>

            <p className="success-message">{txResult.message}</p>

            <div className="modal-actions">
              <button className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SigningModal;

