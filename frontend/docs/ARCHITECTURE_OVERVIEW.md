# Architecture & Project Structure (Next.js App Router)

## 1. Directory Layout

```text
├── app/                  # Next.js App Router directory
│   ├── (shop)/           # Shop layout group
│   │   ├── page.tsx      # Home page
│   │   ├── products/
│   │   │   ├── page.tsx  # Catalog page
│   │   │   └── [slug]/
│   │   │       └── page.tsx # Product details
│   │   ├── cart/
│   │   │   └── page.tsx  # Cart / Checkout page
│   │   └── layout.tsx
│   ├── api/              # Route Handlers / API Endpoints
│   ├── layout.tsx        # Root layout with Google Fonts
│   └── globals.css       # Tailwind CSS v4 imports & custom styles
├── components/           # UI Component hierarchy
│   ├── ui/               # Base primitives (Button, Dialog, Input via Shadcn)
│   ├── cards/            # ProductCard, CategoryCard
│   ├── layout/           # Navbar, Footer, MobileNav, CartDrawer
│   └── sections/         # HeroSection, FeaturedGrid, Reviews
├── constants/            # Configs, theme constants, static menu items
├── hooks/                # Custom React hooks (useCart, useMediaQuery)
├── lib/                  # Utilities (cn helper, formatters, API client)
├── store/                # Zustand client state stores
├── types/                # TypeScript interfaces
└── docs/                 # AI & System Context Documentation
```

## 2. Core Architectural Principles
- **Server vs Client Components:** Maximize Server Components (`RSC`) for fast HTML rendering & SEO. Limit Client Components (`'use client'`) to interactive controls, dynamic state, and `@legendapp/list`.
- **Image Optimization:** Enforce `next/image` with responsive `sizes` attribute.
- **Font Optimization:** Load Google Fonts using CSS variables via `next/font/google` to eliminate Cumulative Layout Shift (CLS).