import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  favorites,
  onProduct,
  toggleFavorite,
  money,
}: {
  products: Product[];
  favorites: string[];
  onProduct: (product: Product) => void;
  toggleFavorite: (id: string) => void;
  money: (value: number) => string;
}) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          favorite={favorites.includes(product.id)}
          onOpen={() => onProduct(product)}
          onToggleFavorite={() => toggleFavorite(product.id)}
          money={money}
        />
      ))}
    </div>
  );
}
