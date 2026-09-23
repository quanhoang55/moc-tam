import { useState } from "react";
import { money } from "../lib/format";
import { icon, payment } from "../lib/icons";
import type { CartLine } from "../types/product";
import { PayPalCheckoutButton } from "./PayPalCheckoutButton";

const CART_PAYMENTS: Array<[string, string]> = [
  ["amex", "American Express"],
  ["apple", "Apple Pay"],
  ["discover", "Discover"],
  ["gpay", "Google Pay"],
  ["mastercard", "Mastercard"],
  ["shop", "Shop Pay"],
  ["visa", "Visa"],
];

interface CartDrawerProps {
  open: boolean;
  lines: CartLine[];
  onClose: () => void;
  onQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}

export function CartDrawer({ open, lines, onClose, onQty, onRemove, onClear }: CartDrawerProps) {
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const savings = lines.reduce((sum, line) => sum + (line.regular - line.price) * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <>
      <div className="cart-backdrop" hidden={!open} onClick={onClose} />
      <aside
        className={`cart-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-label="Your cart"
        aria-hidden={!open}
      >
        <div className="cart-head">
          <h2>
            Cart · <span className="cart-item-count">{count} items</span>
          </h2>
          <button
            className="cart-close icon-button"
            type="button"
            aria-label="Close"
            onClick={onClose}
            dangerouslySetInnerHTML={{ __html: icon("close") }}
          />
        </div>
        <div className="cart-reserved">
          Cart reserved for <strong>04:57</strong>
        </div>

        <div className="cart-items" id="cart-items">
          {lines.length === 0 && <p className="cart-empty">Your cart is empty.</p>}
          {lines.map((line) => (
            <div className="cart-item" key={line.key}>
              <img src={line.image} alt="" />
              <div className="cart-item-copy">
                <h3>{line.name}</h3>
                <div className="cart-item-prices">
                  {line.regular > line.price && <del>{money(line.regular)}</del>}
                  <strong>{money(line.price)}</strong>
                  <span className="cart-tag">{line.tag}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="qty">
                    <button
                      type="button"
                      aria-label={`Decrease quantity for ${line.name}`}
                      onClick={() => onQty(line.key, -1)}
                      dangerouslySetInnerHTML={{ __html: icon("minus") }}
                    />
                    <input
                      value={line.qty}
                      aria-label={`Quantity for ${line.name}`}
                      readOnly
                    />
                    <button
                      type="button"
                      aria-label={`Increase quantity for ${line.name}`}
                      onClick={() => onQty(line.key, 1)}
                      dangerouslySetInnerHTML={{ __html: icon("plus") }}
                    />
                  </div>
                  <button
                    className="remove-item"
                    type="button"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => onRemove(line.key)}
                    dangerouslySetInnerHTML={{ __html: icon("trash") }}
                  />
                  {line.regular > line.price && (
                    <span className="cart-save">
                      {money((line.regular - line.price) * line.qty)} saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p>
            <strong>Savings</strong>
            <strong className="cart-savings">{savings ? `-${money(savings)}` : money(0)}</strong>
          </p>
          <p>
            <strong>Subtotal</strong>
            <strong className="cart-subtotal">{money(subtotal)}</strong>
          </p>
          {showPayment && lines.length > 0 ? (
            <div className="cart-checkout">
              <PayPalCheckoutButton
                productId="cart"
                onSuccess={() => {
                  alert("Payment successful! Your order is being processed.");
                  onClear();
                  setShowPayment(false);
                  onClose();
                }}
                onError={() => {
                  alert("Payment failed, please try again later.");
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              disabled={lines.length === 0}
              onClick={() => setShowPayment(true)}
            >
              Check out
            </button>
          )}
          <div className="cart-payments">
            {CART_PAYMENTS.map(([className, name]) => (
              <span
                key={className}
                className={`payment ${className}`}
                dangerouslySetInnerHTML={{ __html: payment(name) }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
