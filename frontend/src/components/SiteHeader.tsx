import { useEffect, useRef } from "react";
import { NAV_ITEMS, type NavKey } from "../data/navigation";
import { icon } from "../lib/icons";

interface SiteHeaderProps {
  active: NavKey | null;
  cartCount: number;
  menuOpen: boolean;
  searchOpen: boolean;
  onNavigate: (key: NavKey) => void;
  onOpenMenu: () => void;
  onToggleSearch: (open: boolean) => void;
  onOpenCart: () => void;
}

export function SiteHeader({
  active,
  cartCount,
  menuOpen,
  searchOpen,
  onNavigate,
  onOpenMenu,
  onToggleSearch,
  onOpenCart,
}: SiteHeaderProps) {
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="icon-button menu-toggle"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
          dangerouslySetInnerHTML={{ __html: icon("hamburger") }}
        />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              data-nav={item.key}
              href="#"
              className={active === item.key ? "active" : undefined}
              aria-current={active === item.key ? "page" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.key);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="brand"
          href="#"
          aria-label="Mộc Tâm"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("shop");
          }}
        >
          <img src="/assets/images/moc-tam-logo.png" alt="Mộc Tâm" />
        </a>
        <div className="header-tools">
          <button
            className="icon-button search-toggle"
            type="button"
            aria-label="Search"
            onClick={() => onToggleSearch(!searchOpen)}
            dangerouslySetInnerHTML={{ __html: icon("search") }}
          />
          <a
            className="login-link"
            href="#footer"
            dangerouslySetInnerHTML={{ __html: icon("account") + "Log in" }}
          />
          <button
            className="icon-button cart-toggle"
            type="button"
            aria-label={`Cart ${cartCount} items`}
            onClick={onOpenCart}
            dangerouslySetInnerHTML={{
              __html:
                icon("cart") + `<span class="cart-count">${cartCount}</span>`,
            }}
          />
        </div>
      </div>
      <div
        className={`search-panel${searchOpen ? " is-open" : ""}`}
        aria-hidden={!searchOpen}
      >
        <label htmlFor="search-input">Search</label>
        <input
          id="search-input"
          type="search"
          placeholder="Search"
          ref={searchInput}
        />
        <button
          className="search-close icon-button"
          type="button"
          aria-label="Close search"
          onClick={() => onToggleSearch(false)}
          dangerouslySetInnerHTML={{ __html: icon("close") }}
        />
      </div>
    </header>
  );
}
