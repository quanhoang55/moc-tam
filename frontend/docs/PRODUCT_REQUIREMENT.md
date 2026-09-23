# Product Requirement Document (PRD) - Mộc Tâm Web App

## 1. Project Overview
**Mộc Tâm** is an e-commerce web platform built with Next.js 15 for organic herbal tea products. It emphasizes fast initial page loads (Server-Side Rendering & Static Site Generation), smooth dynamic rendering with `@legendapp/list`, and instant client state management with Zustand.

## 2. Target Audience
Web desktop and mobile browser users looking for organic tea, lifestyle wellness products, and gift sets.

## 3. Core Pages & Feature Scope

### Phase 1: Web MVP Scope
1. **Landing / Home Page (`app/page.tsx`):**
   - Hero Banner with call-to-action button ("Khám phá ngay").
   - Brand core values grid (4 highlights).
   - Category Showcase with smooth horizontal tab switches.
   - Featured products powered by `@legendapp/list` for virtualized rendering.

2. **Product Catalog Page (`app/products/page.tsx`):**
   - Side-bar filters (Category, Price range, In-stock status).
   - Dynamic sorting (Newest, Popularity, Price Low/High).
   - Infinite scroll / Virtualized grid using `@legendapp/list`.

3. **Product Detail Page (`app/products/[slug]/page.tsx`):**
   - High-res image gallery with zoom-on-hover using `next/image`.
   - Dynamic variant selection (Weight / Package type).
   - Customer reviews section with star ratings.
   - Sticky bottom/side buy container.

4. **Cart Drawer & Checkout Flow (`app/checkout/page.tsx`):**
   - Slide-over cart drawer built with Radix UI / Shadcn.
   - Local cart persistence via Zustand (`localStorage`).
   - Checkout page with order summary and shipping details form.

---

## 4. Web Performance Targets
- **Core Web Vitals:** LCP < 1.8s, FID/INP < 100ms, CLS < 0.05.
- **Images:** All images served as AVIF/WebP formats via `next/image`.
- **State Management:** Fast client state updates with Zustand.