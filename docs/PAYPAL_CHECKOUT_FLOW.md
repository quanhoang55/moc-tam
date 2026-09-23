# PayPal Checkout Integration Flow & Architecture Rules

## Overview

This document specifies the server-side architecture and operational flow for integrating **PayPal Checkout (Cách 1)** into the existing Rust (Actix-web) backend. The backend must securely handle order creation and capture using PayPal's REST APIs while leveraging existing authentication middlewares.

### 1. Environment & Configuration Requirements

The Settings struct in src/config.rs must include the following PayPal environment variables. The server must panic on startup if any are missing:

- PAYPAL_CLIENT_ID: Public identifier from PayPal Developer Dashboard.

- PAYPAL_CLIENT_SECRET: Private secret key (must never be exposed to the client).

- PAYPAL_MODE: Execution environment, strictly restricted to sandbox (for testing) or live (for production).

- Base URLs determined by PAYPAL_MODE:

- Sandbox: https://api-m.sandbox.paypal.com

- Live: https://api-m.paypal.com

### 2. Secure Checkout Sequence (The 2-Step Flow)

Step A: Order Initialization (POST /api/orders/paypal/create)
Authentication: The route must be protected using the existing User extractor from src/middleware.rs to ensure only logged-in users can initiate purchases.

- Request Payload: The client sends item details or cart reference to the backend.

- Backend Actions:

- Request an OAuth2 Access Token from PayPal using Basic Authentication (PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET).

- Call PayPal's Create Order API (POST /v2/checkout/orders) specifying purchase units, amount, and currency.

- Response: Return the generated paypal_order_id back to the frontend so it can mount the PayPal popup/button interface.

Step B: Payment Capture & Verification (POST /api/orders/paypal/capture)
Critical security requirement: Never trust frontend confirmation alone. The server must verify the transaction directly with PayPal.

- Authentication: Protected by the User extractor.

- Request Payload: The client sends the paypal_order_id after the user successfully completes the popup flow on the frontend.

- Backend Actions:

- Re-authenticate with PayPal to get a fresh Access Token (if needed).

- Call PayPal's Capture Order API (POST /v2/checkout/orders/{id}/capture).

- Inspect the response JSON: verify that status equals "COMPLETED".

- Database Persistence:

- Only if the status is "COMPLETED", execute an optimized database transaction to save the order details using DATABASE_URL.

- Clear or invalidate relevant database caches per previous optimization guidelines.

- Response: Return a success status and internal order ID to the frontend.

### 3. Error Handling & Security Constraints

Secret Protection: PAYPAL_CLIENT_SECRET must remain strictly on the backend. Client-side code must only receive the PAYPAL_CLIENT_ID and the paypal_order_id.

Idempotency & Failures: If the capture API fails or returns a non-completed status, roll back or abort database insertion, and return a descriptive 400/500 error to the client.

Async Execution: Use reqwest (or the existing asynchronous HTTP client) combined with tokio to handle non-blocking HTTP requests to PayPal's API endpoints.
