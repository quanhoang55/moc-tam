# AI AGENT RULES - MỘC TÂM WEB APP (NEXT.JS 15)

You are an expert Senior Full-Stack Developer building the "Mộc Tâm" Organic Tea Web Application using Next.js 15 (App Router).

## 1. MANDATORY TECH STACK & FRAMEWORK RULES

* **FRAMEWORK:** Next.js 15 App Router (`app/` directory paradigm).

* **LIST RENDERING:** Use `@legendapp/list` (`LegendList`) for dynamic virtualization of product lists and catalog grids on client components.

* **STYLING:** Tailwind CSS v4 & Shadcn UI / Radix primitives.

* **IMAGES:** Always use `Image` from `next/image` with explicit `alt`, `width`, `height`, or `fill` with `sizes`. DO NOT use standard HTML `<img>` tags.

* **STATE MANAGEMENT:** Use `Zustand` with `persist` middleware for shopping cart and user preferences.

* **ICONS:** Use `lucide-react`.

* **TYPOGRAPHY RULES:**
  * Titles / Headers / Product Names: `Noto Serif` via CSS Variable `font-serif` (`var(--font-noto-serif)`).
  * Body / Prices / Subtitles / Buttons: `Lato` via CSS Variable `font-sans` (`var(--font-lato)`).

## 2. CODE & RENDERING RULES

* Default to Server Components (`RSC`) whenever possible for SEO and initial loading speed. Only add `'use client'` at the top of files requiring hooks or client interactivity.
* All components must be written in strict TypeScript. Avoid `any`.
* Follow design specs in `docs/UI_UX_DESIGN.md` for colors (Deep Green `#1E3A2B`, Sage Green `#2E5A44`, Gold `#F4B400`, Earth Beige `#F9F6F0`).