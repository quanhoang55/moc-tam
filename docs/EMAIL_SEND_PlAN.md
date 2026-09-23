# PayPal Email Collection & Post-Purchase Notification Architecture

## 1. Objective

Implement a post-checkout notification system that prompts users for their email address prior to payment, processes the PayPal checkout flow, verifies transaction completion via Webhooks, stores order records in Supabase (PostgreSQL), and triggers an automated thank-you email to the customer.

## 2. Database Schema (Supabase SQL)

Ensure the following table structures exist in your Supabase database:

```sql
-- 1. Orders table storing checkout details & customer emails
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paypal_order_id VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by PayPal Order ID
CREATE INDEX IF NOT EXISTS idx_orders_paypal_id ON orders(paypal_order_id);
```

## 3. End-to-End Workflow & Architecture

Step 1: User Email Input & Order Initialization
Frontend: The checkout interface forces the user to enter a valid email before rendering or enabling the PayPal checkout button.

Order Creation Request: When the user clicks the PayPal button, the frontend sends a POST /api/orders/paypal/create request with the customer_email and cart_items.

Backend Logic:

Call PayPal REST API to initialize an order (POST /v2/checkout/orders).

Save an initial order record in Supabase with status: "PENDING", linking customer_email with paypal_order_id.

Return the generated paypal_order_id and PayPal approval URL back to the client.

Step 2: Payment Approval & Verification
Frontend: The client authorizes the payment inside the PayPal modal.

Server Verification (Webhooks / Capture):

Option A (Immediate Capture Endpoint): The client sends paypal_order_id to POST /api/orders/paypal/capture. The backend verifies payment status with PayPal.

Option B (Asynchronous Webhook - Recommended for Production): PayPal sends a PAYMENT.CAPTURE.COMPLETED HTTP POST request directly to the backend webhook endpoint (POST /api/webhooks/paypal).

Step 3: Transaction Completion & Email Dispatch
Backend Order Update: Upon confirming status == "COMPLETED", update the order in Supabase (status = 'COMPLETED').

Idempotent Email Service:

Check if email_sent == false for the corresponding paypal_order_id.

Send a thank-you email using an external email service provider (e.g., Resend, SendGrid, or SMTP).

Update email_sent = true in Supabase to prevent duplicate emails from retried webhooks.

## 4. Backend Implementation Requirements (Rust / Actix-web)

Environment Variables (.env)

PAYPAL_WEBHOOK_ID=your_paypal_webhook_id_here
SMTP_SERVER=smtp.resend.com # Or your email service provider
SMTP_PORT=587
SMTP_USERNAME=resend
SMTP_PASSWORD=your_email_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
# Development-only UI test button; leave false/unset in production.
ENABLE_EMAIL_TEST_ENDPOINT=true

Required API Endpoints

### POST /api/orders/paypal/create

Request Payload:

```json
{
    "email": "user@example.com",
    "amount": "15.00",
    "currency": "USD"
}
```

Action: Creates order on PayPal, stores PENDING record in DB, returns paypal_order_id.

### POST /api/orders/paypal/capture

Request Payload:

```json
{
    "paypal_order_id": "9B1234567890"
}
```

Action: Captures payment, verifies "COMPLETED" status, updates DB, triggers async task to send confirmation email.

### POST /api/webhooks/paypal (Optional / Production)

Action: Verifies PayPal Signature header, extracts event PAYMENT.CAPTURE.COMPLETED, updates DB, and triggers email service asynchronously.

### POST /api/email/test (Development / manual SMTP test)

Request payload:

```json
{
    "email": "user@example.com"
}
```

Action: Sends the existing thank-you email directly to the supplied address,
without creating a PayPal order. The endpoint is available only when
`ENABLE_EMAIL_TEST_ENDPOINT=true` and SMTP is configured. The checkout drawer
shows a **Send test email** button after a valid email is entered.

## 5. Thank-You Email Template Specification

Subject: Thank you for your purchase! (Order #[PAYPAL_ORDER_ID])

Recipient: Customer's email submitted during checkout.

Body Content:

Confirmation greeting.

Payment summary (Amount, Currency, Transaction ID).

Support contact information.

## 6. Execution Instructions for AI Assistant

Review the current database connection module and implement the Supabase query to insert/update orders.

Add the letemail or lettre (or reqwest based) email client module in the backend.

Update the frontend checkout component to enforce email validation before starting the PayPal payment stream.
