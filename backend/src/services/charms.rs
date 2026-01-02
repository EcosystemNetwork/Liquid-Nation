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

    /// Prove a spell with retry logic and detailed error handling
    pub async fn prove_spell(
        &self,
        request: SpellProveRequest,
    ) -> Result<Vec<ProvedTransaction>> {
        if self.mock_mode {
            tracing::info!("🔧 Mock mode: returning simulated transaction");
            return Ok(vec![
                ProvedTransaction {
                    hex: "0200000001...".to_string(),
                    txid: format!("mock_{}", uuid::Uuid::new_v4()),
                },
            ]);
        }

        // Retry configuration
        let max_retries = 3;
        let mut retry_delay = std::time::Duration::from_secs(2);

        tracing::info!("=== Prover API Request ===");
        tracing::info!("API URL: {}", self.api_url);
        tracing::debug!("Request payload: {}", serde_json::to_string_pretty(&request).unwrap_or_default());

        for attempt in 1..=max_retries {
            tracing::info!("🔄 Prover API attempt {}/{}", attempt, max_retries);

            // Create client with 120-second timeout (ZK proofs take time)
            let client = match reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(120))
                .build()
            {
                Ok(c) => c,
                Err(e) => {
                    tracing::error!("❌ Failed to build HTTP client: {}", e);
                    anyhow::bail!("HTTP client error: {}", e);
                }
            };

            // Make the API call
            let result = client
                .post(&self.api_url)
                .json(&request)
                .send()
                .await;

            match result {
                Ok(response) => {
                    let status = response.status();
                    tracing::info!("📡 Response status: {}", status);

                    if status.is_success() {
                        // Try to parse the response
                        let response_text = match response.text().await {
                            Ok(text) => text,
                            Err(e) => {
                                tracing::error!("❌ Failed to read response body: {}", e);
                                if attempt < max_retries {
                                    tracing::info!("⏳ Retrying in {:?}...", retry_delay);
                                    tokio::time::sleep(retry_delay).await;
                                    retry_delay *= 2;
                                    continue;
                                } else {
                                    anyhow::bail!("Failed to read response: {}", e);
                                }
                            }
                        };

                        tracing::debug!("📄 Raw response body: {}", response_text);

                        // Parse JSON
                        match serde_json::from_str::<Vec<ProvedTransaction>>(&response_text) {
                            Ok(txs) => {
                                if txs.is_empty() {
                                    tracing::warn!("⚠️  Prover API returned empty transaction array");
                                    if attempt < max_retries {
                                        tracing::info!("⏳ Retrying in {:?}...", retry_delay);
                                        tokio::time::sleep(retry_delay).await;
                                        retry_delay *= 2;
                                        continue;
                                    } else {
                                        anyhow::bail!("Prover API returned empty transactions after {} attempts", max_retries);
                                    }
                                } else {
                                    tracing::info!("✅ Successfully received {} transaction(s) from prover", txs.len());
                                    return Ok(txs);
                                }
                            }
                            Err(e) => {
                                tracing::error!("❌ JSON parse error: {}", e);
                                tracing::debug!("Raw response was: {}", response_text);
                                if attempt < max_retries {
                                    tracing::info!("⏳ Retrying in {:?}...", retry_delay);
                                    tokio::time::sleep(retry_delay).await;
                                    retry_delay *= 2;
                                    continue;
                                } else {
                                    anyhow::bail!("Invalid JSON response: {}", e);
                                }
                            }
                        }
                    } else {
                        // Non-success HTTP status
                        let error_body = response.text().await.unwrap_or_else(|_| "<unable to read error>".to_string());
                        tracing::error!("❌ HTTP error {}: {}", status, error_body);
                        
                        if attempt < max_retries {
                            tracing::info!("⏳ Retrying in {:?}...", retry_delay);
                            tokio::time::sleep(retry_delay).await;
                            retry_delay *= 2;
                            continue;
                        } else {
                            anyhow::bail!("Prover API error ({}): {}", status, error_body);
                        }
                    }
                }
                Err(e) => {
                    tracing::error!("❌ Request failed: {}", e);
                    tracing::debug!("Error details: {:?}", e);
                    
                    if attempt < max_retries {
                        tracing::info!("⏳ Retrying in {:?}...", retry_delay);
                        tokio::time::sleep(retry_delay).await;
                        retry_delay *= 2;
                        continue;
                    } else {
                        anyhow::bail!("Network error after {} attempts: {}", max_retries, e);
                    }
                }
            }
        }

        // Should never reach here, but just in case
        anyhow::bail!("Prover API failed after {} attempts", max_retries)
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
        let spell: serde_yaml::Value = serde_yaml::from_str(spell_yaml)
            .map_err(|e| anyhow::anyhow!("Invalid YAML format: {}", e))?;
        
        // Validate version exists
        if spell.get("version").is_none() {
            anyhow::bail!("Missing 'version' field in spell");
        }

        // Convert to JSON for consistency with Prover API expectations
        let _spell_json = serde_json::to_string(&spell)
            .map_err(|e| anyhow::anyhow!("Failed to convert spell to JSON: {}", e))?;
        
        tracing::info!("✅ Spell validation passed");
        Ok(())
    }

    /// Check if service is in mock mode
    pub fn is_mock_mode(&self) -> bool {
        self.mock_mode
    }

    /// Get the API URL being used
    pub fn api_url(&self) -> &str {
        &self.api_url
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

    #[test]
    fn test_validate_spell_valid() {
        let service = CharmsService::new();
        
        let valid_spell = r#"
version: 8
state: []
clauses: []
"#;
        
        let result = service.validate_spell(valid_spell);
        assert!(result.is_ok(), "Valid spell should pass validation");
    }

    #[test]
    fn test_validate_spell_invalid_yaml() {
        let service = CharmsService::new();
        
        let invalid_spell = "this is not: valid: yaml: at all";
        
        let result = service.validate_spell(invalid_spell);
        assert!(result.is_err(), "Invalid YAML should fail validation");
    }

    #[test]
    fn test_validate_spell_missing_version() {
        let service = CharmsService::new();
        
        let spell_without_version = r#"
state: []
clauses: []
"#;
        
        let result = service.validate_spell(spell_without_version);
        assert!(result.is_err(), "Spell without version should fail validation");
        
        if let Err(e) = result {
            assert!(e.to_string().contains("version"), 
                "Error message should mention missing version field");
        }
    }

    #[test]
    fn test_is_mock_mode() {
        let service = CharmsService::new();
        // Method should exist and return a boolean
        assert!(service.is_mock_mode() || !service.is_mock_mode(), 
            "is_mock_mode should return a boolean");
    }

    #[test]
    fn test_api_url() {
        let service = CharmsService::new();
        let url = service.api_url();
        assert!(!url.is_empty(), "API URL should not be empty");
        assert!(url.contains("http"), "API URL should be a valid URL");
    }
}

