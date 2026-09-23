use std::time::Duration;

// =============================================================
// PURPOSE: Post-purchase email (SMTP / Resend) with mock fallback
//
// Plug-and-play: as soon as `SMTP_PASSWORD` and `SENDER_EMAIL` hold real
// values in `.env`, real SMTP requests are made — no code changes needed.
// While they are missing/empty/placeholder, every send logs a
// `[MOCK EMAIL] ...` line to stdout and returns `Ok(())`.
// =============================================================
use crate::config::{Settings, is_placeholder};
use lettre::Message;
use lettre::Transport;
use lettre::transport::smtp::SmtpTransport;
use lettre::transport::smtp::authentication::Credentials;

#[derive(Debug, Clone)]
pub struct EmailConfig {
    server: String,
    port: u16,
    username: String,
    password: String,
    sender: String,
    /// False while credentials are missing or placeholders.
    enabled: bool,
}

impl EmailConfig {
    pub fn from_settings(settings: &Settings) -> Self {
        let enabled =
            !is_placeholder(&settings.smtp_password) && !is_placeholder(&settings.sender_email);

        Self {
            server: settings.smtp_server.clone(),
            port: settings.smtp_port,
            username: settings.smtp_username.clone(),
            password: settings.smtp_password.clone(),
            sender: settings.sender_email.clone(),
            enabled,
        }
    }

    pub fn is_enabled(&self) -> bool {
        self.enabled
    }

    pub fn server(&self) -> &str {
        &self.server
    }

    pub fn port(&self) -> u16 {
        self.port
    }
}

/// Subject line shared by the real send and the mock log.
pub(crate) fn thank_you_subject(order_id: &str) -> String {
    format!("Thank you for your purchase! (Order #{order_id})")
}

/// Plain-text body shared by the real send and the mock log.
pub(crate) fn thank_you_body(
    order_id: &str,
    amount: f64,
    currency: &str,
    support_email: &str,
) -> String {
    format!(
        "Hi,\n\n\
         Thank you for your purchase! Your payment has been confirmed.\n\n\
         Order #: {order_id}\n\
         Amount: {amount:.2} {currency}\n\n\
         If you have any questions, reply to this email or contact our \
         support team at {support_email}.\n\n\
         Thank you for choosing Moc Tam.\n"
    )
}

/// Send the thank-you email. Degrades to a stdout mock when SMTP is not
/// configured. Always returns `Ok(())` in mock mode so the checkout flow
/// never fails because of email delivery.
pub async fn send_thank_you_email(
    config: &EmailConfig,
    to: &str,
    order_id: &str,
    amount: f64,
    currency: &str,
) -> Result<(), String> {
    if !config.enabled {
        println!(
            "[MOCK EMAIL] Would have sent thank-you email to {to} \
             (Order #{order_id}, {amount:.2} {currency})"
        );
        return Ok(());
    }

    let support = config.sender.clone();
    let subject = thank_you_subject(order_id);
    let body = thank_you_body(order_id, amount, currency, &support);

    // Owned copies for the 'static spawn_blocking closure.
    let to = to.to_owned();
    let order_id = order_id.to_owned();

    let message = Message::builder()
        .from(
            config
                .sender
                .parse()
                .map_err(|error| format!("Invalid SENDER_EMAIL `{}`: {error}", config.sender))?,
        )
        .to(to
            .parse()
            .map_err(|error| format!("Invalid recipient email `{to}`: {error}"))?)
        .subject(subject)
        .body(body)
        .map_err(|error| format!("Failed to build email message: {error}"))?;

    let server = config.server.clone();
    let port = config.port;
    let username = config.username.clone();
    let password = config.password.clone();

    // SMTP blocking I/O runs off the async runtime.
    tokio::task::spawn_blocking(move || -> Result<(), String> {
        let transport = SmtpTransport::starttls_relay(&server)
            .map_err(|error| format!("SMTP setup failed: {error}"))?
            .port(port)
            .credentials(Credentials::new(username, password))
            .timeout(Some(Duration::from_secs(15)))
            .build();

        transport
            .send(&message)
            .map_err(|error| format!("SMTP send failed: {error}"))?;

        println!("[EMAIL] Thank-you email sent to {to} (Order #{order_id})");
        Ok(())
    })
    .await
    .map_err(|error| format!("Email task failed: {error}"))?
}

#[cfg(test)]
mod tests {
    use super::{thank_you_body, thank_you_subject};

    #[test]
    fn subject_contains_order_id() {
        assert_eq!(
            thank_you_subject("123ABC"),
            "Thank you for your purchase! (Order #123ABC)"
        );
    }

    #[test]
    fn body_contains_amount_currency_and_support() {
        let body = thank_you_body("123ABC", 29.99, "USD", "orders@moc-tam.com");
        assert!(body.contains("Order #: 123ABC"));
        assert!(body.contains("Amount: 29.99 USD"));
        assert!(body.contains("orders@moc-tam.com"));
    }
}
