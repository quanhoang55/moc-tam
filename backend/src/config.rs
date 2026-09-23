// =============================================================
// PURPOSE: SETTINGS
// =============================================================
// IMPORTS & MODULE LOADING
// =============================================================
use dotenvy::dotenv;
use std::env;

#[derive(Debug, Clone)]
pub struct Settings {
    pub paypal_client_id: String,
    pub paypal_secret: String,
    pub paypal_mode: String,
    pub host: String,
    pub port: u16,
    pub supabase_url: String,
    pub supabase_key: String,
}

// =============================================================
// CORE LOGIC & FUNCTIONS
// =============================================================

impl Settings {
    pub fn init() -> Self {
        // Load the .env file if present
        dotenv().ok();

        Self {
            paypal_client_id: env::var("PAYPAL_CLIENT_ID").expect("PAYPAL_CLIENT_ID must be set"),
            paypal_secret: env::var("PAYPAL_CLIENT_SECRET")
                .expect("PAYPAL_CLIENT_SECRET must be set"),
            paypal_mode: env::var("PAYPAL_MODE").expect("PAYPAL_MODE must be set"),
            host: env::var("HOST").expect("HOST must be set"),
            port: env::var("PORT")
                .expect("PORT must be set")
                .parse()
                .expect("PORT must be a valid number"),
            supabase_url: env::var("SUPABASE_URL").expect("SUPABASE_URL must be set"),
            supabase_key: env::var("SUPABASE_SERVICE_KEY")
                .or_else(|_| env::var("SUPABASE_ANON_KEY"))
                .expect("SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY must be set"),
        }
    }
}
