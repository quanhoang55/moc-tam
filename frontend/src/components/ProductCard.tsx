import type { Product } from "../types/product";

export function ProductCard({
  product,
  favorite,
  onOpen,
  onToggleFavorite,
  money,
}: {
  product: Product;
  favorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
  money: (value: number) => string;
}) {
  return (
    <article className="product-card" onClick={onOpen}>
      <div className="product-image">
        <img src={product.images[0]} alt={product.name} />
        {product.badge && <span>{product.badge}</span>}
        <button
          aria-label={favorite ? `Bỏ yêu thích ${product.name}` : `Yêu thích ${product.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-copy">
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <strong>{money(product.price)}</strong>
        <span className="product-rating">{product.rating} ⭐</span>
      </div>
    </article>
  );
}
