import { Product, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Classic Essential',
    price: 35.00,
    category: 'Basics',
    description: 'A timeless staple crafted from 100% organic cotton. Features a relaxed fit and breathable fabric for everyday comfort.',
    images: [
      'https://picsum.photos/seed/shirt1/600/800',
      'https://picsum.photos/seed/shirt1-detail/600/800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    isNew: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Urban Abstract Tee',
    price: 48.00,
    category: 'Graphic',
    description: 'Bold, artistic expression meets premium streetwear. Screen-printed with eco-friendly inks on heavyweight cotton.',
    images: [
      'https://picsum.photos/seed/shirt2/600/800',
      'https://picsum.photos/seed/shirt2-back/600/800',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Sand'],
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Serenity Linen Blend',
    price: 55.00,
    category: 'Premium',
    description: 'Experience the ultimate lightweight luxury. A flax-cotton blend perfect for summer evenings and layered looks.',
    images: [
      'https://picsum.photos/seed/shirt3/600/800',
      'https://picsum.photos/seed/shirt3-detail/600/800',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Sage', 'Cream', 'Dusty Rose'],
    rating: 4.7,
    reviewCount: 56
  },
  {
    id: '4',
    name: 'Vintage Wash Crew',
    price: 42.00,
    category: 'Vintage',
    description: 'Pre-shrunk and garment-dyed for that perfect lived-in feel from day one. Each piece is unique.',
    images: [
      'https://picsum.photos/seed/shirt4/600/800',
      'https://picsum.photos/seed/shirt4-detail/600/800',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Faded Black', 'Olive', 'Brick'],
    isNew: true,
    rating: 4.5,
    reviewCount: 32
  },
  {
    id: '5',
    name: 'Minimalist Logo Tee',
    price: 38.00,
    category: 'Basics',
    description: 'Subtle branding for the modern minimalist. Soft-touch fabric with a tailored fit.',
    images: [
      'https://picsum.photos/seed/shirt5/600/800',
      'https://picsum.photos/seed/shirt5-side/600/800',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Grey Melange'],
    rating: 4.6,
    reviewCount: 210
  },
  {
    id: '6',
    name: 'Artisan Dyed Henley',
    price: 65.00,
    category: 'Premium',
    description: 'Hand-dyed by local artisans using natural indigo. A statement piece that tells a story.',
    images: [
      'https://picsum.photos/seed/shirt6/600/800',
      'https://picsum.photos/seed/shirt6-detail/600/800',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Indigo'],
    rating: 5.0,
    reviewCount: 15
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    author: 'Kamisato Ayaka',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    content: "I'm very impressed with the ease of use of this shop. From intuitive navigation to speedy checkout, everything makes my shopping experience much more enjoyable. The fabric quality is unmatched.",
    rating: 5,
    tags: ['Shirt', 'Product'],
    timeAgo: '2 hours ago',
    sentiment: 'Very Satisfied'
  },
  {
    id: 't2',
    author: 'Furina Yuta',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    content: "The product I received is exactly as advertised. The quality is excellent and meets my expectations. I will definitely buy again from this store in the future.",
    rating: 4,
    tags: ['Shirt', 'Quality', 'Neutral'],
    timeAgo: '5 hours ago',
    sentiment: 'Satisfied'
  },
  {
    id: 't3',
    author: 'Jean Gunnhildr',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    content: "Absolutely love the vintage wash collection. The fit is perfect for a relaxed weekend vibe. Shipping was surprisingly fast too!",
    rating: 5,
    tags: ['Service', 'Speed'],
    timeAgo: '1 day ago',
    sentiment: 'Very Satisfied'
  }
];