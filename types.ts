export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  avatar: string;
  content: string;
  rating: number; // 1-5
  tags: string[];
  timeAgo: string;
  sentiment: 'Very Satisfied' | 'Satisfied' | 'Neutral' | 'Dissatisfied';
}

export enum SortOption {
  NEWEST = 'Newest',
  PRICE_LOW = 'Price: Low to High',
  PRICE_HIGH = 'Price: High to Low',
}