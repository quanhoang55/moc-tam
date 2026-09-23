export type Product = {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  images: string[];
  description: string;
};

export type CartItem = { product: Product; quantity: number };
