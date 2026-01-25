## Liquid Nation Charms End-to-End Map

This file maps how Liquid Nation uses Charms apps + spells to drive swaps,
transaction proving, and escrow. It is written for engineers and demo prep.

---

## 1) Liquid Nation Swap (Order NFT + Token Transfers)

### Actors and components
- **Frontend**: `src/services/api.js` → calls backend order endpoints
- **Backend**: `backend/src/routes/orders.rs`
- **Charms swap app**: `apps/swap-app/src/lib.rs`
- **Spell templates**: `apps/swap-app/spells/*.yaml`

### What the swap app enforces
- Order NFT is the source of truth for an open order
- Create/fill/cancel/partial-fill rules live in the app contract
- Token conservation prevents minting during swap operations

Key contract logic:
- `app_contract()` routes by charm tag (`n` for order NFT, `t` for swap token)
- `validate_order_creation()` ensures order NFT is created from a funding UTXO
- `validate_order_fill()` ensures taker provides wanted tokens and order is consumed
- `validate_partial_fill()` updates order state for remaining amount

### Order creation flow (high level)
1) UI submits order parameters (offer/want, amounts, UTXO).
2) Backend builds a spell from a YAML template with variables injected.
3) Spell is locally validated and sent for proving (testnet4).
4) Prover returns unsigned txs; backend returns signing instructions.
5) Wallet signs and broadcasts (mock or real mode).

---

## 2) Execution (Spell Proving + Bitcoin RPC)

### Actors and components
- **Spell proving**: `backend/src/services/charms.rs`
- **Prove endpoint**: `backend/src/routes/spells.rs`
- **Bitcoin RPC**: `backend/src/services/bitcoin.rs`

### End-to-end execution map
1) Backend builds a spell (`build_create_order_spell()` or `build_fill_order_spell()`).
2) Backend validates the YAML structure (`validate_spell()`).
3) Backend builds a prover request (`SpellProveRequest`) and calls:
   - `CHARMS_PROVE_API_URL` (default: `https://v8.charms.dev/spells/prove`)
   - `chain` is set to `testnet4`.
4) Prover returns a set of unsigned txs.
5) Backend wraps them into signing instructions (per order flow).
6) Frontend submits signed txs back to backend.
7) Backend broadcasts via Bitcoin RPC (`sendrawtransaction`) or mocks it.

### Execution touchpoints
- Prover request payload is created in `backend/src/routes/spells.rs`
- Prover API call is implemented in `backend/src/services/charms.rs`
- Broadcast happens in `backend/src/routes/orders.rs` (real mode) or mock

---

## 3) Escrow (Escrow NFT + Release/Refund/Dispute)

### Actors and components
- **Escrow app**: `apps/escrow-app/src/lib.rs`
- **Escrow spells**: `apps/escrow-app/spells/*.yaml`
- **Escrow API**: `backend/src/routes/escrow.rs`

### What the escrow app enforces
- Escrow NFT represents on-chain escrow state
- State transitions are validated by the contract:
  - create, release, refund, dispute, resolve
- Token conservation ensures held funds are properly tracked

Key contract logic:
- `validate_escrow_creation()` checks identity and held amounts
- `validate_escrow_release()` checks release conditions and signers
- `validate_escrow_refund()` handles expiry or authorized refunds
- `validate_escrow_dispute()` / `validate_dispute_resolution()` handle disputes

### Escrow flow (high level)
1) UI submits escrow creation details (participants, amount, expiry).
2) Backend builds and validates the escrow spell.
3) Spell is proven and returned as unsigned txs.
4) Wallet signs and broadcasts.
5) Later transitions (release/refund/dispute/resolve) repeat the prove → sign → broadcast cycle.

---

## Quick Path Index

- Swap app rules: `apps/swap-app/src/lib.rs`
- Escrow app rules: `apps/escrow-app/src/lib.rs`
- Spell templates: `apps/swap-app/spells/`, `apps/escrow-app/spells/`
- Spell building + proving: `backend/src/services/charms.rs`
- Order API (swap flow): `backend/src/routes/orders.rs`
- Spell API (prove/broadcast/status): `backend/src/routes/spells.rs`
- Bitcoin RPC client: `backend/src/services/bitcoin.rs`
- Frontend API client: `src/services/api.js`
