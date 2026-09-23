import type { MouseEvent } from "react";
import type { NavKey } from "../data/navigation";

interface SiteFooterProps {
  onNavigate: (key: NavKey) => void;
  onProduct: (id: string) => void;
}

export function SiteFooter({ onNavigate, onProduct }: SiteFooterProps) {
  const go =
    (key: NavKey) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate(key);
    };
  const goProduct =
    (id: string) =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onProduct(id);
    };

  return (
    <footer id="footer" className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Story */}
          <div className="footer-col footer-col-brand">
            <a
              className="footer-brand"
              href="#"
              aria-label="Mộc Tâm"
              onClick={go("shop")}
            >
              <img
                src="/assets/images/moc-tam-logo.png"
                alt="Mộc Tâm"
                className="footer-logo"
              />
              <span className="footer-brand-title">Mộc Tâm</span>
            </a>
            <p className="footer-desc">
              Natural herbal tea that brings calm and tranquility to your day. Made with
              carefully selected herbs for everyday wellness.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
                100% Natural
              </span>
              <span className="footer-badge">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                90-Day Returns
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#" onClick={go("shop")}>
                  Shop
                </a>
              </li>
              <li>
                <a href="#" onClick={goProduct("tra-moc-tam")}>
                  Four-Herb Raspberry Leaf Tea
                </a>
              </li>
              <li>
                <a href="#" onClick={goProduct("mam-xoi")}>
                  Four-Herb Raspberry Leaf Tea
                </a>
              </li>
              <li>
                <a href="#" onClick={go("how")}>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" onClick={go("track")}>
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="footer-col">
            <h3 className="footer-heading">Customer Care</h3>
            <ul className="footer-links">
              <li>
                <a href="#" onClick={go("contact")}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" onClick={go("how")}>
                  Returns &amp; Refunds
                </a>
              </li>
              <li>
                <a href="#" onClick={go("contact")}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" onClick={go("contact")}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" onClick={go("how")}>
                  Shipping &amp; Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <span className="contact-icon" aria-hidden="true">
                  <span className="material-icon material-symbols-outlined">badge</span>
                </span>
                <div className="contact-text">
                  <p aria-label="Tax identification number">18322985798</p>
                </div>
              </div>
              <div className="footer-contact-item">
                <span className="contact-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <div className="contact-text">
                  <p aria-label="Business address">7303 BREEN DR, SUITE D2, HOUSTON TX 77086</p>
                </div>
              </div>
              <div className="footer-contact-item">
                <span className="contact-icon" aria-hidden="true">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
                <div className="contact-text">
                  <p aria-label="Opening hours">Mon – Sun: 8:00 AM – 8:00 PM (CST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-inner">
            <p className="footer-copyright">
              © 2026,{" "}
              <a href="#" onClick={go("shop")}>
                Mộc Tâm
              </a>
              . Powered by Mộc Tâm. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
