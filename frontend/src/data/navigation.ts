export const NAV_ITEMS = [
  { key: "shop", label: "Shop" },
  { key: "how", label: "How It Works" },
  { key: "track", label: "Track Order" },
  { key: "contact", label: "Contact" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
