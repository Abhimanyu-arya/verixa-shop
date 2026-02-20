import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Fetch all products and filter by wishlist IDs
        const allProducts = await api.getProducts();
        setProducts(allProducts.filter(p => wishlist.includes(p.id)));
      } catch (err: any) {
        setError('Failed to load wishlist items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-900">My Wishlist</h1>
            <p className="text-brand-500 mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          {products.length > 0 && (
            <button
              onClick={() => wishlist.forEach(id => toggleWishlist(id))}
              className="text-sm text-brand-500 hover:text-red-600 transition-colors underline"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-400" size={32} />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={28} className="text-red-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-900 mb-2">Your wishlist is empty</h2>
            <p className="text-brand-500 mb-6">Save items you love by clicking the heart icon on any product.</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-brand-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white shadow hover:bg-red-50 transition-colors"
                >
                  <X size={14} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
