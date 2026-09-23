import { useState } from "react";
import { useLocalForm, type LocalField } from "../hooks/useLocalForm";

type TrackMode = "order" | "number";

const ORDER_FIELDS: LocalField[] = [
  { id: "track-order-number", required: true, error: "Please enter your order number." },
  { id: "track-order-email", required: true, error: "Please enter your email." },
];

const TRACKING_FIELDS: LocalField[] = [
  { id: "track-number", required: true, error: "Please enter your tracking number." },
];

export function TrackOrderScreen() {
  const [mode, setMode] = useState<TrackMode>("order");
  const { errors, handleSubmit } = useLocalForm("Thank you.");

  const orderNumberError = errors["track-order-number"];
  const orderEmailError = errors["track-order-email"];
  const trackingError = errors["track-number"];

  return (
    <section className="track-section">
      <div className="track-app">
        <h1>Track Your Order</h1>
        <div className="track-tabs" role="tablist">
          <button
            type="button"
            data-track-tab="order"
            role="tab"
            aria-selected={mode === "order"}
            className={`track-tab${mode === "order" ? " active" : ""}`}
            onClick={() => setMode("order")}
          >
            Order Number
          </button>
          <button
            type="button"
            data-track-tab="number"
            role="tab"
            aria-selected={mode === "number"}
            className={`track-tab${mode === "number" ? " active" : ""}`}
            onClick={() => setMode("number")}
          >
            Tracking Number
          </button>
        </div>

        <form
          id="order-form"
          className="track-form"
          data-track-form="order"
          hidden={mode !== "order"}
          onSubmit={(event) => handleSubmit(event, ORDER_FIELDS)}
        >
          <div
            className={`track-field${orderNumberError ? " field-wrapper--error" : ""}`}
          >
            <input
              id="track-order-number"
              type="text"
              placeholder="Order number"
              aria-label="Order number"
              aria-invalid={orderNumberError ? true : undefined}
            />
            {orderNumberError && <small className="field-error">{orderNumberError}</small>}
          </div>
          <div
            className={`track-field${orderEmailError ? " field-wrapper--error" : ""}`}
          >
            <input
              id="track-order-email"
              type="text"
              placeholder="Email"
              aria-label="Email"
              aria-invalid={orderEmailError ? true : undefined}
            />
            {orderEmailError && <small className="field-error">{orderEmailError}</small>}
          </div>
          <button className="track-submit" type="submit">
            Track
          </button>
          <p className="powered">
            Powered by{" "}
            <a href="https://www.17track.net" target="_blank" rel="noreferrer">
              17TRACK
            </a>
          </p>
        </form>

        <form
          id="tracking-form"
          className="track-form"
          data-track-form="number"
          hidden={mode !== "number"}
          onSubmit={(event) => handleSubmit(event, TRACKING_FIELDS)}
        >
          <div className={`track-field${trackingError ? " field-wrapper--error" : ""}`}>
            <input
              id="track-number"
              type="text"
              placeholder="Tracking number"
              aria-label="Tracking number"
              aria-invalid={trackingError ? true : undefined}
            />
            {trackingError && <small className="field-error">{trackingError}</small>}
          </div>
          <button className="track-submit" type="submit">
            Track
          </button>
          <p className="powered">
            Powered by{" "}
            <a href="https://www.17track.net" target="_blank" rel="noreferrer">
              17TRACK
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
