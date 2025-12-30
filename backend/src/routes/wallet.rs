//! Wallet management endpoints

use axum::Json;
use serde::{Deserialize, Serialize};

/// UTXO representation
#[derive(Debug, Serialize, Deserialize)]
pub struct Utxo {
    pub txid: String,
    pub vout: u32,
    pub value: u64,
    pub script_pubkey: String,
    pub confirmations: u32,
    pub charms: Option<Vec<CharmData>>,
}

/// Charm data on a UTXO
#[derive(Debug, Serialize, Deserialize)]
pub struct CharmData {
    pub app_id: String,
    pub app_tag: String,  // "token" or "nft"
    pub data: serde_json::Value,
}

/// Wallet balance
#[derive(Debug, Serialize)]
pub struct WalletBalance {
    pub btc_balance: u64,
    pub tokens: Vec<TokenBalance>,
}

/// Token balance
#[derive(Debug, Serialize)]
pub struct TokenBalance {
    pub token_id: String,
    pub ticker: String,
    pub amount: String,
}

/// Connect wallet request
#[derive(Debug, Deserialize)]
pub struct ConnectWalletRequest {
    pub address: String,
    pub signature: Option<String>,
    pub message: Option<String>,
}

/// Connect wallet response
#[derive(Debug, Serialize)]
pub struct ConnectWalletResponse {
    pub connected: bool,
    pub address: String,
    pub network: String,
}

/// Connect wallet endpoint
pub async fn connect_wallet(
    Json(req): Json<ConnectWalletRequest>,
) -> Json<ConnectWalletResponse> {
    // TODO: Verify signature if provided
    // TODO: Determine network from address
    
    Json(ConnectWalletResponse {
        connected: true,
        address: req.address,
        network: "testnet4".to_string(),
    })
}

/// Get wallet balance
pub async fn get_balance() -> Json<WalletBalance> {
    // TODO: Query Bitcoin Core for balance
    // TODO: Parse UTXOs for charm tokens
    
    Json(WalletBalance {
        btc_balance: 50000,  // sats
        tokens: vec![
            TokenBalance {
                token_id: "abc123".to_string(),
                ticker: "TOAD".to_string(),
                amount: "10000".to_string(),
            },
        ],
    })
}

/// Get wallet UTXOs
pub async fn get_utxos() -> Json<Vec<Utxo>> {
    // TODO: Query Bitcoin Core for UTXOs
    // TODO: Parse charm data from UTXOs
    
    Json(vec![
        Utxo {
            txid: "abc123def456".to_string(),
            vout: 0,
            value: 10000,
            script_pubkey: "0014...".to_string(),
            confirmations: 6,
            charms: Some(vec![
                CharmData {
                    app_id: "toad_token".to_string(),
                    app_tag: "token".to_string(),
                    data: serde_json::json!({ "amount": 5000 }),
                },
            ]),
        },
    ])
}

/// Get new wallet address
pub async fn get_address() -> Json<String> {
    // TODO: Call Bitcoin Core getnewaddress
    Json("tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx".to_string())
}

