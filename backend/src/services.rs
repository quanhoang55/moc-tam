use actix_web::{post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};

use crate::paypal_client::PayPalClient;
use crate::middleware::User;

#[derive(Deserialize)]
pub struct CreateOrderRequest {
    pub product_id: String,
}

#[derive(Serialize)]
pub struct CreateOrderResponse {
    pub paypal_order_id: String,
    pub approve_url: String,
}

#[derive(Deserialize)]
pub struct CaptureOrderRequest {
    pub paypal_order_id: String,
}

#[post("/api/orders/paypal/create")]
pub async fn create_paypal_order(
    // _user: User, // Temporarily disabled for testing
    req: web::Json<CreateOrderRequest>,
    paypal_client: web::Data<PayPalClient>,
) -> impl Responder {
    // 1. Mock Database: Fetch price
    // In real app: let product = db.get_product(&req.product_id).await?;
    let mock_price = 15.00; // USD
    
    println!("Initiating PayPal checkout for product: {} at price: {}", req.product_id, mock_price);

    // 2. Create order in PayPal
    match paypal_client.create_order(mock_price, "USD").await {
        Ok(order_res) => {
            // Find the "approve" link in the response
            let approve_url = order_res.links.into_iter()
                .find(|link| link.rel == "approve")
                .map(|link| link.href)
                .unwrap_or_default();

            HttpResponse::Ok().json(CreateOrderResponse {
                paypal_order_id: order_res.id,
                approve_url,
            })
        },
        Err(e) => {
            eprintln!("PayPal Create Error: {}", e);
            HttpResponse::InternalServerError().body("Failed to communicate with PayPal")
        }
    }
}

#[post("/api/orders/paypal/capture")]
pub async fn capture_paypal_order(
    // user: User, // Temporarily disabled for testing
    req: web::Json<CaptureOrderRequest>,
    paypal_client: web::Data<PayPalClient>,
) -> impl Responder {
    // 1. Capture order in PayPal
    match paypal_client.capture_order(&req.paypal_order_id).await {
        Ok(capture_res) => {
            // 2. Validate COMPLETED status
            if capture_res.status == "COMPLETED" {
                // 3. Mock Database: Save the order
                // In real app: db.save_order(user.id, &req.paypal_order_id, "PAID").await?;
                println!("Order {} successfully captured and saved", req.paypal_order_id);
                
                HttpResponse::Ok().body("Order captured and saved successfully.")
            } else {
                eprintln!("Order not completed. Status: {}", capture_res.status);
                HttpResponse::BadRequest().body(format!("Order status is not COMPLETED: {}", capture_res.status))
            }
        },
        Err(e) => {
            eprintln!("PayPal Capture Error: {}", e);
            HttpResponse::InternalServerError().body("Failed to capture payment via PayPal")
        }
    }
}
