import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { PRODUCTS } from '../data';

const Wishlist: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-900">Wishlist</h1>
          <p className="text-brand-500 text-sm mt-1">{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Heart size={40} className="text-brand-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-brand-900 mb-2">Your wishlist is empty</h2>
            <p className="text-brand-500 text-sm mb-6">Browse our collection and save items you love.</p>
            <Link
              to="/shop"
              className="inline-block bg-brand-900 text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex">
                <Link to={`/product/${product.id}`} className="w-28 flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-brand-400 uppercase tracking-wide mb-1">{product.category}</p>
                      <Link to={`/product/${product.id}`} className="font-bold text-brand-900 text-sm hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-brand-700 font-bold mt-1">₹{product.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-brand-300 hover:text-red-500 transition-colors p-1"
                      title="Remove from wishlist"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 text-center text-xs font-bold uppercase tracking-wide bg-brand-900 text-white py-2 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingBag size={12} />
                      View & Add
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
