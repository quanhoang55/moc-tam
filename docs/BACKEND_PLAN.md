# BACKEND_PLAN: Single-Seller E-Commerce with PayPal

## 1. System Architecture Overview

- **Type:** Single-Seller Store (B2C - you are the only seller).
- **Payment Gateway:** PayPal (Orders API).
- **Roles:** Admin (Store Owner) and Buyer (Customer).

---

## 2. Database Schema (Codex Task)

Codex needs to implement the following core tables/collections:

- **Users Table:**
    - `id`, `email`, `password_hash`, `role` (Admin vs. Buyer).
- **Products Table:**
    - `id`, `name`, `description`, `price` (in USD), `stock`, `image_url`.
- **Orders Table:**
    - `id`, `buyer_email` (or `buyer_id`), `product_id`, `total_price`, `paypal_order_id`, `status` (PENDING, PAID, CANCELLED).

---

## 3. Middlewares Needed (Codex Task)

Codex needs to write and apply these middlewares:

1. `cors()` & `express.json()`: Global middlewares for basic request handling and cross-origin setup.
2. `verifyAdmin`: Checks if the user requesting the route has the `role === 'Admin'`. Used to protect product management routes so only you can add/edit products.
3. `verifyUser` (Optional): Verifies JWT token for buyers wanting to see their own order history.

---

## 4. API Routes (Codex Task)

Codex must implement the following endpoints:

**Public Routes:**

- `GET /api/products` - Fetch all products for the store.
- `GET /api/products/:id` - Fetch single product details.

**Admin Routes (Protected by `verifyAdmin`):**

- `POST /api/admin/products` - Add new product.
- `PUT /api/admin/products/:id` - Update price/details.

**Payment Routes (PayPal):**

- `POST /api/orders/create` - Initializes PayPal order.
- `POST /api/orders/capture` - Verifies payment and updates database.

---

## 5. PayPal Implementation Workflow

### Step A: API Credentials (Your Task)

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/).
2. Log in, go to "Apps & Credentials".
3. Create a new App (Sandbox mode for testing).
4. Copy the **Client ID** and **Secret**.
5. Create a `.env` file in the backend root and add them:
    ```env
    PAYPAL_CLIENT_ID=your_client_id_here
    PAYPAL_SECRET=your_secret_here
    ```

### Step B: The Order Creation Logic (Codex Task)

1. In `POST /api/orders/create`:
    - Receive the `product_id` from the frontend.
    - Query the database to get the **true price** of the product (never trust the price sent from the frontend).
    - Call PayPal's `/v2/checkout/orders` API to create an order with the correct price.
    - Return the `paypal_order_id` to the frontend.
    - Create a record in the `Orders` database with status `PENDING`.

### Step C: The Payment Capture Logic (Codex Task)

1. In `POST /api/orders/capture`:
    - Receive the `paypal_order_id` from the frontend (after user approves the popup).
    - Call PayPal's `/v2/checkout/orders/{id}/capture` API to finalize the transaction.
    - If successful, update the `Orders` database status to `PAID`.
    - Return a success message to the frontend.

## 6. Tech Stack

- Backend: Actix-web, Serde, Reqwest
- Frontend: Typescript + React
- Database: MongoDB
- Payment: Paypal
