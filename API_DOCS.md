# Liquid Nation API Documentation

Base URL: `http://localhost:3001`

---

## Health Endpoints

### GET `/health` | `/api/health`
System health check with Prover API status.

**Response:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2026-01-05T08:37:15.611718+00:00",
  "prover_api": {
    "url": "https://v8.charms.dev/spells/prove",
    "reachable": true,
    "latency_ms": 1293,
    "error": null
  }
}
```

---

### GET `/api/health/prover`
Check Prover API reachability only.

**Response:**
```json
{
  "url": "https://v8.charms.dev/spells/prove",
  "reachable": true,
  "latency_ms": 1293,
  "error": null
}
```

---

## Order Endpoints

### GET `/api/orders`
List all orders with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `offer_token` | string | Filter by offer token |
| `want_token` | string | Filter by want token |
| `maker_address` | string | Filter by maker address |
| `source_chain` | string | Filter by source chain |
| `dest_chain` | string | Filter by destination chain |
| `limit` | number | Max results (default: 20) |
| `offset` | number | Pagination offset |

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid-string",
      "maker_address": "tb1q...",
      "offer_token": "TOAD",
      "offer_amount": "1000",
      "want_token": "BTC",
      "want_amount": "10000",
      "source_chain": "bitcoin",
      "dest_chain": "bitcoin",
      "status": "open",
      "allow_partial": true,
      "filled_amount": "0",
      "expiry_height": 850000,
      "created_at": "2026-01-05T08:37:15Z",
      "updated_at": "2026-01-05T08:37:15Z",
      "utxo_id": "abc123:0"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

---

### POST `/api/orders`
Create a new swap order.

**Request Body:**
```json
{
  "maker_address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "maker_pubkey": "02...", 
  "offer_token": "TOAD",
  "offer_amount": "1000",
  "want_token": "BTC",
  "want_amount": "10000",
  "source_chain": "bitcoin",
  "dest_chain": "bitcoin",
  "allow_partial": true,
  "expiry_blocks": 144,
  "funding_utxo": "txid:vout",
  "funding_utxo_value": 50000,
  "dest_address": "tb1q..."
}
```

**Response:**
```json
{
  "order": { /* Order object */ },
  "spell": {
    "spell_yaml": "version: 8...",
    "spell_yaml_built": "...",
    "app_binary": "",
    "prev_txs": []
  },
  "unsigned_txs": [
    {
      "hex": "0200000001...",
      "txid": "abc123",
      "inputs_to_sign": [
        {
          "index": 0,
          "address": "tb1q...",
          "sighash_type": "SIGHASH_DEFAULT"
        }
      ]
    }
  ],
  "signing_instructions": {
    "message": "Please sign the transaction...",
    "steps": ["1. Review...", "2. Sign...", "3. Submit..."],
    "broadcast_endpoint": "/api/orders/{id}/broadcast"
  }
}
```

---

### GET `/api/orders/:id`
Get a specific order by ID.

**Response:**
```json
{
  "id": "uuid-string",
  "maker_address": "tb1q...",
  "offer_token": "TOAD",
  "offer_amount": "1000",
  "want_token": "BTC",
  "want_amount": "10000",
  "source_chain": "bitcoin",
  "dest_chain": "bitcoin",
  "status": "open",
  "allow_partial": true,
  "filled_amount": "0",
  "expiry_height": 850000,
  "created_at": "2026-01-05T08:37:15Z",
  "updated_at": "2026-01-05T08:37:15Z",
  "utxo_id": "abc123:0"
}
```

---

### POST `/api/orders/:id/fill`
Fill an order (atomic swap).

**Request Body:**
```json
{
  "taker_address": "tb1q...",
  "taker_pubkey": "02...",
  "taker_utxo": "txid:vout",
  "taker_utxo_value": 10000,
  "fill_amount": "1000"
}
```

**Response:** Same format as create order response.

---

### POST `/api/orders/:id/partial-fill`
Partially fill an order.

**Request Body:** Same as fill order.

**Response:** Same format as fill order, with `status: "partiallyfilled"`.

---

### DELETE `/api/orders/:id/cancel`
Cancel an open order.

**Response:** Same format as fill order, with cancellation spell.

---

### POST `/api/orders/:id/broadcast`
Broadcast a signed transaction.

**Request Body:**
```json
{
  "signed_tx_hex": "02000000...",
  "order_id": "uuid-string"
}
```

**Response:**
```json
{
  "txid": "abc123...",
  "status": "confirmed",
  "message": "Transaction broadcast successfully."
}
```

---

## Wallet Endpoints

### POST `/api/wallet/connect`
Connect a wallet.

**Request Body:**
```json
{
  "address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "signature": "optional_signature",
  "message": "optional_message"
}
```

**Response:**
```json
{
  "connected": true,
  "address": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
  "network": "testnet4"
}
```

---

### GET `/api/wallet/balance`
Get wallet balance (BTC and tokens).

**Response:**
```json
{
  "btc_balance": 50000,
  "tokens": [
    {
      "token_id": "abc123",
      "ticker": "TOAD",
      "amount": "10000"
    }
  ]
}
```

---

### GET `/api/wallet/utxos`
Get wallet UTXOs with charm data.

**Response:**
```json
[
  {
    "txid": "abc123def456",
    "vout": 0,
    "value": 10000,
    "script_pubkey": "0014...",
    "confirmations": 6,
    "charms": [
      {
        "app_id": "toad_token",
        "app_tag": "token",
        "data": { "amount": 5000 }
      }
    ]
  }
]
```

---

### GET `/api/wallet/address`
Get a new wallet address.

**Response:**
```json
"tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"
```

---

## Spell Endpoints

### POST `/api/spells/prove`
Prove a spell and generate transactions.

**Request Body:**
```json
{
  "spell_yaml": "version: 8\nstate: []",
  "app_binary": "",
  "prev_txs": [],
  "funding_utxo": "txid:vout",
  "funding_utxo_value": 10000,
  "change_address": "tb1q...",
  "fee_rate": 10.0
}
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "txid": "commit_txid",
      "hex": "0200000001...",
      "inputs_to_sign": [
        {
          "index": 0,
          "sighash_type": "SIGHASH_ALL",
          "script_pubkey": "0014..."
        }
      ]
    }
  ],
  "total_fee": 500,
  "error": null
}
```

---

### POST `/api/spells/broadcast`
Broadcast signed transactions.

**Request Body:**
```json
{
  "signed_txs": ["0200000001..."]
}
```

**Response:**
```json
{
  "success": true,
  "txids": ["abc123..."],
  "error": null
}
```

---

### GET `/api/spells/status/:txid`
Get transaction status.

**Response:**
```json
{
  "txid": "abc123...",
  "confirmed": false,
  "confirmations": 0,
  "block_height": null,
  "block_hash": null
}
```

---

## Escrow Endpoints

### GET `/api/escrows`
List all escrows.

**Response:**
```json
{
  "success": true,
  "data": [ /* array of EscrowRecord */ ],
  "error": null
}
```

---

### POST `/api/escrows`
Create a new escrow.

**Request Body:**
```json
{
  "depositor_pubkey": "02...",
  "recipient_pubkey": "03...",
  "arbiter_pubkey": "02...",
  "escrow_type": "TwoOfThree",
  "token_id": "TOAD",
  "amount": 1000,
  "release_hash": "sha256hash",
  "expiry_height": 850000,
  "order_id": "uuid-string"
}
```

| Escrow Type | Description |
|-------------|-------------|
| `TwoParty` | Depositor + Recipient |
| `TwoOfTwo` | Both parties must sign |
| `TwoOfThree` | 2 of 3 (includes arbiter) |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "escrow_id": "escrow_abc123",
    "depositor_pubkey": "02...",
    "recipient_pubkey": "03...",
    "arbiter_pubkey": "02...",
    "escrow_type": "TwoOfThree",
    "held_token_id": "TOAD",
    "held_amount": 1000,
    "release_hash": "sha256hash",
    "expiry_height": 850000,
    "status": "Active",
    "created_at": 1704441600,
    "order_id": "uuid",
    "utxo_id": null,
    "tx_id": null
  },
  "error": null
}
```

