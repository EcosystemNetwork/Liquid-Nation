//! Charms protocol service

use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// Charms prover service
pub struct CharmsService {
    api_url: String,
    mock_mode: bool,
}

/// Spell prove request
#[derive(Debug, Serialize)]
pub struct SpellProveRequest {
    pub spell: String,
    pub binaries: BTreeMap<String, Vec<u8>>,
    pub prev_txs: Vec<String>,
    pub funding_utxo: String,
    pub funding_utxo_value: u64,
    pub change_address: String,
    pub fee_rate: f64,
    pub chain: String,
}

/// Transaction from prove response
#[derive(Debug, Deserialize)]
pub struct ProvedTransaction {
    pub hex: String,
    pub txid: String,
}

impl CharmsService {
    /// Create a new Charms service
    pub fn new() -> Self {
        let api_url = std::env::var("CHARMS_PROVE_API_URL")
            .unwrap_or_else(|_| "https://v8.charms.dev/spells/prove".to_string());
        
        let mock_mode = std::env::var("MOCK_MODE")
            .map(|v| v == "true")
            .unwrap_or(true);

        Self { api_url, mock_mode }
    }

    /// Build a spell from template
    pub fn build_spell(
        &self,
        template: &str,
        variables: &BTreeMap<String, String>,
    ) -> Result<String> {
        let mut spell = template.to_string();
        
        for (key, value) in variables {
            spell = spell.replace(&format!("${{{}}}", key), value);
        }

        Ok(spell)
    }

    /// Prove a spell
    pub async fn prove_spell(
        &self,
        request: SpellProveRequest,
    ) -> Result<Vec<ProvedTransaction>> {
        if self.mock_mode {
            // Return mock transactions for development
            return Ok(vec![
                ProvedTransaction {
                    hex: "0200000001...".to_string(),
                    txid: format!("mock_{}", uuid::Uuid::new_v4()),
                },
            ]);
        }

        let client = reqwest::Client::new();
        
        let response = client
            .post(&self.api_url)
            .json(&request)
            .send()
            .await?;

        if !response.status().is_success() {
            let error = response.text().await?;
            anyhow::bail!("Prover API error: {}", error);
        }

        let txs: Vec<ProvedTransaction> = response.json().await?;
        Ok(txs)
    }

    /// Parse UTXOs from previous transactions to find charms
    pub fn parse_charms_from_tx(&self, _tx_hex: &str) -> Result<Vec<CharmInfo>> {
        // TODO: Parse transaction and extract charm data
        // This requires decoding the OP_RETURN or witness data
        
        Ok(vec![])
    }

    /// Validate a spell locally before proving
    pub fn validate_spell(&self, spell_yaml: &str) -> Result<()> {
        // Parse YAML
        let _spell: serde_yaml::Value = serde_yaml::from_str(spell_yaml)?;
        
        // TODO: Add validation logic
        // - Check version
        // - Validate app references
        // - Verify inputs/outputs structure
        
        Ok(())
    }
}

/// Information about a charm on a UTXO
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CharmInfo {
    pub app_id: String,
    pub app_vk: String,
    pub tag: String,
    pub data: serde_json::Value,
}

impl Default for CharmsService {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_spell() {
        let service = CharmsService::new();
        
        let template = "version: 8\naddress: ${addr}";
        let mut vars = BTreeMap::new();
        vars.insert("addr".to_string(), "tb1q...".to_string());
        
        let result = service.build_spell(template, &vars).unwrap();
        assert!(result.contains("tb1q..."));
    }
}

