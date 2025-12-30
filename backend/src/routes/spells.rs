//! Charms spell and transaction endpoints

use axum::{
    extract::Path,
    Json,
};
use serde::{Deserialize, Serialize};

/// Prove spell request
#[derive(Debug, Deserialize)]
pub struct ProveSpellRequest {
    pub spell_yaml: String,
    pub app_binary: String,
    pub prev_txs: Vec<String>,
    pub funding_utxo: String,
    pub funding_utxo_value: u64,
    pub change_address: String,
    pub fee_rate: f64,
}

/// Prove spell response
#[derive(Debug, Serialize)]
pub struct ProveSpellResponse {
    pub success: bool,
    pub transactions: Vec<TransactionData>,
    pub total_fee: u64,
    pub error: Option<String>,
}

/// Transaction data
#[derive(Debug, Serialize, Deserialize)]
pub struct TransactionData {
    pub txid: String,
    pub hex: String,
    pub inputs_to_sign: Vec<InputToSign>,
}

/// Input that needs signing
#[derive(Debug, Serialize, Deserialize)]
pub struct InputToSign {
    pub index: u32,
    pub sighash_type: String,
    pub script_pubkey: String,
}

/// Broadcast transaction request
#[derive(Debug, Deserialize)]
pub struct BroadcastRequest {
    pub signed_txs: Vec<String>,
}

/// Broadcast response
#[derive(Debug, Serialize)]
pub struct BroadcastResponse {
    pub success: bool,
    pub txids: Vec<String>,
    pub error: Option<String>,
}

/// Transaction status
#[derive(Debug, Serialize)]
pub struct TransactionStatus {
    pub txid: String,
    pub confirmed: bool,
    pub confirmations: u32,
    pub block_height: Option<u64>,
    pub block_hash: Option<String>,
}

/// Prove a spell and generate transactions
pub async fn prove_spell(
    Json(req): Json<ProveSpellRequest>,
) -> Json<ProveSpellResponse> {
    // TODO: Call Charms prover API
    // For mock mode, use local prover
    
    let charms_api_url = std::env::var("CHARMS_PROVE_API_URL")
        .unwrap_or_else(|_| "https://v8.charms.dev/spells/prove".to_string());
    
    let mock_mode = std::env::var("MOCK_MODE")
        .map(|v| v == "true")
        .unwrap_or(true);  // Default to mock for development

    if mock_mode {
        // Mock response for development
        return Json(ProveSpellResponse {
            success: true,
            transactions: vec![
                TransactionData {
                    txid: "mock_commit_txid".to_string(),
                    hex: "0200000001...".to_string(),
                    inputs_to_sign: vec![
                        InputToSign {
                            index: 0,
                            sighash_type: "SIGHASH_ALL".to_string(),
                            script_pubkey: "0014...".to_string(),
                        },
                    ],
                },
                TransactionData {
                    txid: "mock_spell_txid".to_string(),
                    hex: "0200000001...".to_string(),
                    inputs_to_sign: vec![],  // Spell tx uses commit output
                },
            ],
            total_fee: 500,
            error: None,
        });
    }

    // Call Charms prover API
    let client = reqwest::Client::new();
    
    match client
        .post(&charms_api_url)
        .json(&serde_json::json!({
            "spell": req.spell_yaml,
            "binaries": {
                // TODO: Include app binary with correct VK
            },
            "prev_txs": req.prev_txs,
            "funding_utxo": req.funding_utxo,
            "funding_utxo_value": req.funding_utxo_value,
            "change_address": req.change_address,
            "fee_rate": req.fee_rate,
            "chain": "Bitcoin"
        }))
        .send()
        .await
    {
        Ok(response) => {
            if response.status().is_success() {
                // TODO: Parse response and extract transactions
                Json(ProveSpellResponse {
                    success: true,
                    transactions: vec![],
                    total_fee: 0,
                    error: None,
                })
            } else {
                let error = response.text().await.unwrap_or_default();
                Json(ProveSpellResponse {
                    success: false,
                    transactions: vec![],
                    total_fee: 0,
                    error: Some(error),
                })
            }
        }
        Err(e) => Json(ProveSpellResponse {
            success: false,
            transactions: vec![],
            total_fee: 0,
            error: Some(e.to_string()),
        }),
    }
}

/// Broadcast signed transactions
pub async fn broadcast_transaction(
    Json(req): Json<BroadcastRequest>,
) -> Json<BroadcastResponse> {
    // TODO: Broadcast via Bitcoin Core RPC
    
    let mock_mode = std::env::var("MOCK_MODE")
        .map(|v| v == "true")
        .unwrap_or(true);

    if mock_mode {
        return Json(BroadcastResponse {
            success: true,
            txids: req.signed_txs.iter().map(|_| format!("mock_txid_{}", uuid::Uuid::new_v4())).collect(),
            error: None,
        });
    }

    // TODO: Call Bitcoin Core sendrawtransaction
    Json(BroadcastResponse {
        success: false,
        txids: vec![],
        error: Some("Not implemented".to_string()),
    })
}

/// Get transaction status
pub async fn get_transaction_status(
    Path(txid): Path<String>,
) -> Json<TransactionStatus> {
    // TODO: Query Bitcoin Core for transaction status
    
    Json(TransactionStatus {
        txid,
        confirmed: false,
        confirmations: 0,
        block_height: None,
        block_hash: None,
    })
}

