# Tech Stack & Web Performance Guide

## 1. Core Web Technology Stack

* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript (Strict Mode)
* **UI & Styling:** Tailwind CSS v4, Shadcn UI / Radix Primitives
* **Icons:** `lucide-react`
* **Virtual List Component:** `@legendapp/list` (Mandatory for long virtualized product lists on Web)
* **Image Optimization:** `next/image` with AVIF/WebP formats
* **State Management:** `Zustand` with `persist` middleware
* **Typography:** `next/font/google` (`Noto_Serif` & `Lato`)

---

## 2. Legend List Web Integration (`@legendapp/list`)

```tsx
'use client';

import { LegendList } from "@legendapp/list";
import { ProductCard } from "@/components/cards/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <LegendList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={320}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    />
  );
}
```

---

## 3. Web Font Optimization Setup (`app/layout.tsx`)

```tsx
import { Noto_Serif, Lato } from 'next/font/google';

const notoSerif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-serif',
  display: 'swap',
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${notoSerif.variable} ${lato.variable}`}>
      <body className="font-sans bg-surface-beige/30 text-text-main antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

## 4. Zustand Web Store (`store/cart-store.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'moc-tam-cart',
    }
  )
);
```