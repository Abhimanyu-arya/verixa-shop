import { Product, Testimonial } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Classic Essential',
    price: 35.00,
    category: 'Basics',
    description: 'A timeless staple crafted from 100% organic cotton. Features a relaxed fit and breathable fabric for everyday comfort.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
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
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
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
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=800&fit=crop',
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
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
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
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop',
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
      'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c73?w=600&h=800&fit=crop',
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