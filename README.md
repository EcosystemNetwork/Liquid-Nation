# Liquid Nation

A decentralized P2P cross-chain exchange protocol powered by [Charms](https://charms.dev) for seamless, trustless asset trading on Bitcoin.

## Overview

Liquid Nation enables secure, peer-to-peer asset swaps across multiple blockchains using the Charms protocol. Our technology eliminates the need for liquidity pools, reducing gas fees and providing a safer, more efficient, and trustless experience for users.

**Key Differentiators:**
- 🔐 **No Liquidity Pools** - Direct P2P atomic swaps via Bitcoin UTXOs
- ⚡ **Zero-Knowledge Proofs** - Cryptographic verification, not trust
- 🌐 **True Cross-Chain** - Native Bitcoin + Cardano support
- 💰 **Lower Fees** - No bridge fees, proof batching reduces costs

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     LIQUID NATION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React)  ◄───────►  Backend (Rust/Axum)               │
│       │                              │                           │
│       ▼                              ▼                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 CHARMS PROTOCOL LAYER                    │    │
│  │  ┌───────────────┐  ┌────────────────────────────────┐  │    │
│  │  │ Swap App      │  │ Spells (Transaction Templates) │  │    │
│  │  │ (Rust)        │  │ • create-order.yaml            │  │    │
│  │  └───────────────┘  │ • fill-order.yaml              │  │    │
│  │                      │ • cancel-order.yaml            │  │    │
│  │                      └────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│         Bitcoin         Cardano        Future Chains            │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
Liquid-Nation/
├── apps/                          # Charms Rust apps
│   └── swap-app/
│       ├── Cargo.toml
│       ├── src/
│       │   ├── lib.rs            # Swap contract logic
│       │   └── main.rs           # Entry point
│       └── spells/               # Transaction templates
│           ├── create-order.yaml
│           ├── fill-order.yaml
│           ├── cancel-order.yaml
│           └── partial-fill.yaml
├── backend/                       # Rust API server
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs
│       ├── routes/               # API endpoints
│       │   ├── orders.rs
│       │   ├── wallet.rs
│       │   └── spells.rs
│       └── services/             # Business logic
│           ├── bitcoin.rs
│           └── charms.rs
├── src/                          # React frontend
│   ├── components/
│   ├── services/
│   │   └── api.js               # Backend API client
│   └── App.jsx
├── Cargo.toml                    # Rust workspace
└── package.json                  # Node.js dependencies
```

## Prerequisites

- **Node.js** v18 or higher
- **Rust** (latest stable)
- **Bitcoin Core** v30.0.0+
- **Charms CLI** v0.10.0

## Quick Start

### 1. Install Dependencies

```bash
# Install Charms CLI
cargo install --locked charms

# Install Node.js dependencies
npm install

# Build Rust backend and apps
cargo build --release
```

### 2. Configure Bitcoin Core

Create `~/Library/Application Support/Bitcoin/bitcoin.conf`:

```ini
testnet4=1
server=1
rpcuser=charms
rpcpassword=charms
```

Start Bitcoin Core:
```bash
bitcoind -daemon
```

### 3. Run the Application

```bash
# Terminal 1: Start the backend
cd backend
cargo run --release

# Terminal 2: Start the frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173/`
- Backend API: `http://localhost:3001/api`

## API Endpoints

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/fill` - Fill an order
- `DELETE /api/orders/:id/cancel` - Cancel an order
- `POST /api/orders/:id/partial-fill` - Partially fill an order

### Wallet
- `POST /api/wallet/connect` - Connect wallet
- `GET /api/wallet/balance` - Get balance
- `GET /api/wallet/utxos` - Get UTXOs
- `GET /api/wallet/address` - Get new address

### Spells
- `POST /api/spells/prove` - Prove a spell
- `POST /api/spells/broadcast` - Broadcast transactions
- `GET /api/spells/status/:txid` - Get transaction status

## Building the Swap App

```bash
# Build the Charms app
cd apps/swap-app
cargo build --release

# Get the verification key
app_bin=$(charms app build)
charms app vk "$app_bin"
```

## Technology Stack

### Backend
- **Rust** - Systems programming language
- **Axum** - Web framework
- **Charms SDK** - Bitcoin programmable assets
- **SQLite** - Database

### Frontend
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool
- **CSS3** - Styling

### Blockchain
- **Bitcoin** - Base layer
- **Charms Protocol** - Programmable assets
- **Cardano** - Cross-chain support (coming soon)

## Development

### Run Tests

```bash
# Rust tests
cargo test

# Frontend tests
npm test
```

### Build for Production

```bash
# Build Rust
cargo build --release

# Build frontend
npm run build
```

## Resources

- [Charms Documentation](https://docs.charms.dev)
- [Bitcoin Testnet4 Faucet](https://mempool.space/testnet4/faucet)
- [Charms GitHub](https://github.com/charms)

## License

© 2024 Liquid Nation. All rights reserved.
