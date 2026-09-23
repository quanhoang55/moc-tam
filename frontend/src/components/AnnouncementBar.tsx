const ITEMS = [
  { glyph: "redeem", label: "redeem", text: "SAVE 50% TODAY" },
  {
    glyph: "verified_user",
    label: "verified_user",
    text: "90-DAY MONEY-BACK GUARANTEE",
  },
  { glyph: "local_shipping", label: "local_shipping", text: "FREE SHIPPING" },
  { glyph: "schedule", label: "schedule", text: "DELIVERY IN 3–8 DAYS" },
] as const;

export function AnnouncementBar() {
  return (
    <div className="announcement has-delivery" aria-label="Store announcements">
      <div className="announcement-track">
        {ITEMS.map((item) => (
          <p key={item.text}>
            <span
              className="announcement-icon material-icon material-symbols-outlined"
              aria-hidden="true"
            >
              {item.label}
            </span>
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}
