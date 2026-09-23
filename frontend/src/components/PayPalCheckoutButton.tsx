import { PayPalButtons } from "@paypal/react-paypal-js";
import { apiPost } from "../lib/api";

interface PayPalCheckoutButtonProps {
  /** Customer email — sent to the backend so it can store the order and
   *  send the post-purchase receipt. */
  email: string;
  /** Cart total in the given currency. */
  amount: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}

export function PayPalCheckoutButton({
  email,
  amount,
  currency = "USD",
  onSuccess,
  onError,
}: PayPalCheckoutButtonProps) {
  return (
    <PayPalButtons
      style={{ layout: "vertical", label: "buynow" }}
      createOrder={async () => {
        try {
          const orderData = await apiPost<{ paypal_order_id?: string }>(
            "/api/orders/paypal/create",
            { email, amount, currency },
          );

          if (orderData?.paypal_order_id) {
            return orderData.paypal_order_id;
          }
          throw new Error(
            orderData ? JSON.stringify(orderData) : "Missing paypal_order_id",
          );
        } catch (error) {
          console.error("Error creating PayPal order:", error);
          onError?.(error);
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          await apiPost("/api/orders/paypal/capture", {
            paypal_order_id: data.orderID,
          });

          console.log("Payment captured and confirmed by the server.");
          onSuccess?.();
        } catch (error) {
          console.error("Error capturing PayPal order:", error);
          onError?.(error);
          throw error;
        }
      }}
    />
  );
}
