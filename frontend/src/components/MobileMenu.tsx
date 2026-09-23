import { NAV_ITEMS, type NavKey } from "../data/navigation";
import { icon } from "../lib/icons";

interface MobileMenuProps {
  open: boolean;
  active: NavKey | null;
  onNavigate: (key: NavKey) => void;
  onClose: () => void;
}

export function MobileMenu({ open, active, onNavigate, onClose }: MobileMenuProps) {
  return (
    <>
      <div className="menu-backdrop" hidden={!open} onClick={onClose} />
      <aside
        className={`mobile-menu${open ? " is-open" : ""}`}
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="mobile-menu-head">
          <h2>Menu</h2>
          <button
            className="mobile-menu-close icon-button"
            type="button"
            aria-label="Close"
            onClick={onClose}
            dangerouslySetInnerHTML={{ __html: icon("close") }}
          />
        </div>
        <nav aria-label="Mobile navigation">
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
          className="mobile-login"
          href="#footer"
          dangerouslySetInnerHTML={{ __html: icon("account") + "<strong>Log in</strong>" }}
        />
      </aside>
    </>
  );
}
