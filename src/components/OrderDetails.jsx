import { useEffect, useMemo, useState } from 'react';
import { useOrders } from '../context/OrderContext';
import * as api from '../services/api';
import './OrderDetails.css';

function OrderDetails({ orderId, onNavigate }) {
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);
  const [apiOrder, setApiOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const localOrder = useMemo(() => {
    if (!orderId) return null;
    return orders.find((o) => o.id === orderId || o.orderId === orderId) || null;
  }, [orders, orderId]);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      if (!orderId) {
        setError('Order id is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const apiLookupId = localOrder?.id || (orderId.startsWith('#') ? '' : orderId);
        if (!apiLookupId) {
          if (active) setLoading(false);
          return;
        }

        const response = await api.getOrder(apiLookupId);
        if (!active) return;
        if (response) {
          setApiOrder(response);
        }
      } catch (err) {
        if (!active) return;
        if (!localOrder) {
          setError(err.message || 'Failed to load order details.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    setOrder(localOrder);
    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId, localOrder]);

  const displayId = apiOrder?.id || order?.id || orderId;
  const maker = apiOrder?.maker_address || order?.makerAddress || order?.btcWallet || '—';
  const offer = apiOrder
    ? `${apiOrder.offer_amount} ${apiOrder.offer_token}`
    : order?.asset || '—';
  const want = apiOrder
    ? `${apiOrder.want_amount} ${apiOrder.want_token}`
    : order?.premium || '—';
  const status = apiOrder?.status || order?.rawStatus || 'unknown';
  const chain = apiOrder?.source_chain || order?.chain || '—';
  const expiry = apiOrder?.expiry_height ?? order?.expiryHeight ?? '—';
  const utxo = apiOrder?.utxo_id || order?.utxoId || '—';
  const txid = apiOrder?.tx_id || order?.txid || '—';

  return (
    <section className="order-details">
      <div className="order-details-card">
        <div className="order-details-header">
          <div>
            <h1>My Order</h1>
            <p className="order-details-subtitle">Order details and status</p>
          </div>
          <button
            type="button"
            className="order-details-back"
            onClick={() => onNavigate('dashboard')}
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="order-details-loading">Loading order details...</div>
        ) : (
          <div className="order-details-grid">
            {error && <div className="order-details-error">{error}</div>}
            <div>
              <span>Order ID</span>
              <strong>{displayId}</strong>
            </div>
            <div>
              <span>Maker</span>
              <strong>{maker}</strong>
            </div>
            <div>
              <span>Offer</span>
              <strong>{offer}</strong>
            </div>
            <div>
              <span>Want</span>
              <strong>{want}</strong>
            </div>
            <div>
              <span>Chain</span>
              <strong>{chain}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{status}</strong>
            </div>
            <div>
              <span>Expiry Height</span>
              <strong>{expiry}</strong>
            </div>
            <div>
              <span>Funding UTXO</span>
              <strong>{utxo}</strong>
            </div>
            <div>
              <span>Transaction ID</span>
              <strong>
                {txid && txid !== '—' ? (
                  <a
                    href={`https://mempool.space/testnet4/tx/${txid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="order-details-link"
                  >
                    {txid.length > 16 ? `${txid.slice(0, 8)}...${txid.slice(-8)}` : txid}
                  </a>
                ) : (
                  txid
                )}
              </strong>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrderDetails;
