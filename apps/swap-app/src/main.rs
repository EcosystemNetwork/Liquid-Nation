//! Liquid Nation Swap App Entry Point
//! 
//! This is the main entry point for the Charms app binary.
//! It reads input from stdin and validates the swap contract.

use liquid_swap_app::app_contract;

charms_sdk::main!(app_contract);

