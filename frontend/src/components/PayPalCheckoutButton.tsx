import { PayPalButtons } from "@paypal/react-paypal-js";
import { apiPost } from "../lib/api";

interface PayPalCheckoutButtonProps {
  productId: string;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export function PayPalCheckoutButton({
  productId,
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
            { product_id: productId },
          );

          if (orderData.paypal_order_id) {
            return orderData.paypal_order_id;
          } else {
            throw new Error(JSON.stringify(orderData));
          }
        } catch (error) {
          console.error("Lỗi khi tạo đơn hàng:", error);
          if (onError) onError(error);
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          await apiPost("/api/orders/paypal/capture", {
            paypal_order_id: data.orderID,
          });

          console.log("Thanh toán thành công và đã được xác nhận bởi server.");
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error("Lỗi khi capture đơn hàng:", error);
          if (onError) onError(error);
          throw error;
        }
      }}
    />
  );
}
