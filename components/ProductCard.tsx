import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isWishlisted } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-100 relative">
        {product.isNew && (
          <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur text-brand-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart size={16} className={wishlisted ? "fill-red-400 text-red-400" : "text-gray-600"} />
        </button>
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link to={`/product/${product.id}`} className="block w-full bg-brand-900 text-white text-center py-3 text-sm font-bold uppercase tracking-wide hover:bg-black">
            View Details
          </Link>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-brand-900">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-brand-500">{product.category}</p>
        </div>
        <p className="text-sm font-medium text-brand-900">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;