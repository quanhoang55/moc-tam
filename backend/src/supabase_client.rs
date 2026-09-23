// =============================================================
// PURPOSE: SUPABASE (PostgREST) CLIENT
// =============================================================
use crate::config::Settings;
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct SupabaseClient {
    client: Client,
    base_url: String,
    key: String,
}

#[derive(Debug, Serialize)]
pub struct FeedbackInsert {
    pub topic: String,
    pub content: String,
    /// Nullable UUID matching Supabase `auth.users.id`.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct FeedbackRow {
    pub id: String,
}

impl SupabaseClient {
    pub fn new(settings: &Settings) -> Self {
        let mut headers = header::HeaderMap::new();
        headers.insert(
            header::ACCEPT,
            header::HeaderValue::from_static("application/json"),
        );
        headers.insert(
            header::CONTENT_TYPE,
            header::HeaderValue::from_static("application/json"),
        );
        headers.insert(
            "apikey",
            header::HeaderValue::from_str(&settings.supabase_key)
                .expect("SUPABASE key must be a valid header value"),
        );

        let client = Client::builder()
            .default_headers(headers)
            .build()
            .expect("Failed to build Supabase reqwest client");

        Self {
            client,
            base_url: settings.supabase_url.trim_end_matches('/').to_owned(),
            key: settings.supabase_key.clone(),
        }
    }

    /// Insert a row into the `feedbacks` table via PostgREST and return the
    /// server-generated UUID of the new row.
    pub async fn insert_feedback(&self, row: &FeedbackInsert) -> Result<String, String> {
        let url = format!("{}/rest/v1/feedbacks", self.base_url);

        let response = self
            .client
            .post(&url)
            .bearer_auth(&self.key)
            // Ask PostgREST to return the inserted row so we can read its id.
            .header("Prefer", "return=representation")
            .json(row)
            .send()
            .await
            .map_err(|error| format!("Failed to reach Supabase: {error}"))?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(format!("Supabase insert failed ({status}): {error_text}"));
        }

        let rows: Vec<FeedbackRow> = response
            .json()
            .await
            .map_err(|error| format!("Failed to parse Supabase response: {error}"))?;

        rows.into_iter()
            .next()
            .map(|row| row.id)
            .ok_or_else(|| "Supabase returned no row for the inserted feedback.".to_owned())
    }
}
