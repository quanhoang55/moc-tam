import type { ReactNode } from "react";
import { tabs, type Tab } from "../data/navigation";

export type { Tab } from "../data/navigation";

export function SiteHeader({
  activeTab,
  cartCount,
  onTab,
  onCart,
}: {
  activeTab: Tab;
  cartCount: number;
  onTab: (tab: Tab) => void;
  onCart: () => void;
}) {
  return (
    <header className="topbar">
      <button className="icon-button menu" aria-label="Mở menu">
        ☰
      </button>
      <button className="brand" onClick={() => onTab("Trang chủ")}>
        <img src="/images_new/moc-tam-logo.png" alt="Mộc Tâm" />
        <span>Trà thảo mộc, sống chậm</span>
      </button>
      <nav>
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => onTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <button
          className="icon-button"
          aria-label="Mở danh mục"
          onClick={() => onTab("Danh mục")}
        >
          ⌕
        </button>
        <button
          className="cart-button"
          aria-label="Mở giỏ hàng"
          onClick={onCart}
        >
          ♧ {cartCount > 0 && <b>{cartCount}</b>}
        </button>
      </div>
    </header>
  );
}

export function MobileTabs({
  activeTab,
  onTab,
}: {
  activeTab: Tab;
  onTab: (tab: Tab) => void;
}) {
  const icons: Record<Tab, ReactNode> = {
    "Trang chủ": "⌂",
    "Danh mục": "⊞",
    "Yêu thích": "♡",
    "Đơn hàng": "♧",
    "Tài khoản": "♙",
  };
  return (
    <div className="mobile-tabs">
      {tabs.map((tab) => (
        <button
          className={activeTab === tab ? "active" : ""}
          key={tab}
          onClick={() => onTab(tab)}
        >
          <span>{icons[tab]}</span>
          {tab}
        </button>
      ))}
    </div>
  );
}
