import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "mam-xoi",
    name: "Four-Herb Raspberry Leaf Tea",
    category: "Trà thảo mộc",
    subtitle: "Raspberry leaf, Pueraria mirifica, red vine & stevia",
    price: 29.99,
    rating: 4.8,
    reviews: 2143,
    badge: "Bán chạy",
    images: [
      "/images_new/tra-mam-xoi-1.jpg",
      "/images_new/tra-mam-xoi-2.jpg",
      "/images_new/tra-mam-xoi-3.jpg",
    ],
    description:
      "A warm, comforting cup made with four natural herbs for a gentle daily ritual.",
  },
  {
    id: "tra-moc-tam",
    name: "Four-Herb Raspberry Leaf Tea",
    category: "Trà xanh",
    subtitle: "Raspberry leaf, Pueraria mirifica, red vine & stevia",
    price: 29.99,
    rating: 4.8,
    reviews: 2143,
    badge: "Mới",
    images: [
      "/images_new/tra-moc-tam-gallery-2.png",
      "/images_new/tra-moc-tam-gallery-3.png",
      "/images_new/tra-moc-tam-gallery-4.png",
      "/images_new/tra-moc-tam-gallery-5.png",
    ],
    description:
      "A warm, comforting cup made with four natural herbs for a gentle daily ritual.",
  },
];

export const categories = [
  "Tất cả",
  ...new Set(products.map((product) => product.category)),
];

export const heroSlides = [
  {
    image: "/images_new/home-banner-1.png",
    alt: "Ấm trà thảo mộc trong không gian ấm áp",
  },
  {
    image: "/images_new/home-banner-2.png",
    alt: "Tách trà giữa đồi chè và núi rừng",
  },
  {
    image: "/images_new/home-banner-3.png",
    alt: "Tách trà xanh và lá trà trên bàn gỗ",
  },
];