---

### GET `/api/escrows/:id`
Get escrow by ID.

---

### POST `/api/escrows/:id/release`
Release escrow to recipient.

**Request Body:**
```json
{
  "preimage": "optional_preimage_if_hash_locked",
  "signature": "sig...",
  "signer_pubkey": "02..."
}
```

---

### POST `/api/escrows/:id/refund`
Refund escrow to depositor.

**Request Body:**
```json
{
  "reason": "Order cancelled",
  "signature": "sig..."
}
```

---

### POST `/api/escrows/:id/dispute`
Initiate a dispute (2-of-3 only).

**Request Body:**
```json
{
  "reason": "Counterparty not responding",
  "evidence_hash": "sha256...",
  "initiator_pubkey": "02..."
}
```

---

### POST `/api/escrows/:id/resolve`
Resolve a dispute (arbiter only).

**Request Body:**
```json
{
  "winner": "depositor",
  "arbiter_signature": "sig..."
}
```

---

### GET `/api/escrows/by-depositor/:pubkey`
Get escrows by depositor public key.

---

### GET `/api/escrows/by-recipient/:pubkey`
Get escrows by recipient public key.

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Order Statuses

| Status | Description |
|--------|-------------|
| `open` | Order is active and can be filled |
| `pendingsignature` | Awaiting wallet signature |
| `filled` | Order completely filled |
| `partiallyfilled` | Order partially filled |
| `cancelled` | Order cancelled by maker |
| `expired` | Order expired (past expiry height) |

## Escrow Statuses

| Status | Description |
|--------|-------------|
| `Active` | Escrow is active |
| `Released` | Funds released to recipient |
| `Refunded` | Funds returned to depositor |
| `Expired` | Escrow expired |
| `Disputed` | Dispute initiated |
