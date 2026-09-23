# UI/UX Design System - Mộc Tâm Herbal Tea Web Application

## 1. Brand & Aesthetic Direction
- **Brand Personality:** Organic, serene, natural, traditional yet modern, calming ("Chậm một chút, an yên hơn").
- **Design Style:** Clean, spacious web layout, soft organic tones, ample white space, rounded subtle borders (`rounded-xl` / `rounded-2xl`), responsive grid layout.

---

## 2. Typography Rules (`next/font/google`)

### Font Families
- **Header / Titles (Serif):** `Noto Serif`
- **Body / Captions / Buttons (Sans-Serif):** `Lato`

### Typography Hierarchy

| Style | Font Family | Desktop Size | Mobile Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | Noto Serif | 36px | 28px | Bold (700) | Hero section headers |
| **Heading 1** | Noto Serif | 28px | 22px | SemiBold (600) | Page titles, Category section headers |
| **Heading 2** | Noto Serif | 22px | 18px | Medium (500) | Product card titles, Modal headers |
| **Subtitle** | Lato | 16px | 14px | Regular (400) | Slogans, Sub-captions |
| **Body Large**| Lato | 18px | 16px | Bold (700) | Prices, Highlight metrics |
| **Body Regular**| Lato | 15px | 14px | Regular (400) | Descriptions, Main body, Filters |
| **Caption** | Lato | 13px | 12px | Light (300) / Regular | Rating counters, Meta text |
| **Button Text**| Lato | 15px | 14px | Medium (500) | Action buttons, Navigation links |

---

## 3. Color Palette (Tailwind CSS Config)

```javascript
colors: {
  primary: {
    DEFAULT: '#1E3A2B', // Deep Green
    sage: '#2E5A44',    // Sage Green
  },
  accent: {
    gold: '#F4B400',    // Star Rating & Badges
    warm: '#E5A93C',
  },
  surface: {
    beige: '#F9F6F0',   // Light organic container background
    muted: '#F2F4F3',   // Input backgrounds
  },
  text: {
    main: '#1A1A1A',
    muted: '#666666',
  }
}
```

---

## 4. Web Responsive Layout & Spacing
- **Container Max-Width:** `max-w-7xl` (`1280px`) centered.
- **Desktop Grid:** 4-column product grid (`grid-cols-4 gap-6`).
- **Tablet Grid:** 3-column product grid (`grid-cols-3 gap-4`).
- **Mobile Grid:** 2-column product grid (`grid-cols-2 gap-3`).
- **Header:** Sticky Navbar with Logo, Navigation Links, Search Input, Wishlist, and Cart Drawer.

---

## 5. Components Specification

### A. Web Navbar & Sticky Header
- Brand Logo ("Mộc Tâm - Trà thảo mộc, sống chậm").
- Search Input with auto-complete dropdown.
- Quick navigation links: Trang chủ, Bộ sưu tập, Câu chuyện thương hiệu, Liên hệ.
- Action icons: Wishlist counter badge, Shopping Cart slide-over drawer trigger.

### B. Product Cards
- Aspect ratio container (`aspect-square` or `aspect-[4/3]`) using `next/image` with `sizes` & `priority` attributes.
- Subtle hover elevation (`hover:-translate-y-1 hover:shadow-lg transition-all`).
- Quick Add / Wishlist overlay buttons on hover.

### C. Product Detail Page Layout
- 2-Column Desktop layout: Left column (Sticky Gallery), Right column (Product info, Options, Purchase actions).
- Variant selector: Pill button group (`20 túi lọc`, `100g`, `200g`).