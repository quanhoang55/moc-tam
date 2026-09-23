import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import "./App.css";
import { HeroSlideshow } from "./components/HeroSlideshow";
import { MobileTabs, SiteHeader } from "./components/SiteHeader";
import { ProductGrid } from "./components/ProductGrid";
import { categories, products } from "./data/products";
import { PayPalCheckoutButton } from "./components/PayPalCheckoutButton";
import { FeedbackWidget } from "./components/FeedbackWidget";
import type { Tab } from "./data/navigation";
import type { CartItem, Product } from "./types/product";

type Screen = "home" | "catalog" | "detail" | "cart";
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
const TWO_BOX_PRICE = 49.99;
const cartItemTotal = (price: number, quantity: number) =>
  Math.floor(quantity / 2) * TWO_BOX_PRICE + (quantity % 2) * price;

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeTab, setActiveTab] = useState<Tab>("Trang chủ");
  const [category, setCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const visible = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "Tất cả" || product.category === category) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [category, search],
  );
  const goTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "Trang chủ") setScreen("home");
    else if (tab === "Đơn hàng") setScreen("cart");
    else if (tab === "Danh mục" || tab === "Yêu thích") setScreen("catalog");
  };
  const goCatalog = (nextCategory = "Tất cả") => {
    setCategory(nextCategory);
    setActiveTab("Danh mục");
    setScreen("catalog");
  };
  const openProduct = (product: Product) => {
    setSelected(product);
    setScreen("detail");
  };
  const toggleFavorite = (id: string) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const addToCart = (product: Product, quantity: number) =>
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...current, { product, quantity }];
    });
  return (
    <div className="app-shell">
      <SiteHeader
        activeTab={activeTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onTab={goTab}
        onCart={() => setScreen("cart")}
      />
      <main>
        {screen === "home" && (
          <Home
            onExplore={() => goCatalog()}
            onCategory={goCatalog}
            onProduct={openProduct}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {screen === "catalog" && (
          <Catalog
            products={
              activeTab === "Yêu thích"
                ? products.filter((product) => favorites.includes(product.id))
                : visible
            }
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            onBack={() => goTab("Trang chủ")}
            onProduct={openProduct}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            emptyFavorites={activeTab === "Yêu thích"}
          />
        )}
        {screen === "detail" && selected && (
          <Detail
            product={selected}
            onBack={() => goCatalog(selected.category)}
            onAdd={(quantity) => addToCart(selected, quantity)}
            favorite={favorites.includes(selected.id)}
            toggleFavorite={() => toggleFavorite(selected.id)}
          />
        )}
        {screen === "cart" && (
          <Cart items={cart} setCart={setCart} onContinue={() => goCatalog()} />
        )}
      </main>
      {screen === "home" && <FeedbackWidget />}
      <footer>
        <span>© 2024 Mộc Tâm</span>
        <span>Trà lành cho ngày an yên</span>
      </footer>
      <MobileTabs activeTab={activeTab} onTab={goTab} />
    </div>
  );
}

function Home({
  onExplore,
  onCategory,
  onProduct,
  favorites,
  toggleFavorite,
}: {
  onExplore: () => void;
  onCategory: (category: string) => void;
  onProduct: (product: Product) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}) {
  return (
    <>
      <section className="hero">
        <HeroSlideshow />
        <div className="hero-copy">
          <p>Mộc Tâm</p>
          <h1>
            Herbal Tea,
            <br />
            Brewed Slowly
          </h1>
          <span>
            Natural tea and herbs, gently packaged
            <br />
            for quiet moments in your day.
          </span>
          <button onClick={onExplore}>
            Khám phá ngay <i>→</i>
          </button>
        </div>
      </section>
      <section className="values">
        {[
          "Lá mộc chọn lọc",
          "Hương vị tự nhiên",
          "Giao hàng nhanh",
          "Thanh toán an toàn",
        ].map((value, index) => (
          <div key={value}>
            <b>{["◌", "♧", "▣", "◇"][index]}</b>
            <span>{value}</span>
          </div>
        ))}
      </section>
      <section className="section">
        <SectionHeading
          title="Khám phá các loại trà"
          action="Xem tất cả →"
          onAction={() => onCategory("Tất cả")}
        />
        <div className="category-row">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onCategory(product.category)}
            >
              <img src={product.images[0]} alt="" />
              <span>{product.category}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading
          title="Sản phẩm nổi bật"
          action="Xem tất cả →"
          onAction={() => onCategory("Tất cả")}
        />
        <ProductGrid
          products={products}
          onProduct={onProduct}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          money={money}
        />
      </section>
    </>
  );
}

function Catalog({
  products: items,
  category,
  setCategory,
  search,
  setSearch,
  onBack,
  onProduct,
  favorites,
  toggleFavorite,
  emptyFavorites,
}: {
  products: Product[];
  category: string;
  setCategory: (value: string) => void;
  search: string;
  setSearch: (value: string) => void;
  onBack: () => void;
  onProduct: (product: Product) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  emptyFavorites: boolean;
}) {
  return (
    <section className="catalog section">
      <div className="page-heading">
        <button className="back" onClick={onBack}>
          ←
        </button>
        <div>
          <p className="eyebrow">Mộc Tâm</p>
          <h1>{emptyFavorites ? "Yêu thích" : "Bộ sưu tập trà"}</h1>
        </div>
        <button className="icon-button">⚙</button>
      </div>
      <div className="catalog-tools">
        <label>
          ⌕
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm loại trà bạn yêu thích..."
          />
        </label>
        <button className="filter">☷</button>
      </div>
      {!emptyFavorites && (
        <div className="chips">
          {categories.map((item) => (
            <button
              className={category === item ? "selected" : ""}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {items.length ? (
        <ProductGrid
          products={items}
          onProduct={onProduct}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          money={money}
        />
      ) : (
        <EmptyState text="Bạn chưa lưu sản phẩm nào." />
      )}
    </section>
  );
}

function Detail({
  product,
  onBack,
  onAdd,
  favorite,
  toggleFavorite,
}: {
  product: Product;
  onBack: () => void;
  onAdd: (quantity: number) => void;
  favorite: boolean;
  toggleFavorite: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [offerQuantity, setOfferQuantity] = useState(2);
  const [added, setAdded] = useState(false);
  const addSelectedOffer = () => {
    onAdd(offerQuantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };
  const benefits = [
    [
      "♧",
      "Four natural herbs",
      "Raspberry leaf, Pueraria mirifica, red vine & stevia",
    ],
    ["♨", "Gentle daily ritual", "A warm, comforting cup any time of day"],
    ["◇", "100% natural", "No artificial flavoring or coloring"],
    [
      "♡",
      "For women’s wellness",
      "A thoughtful companion for your daily routine",
    ],
  ];
  return (
    <section className="detail section">
      <div className="detail-head">
        <button className="back" onClick={onBack}>
          ←
        </button>
        <span>Mộc Tâm</span>
        <div>
          <button className="icon-button">⇧</button>
          <button className="icon-button" onClick={toggleFavorite}>
            {favorite ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <div className="detail-image">
            <img src={product.images[imageIndex]} alt={product.name} />
            <span>
              100%
              <br />
              NATURAL
              <br />
              HERBS
            </span>
          </div>
          <div className="detail-thumbnails">
            {product.images.map((image, index) => (
              <button
                className={imageIndex === index ? "active" : ""}
                key={image}
                onClick={() => setImageIndex(index)}
              >
                <img src={image} alt={`${product.name} image ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-info">
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <span aria-label="5 out of 5 stars">★★★★★</span>
            <strong>{product.rating}</strong>
            <small>({product.reviews.toLocaleString("en-US")} reviews)</small>
          </div>
          <div className="benefit-grid">
            {benefits.map(([icon, title, copy]) => (
              <div className="benefit" key={title}>
                <span aria-hidden="true">{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="offer-heading">
            <span />
            TODAY&apos;S OFFER
            <span />
          </div>
          <div className="offer-list">
            <button
              className={offerQuantity === 1 ? "selected" : ""}
              onClick={() => setOfferQuantity(1)}
            >
              <i aria-hidden="true" />
              <span>
                <strong>1 Box</strong>
              </span>
              <b>{money(product.price)}</b>
            </button>
            <button
              className={offerQuantity === 2 ? "selected" : ""}
              onClick={() => setOfferQuantity(2)}
            >
              <i aria-hidden="true" />
              <span>
                <strong>2 Boxes</strong>
                <small>Save $9.99</small>
              </span>
              <em>MOST POPULAR</em>
              <b>{money(TWO_BOX_PRICE)}</b>
            </button>
          </div>
          <button className="add-cart-primary" onClick={addSelectedOffer}>
            {added ? "ADDED TO CART" : "ADD TO CART"}
          </button>
          <p className="viewer-note">
            <span /> 1 person is viewing this product
          </p>
          <p className="delivery-note">
            ▱ &nbsp; Estimated delivery: <strong>Sep 25 – Sep 30</strong>
          </p>
          <div className="stock-notice">
            <strong>ⓘ &nbsp; UPDATE:</strong>
            <p>
              <b>We&apos;re currently going viral on social media</b> and have
              very limited stock remaining!
            </p>
            <p>
              <b>Get yours now</b> before we sell out again!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cart({
  items,
  setCart,
  onContinue,
}: {
  items: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  onContinue: () => void;
}) {
  const [showPayment, setShowPayment] = useState(false);
  const total = items.reduce(
    (sum, item) => sum + cartItemTotal(item.product.price, item.quantity),
    0,
  );
  const change = (id: string, delta: number) =>
    setCart((current) =>
      current.map((item) =>
        item.product.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  return (
    <section className="cart section">
      <div className="page-heading">
        <button className="back" onClick={onContinue}>
          ←
        </button>
        <div>
          <p className="eyebrow">Mộc Tâm</p>
          <h1>Giỏ hàng</h1>
        </div>
      </div>
      {items.length ? (
        <>
          <div className="cart-list">
            {items.map(({ product, quantity }) => (
              <div className="cart-item" key={product.id}>
                <img src={product.images[0]} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.subtitle}</p>
                  <strong>
                    {money(cartItemTotal(product.price, quantity))}
                  </strong>
                  <div className="quantity">
                    <button onClick={() => change(product.id, -1)}>−</button>
                    <b>{quantity}</b>
                    <button onClick={() => change(product.id, 1)}>＋</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <span>Total</span>
            <strong>{money(total)}</strong>
            {!showPayment && (
              <button className="buy-now" onClick={() => setShowPayment(true)}>
                BUY NOW
              </button>
            )}
            {showPayment && (
              <div className="cart-payment">
                <PayPalCheckoutButton
                  productId="cart"
                  onSuccess={() => {
                    alert(
                      "Thanh toán thành công! Đơn hàng của bạn đang được xử lý.",
                    );
                    setCart([]);
                    setShowPayment(false);
                  }}
                  onError={() =>
                    alert("Thanh toán thất bại, vui lòng thử lại sau.")
                  }
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          text="Giỏ hàng đang trống."
          action="Tiếp tục mua sắm"
          onAction={onContinue}
        />
      )}
    </section>
  );
}

function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <button onClick={onAction}>{action}</button>
    </div>
  );
}
function EmptyState({
  text,
  action,
  onAction,
}: {
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="empty">
      <span>♡</span>
      <p>{text}</p>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

export default App;
