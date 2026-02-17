import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { Star, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        const p = await api.getProductById(id);
        setProduct(p);
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-900" size={32} />
      </div>
    );
  }

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden w-full">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${activeImage === idx ? 'border-brand-900' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-brand-500 text-sm font-medium tracking-wide uppercase">{product.category}</div>
            <h1 className="font-serif text-4xl text-brand-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-orange-400">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                 ))}
              </div>
              <span className="text-sm text-brand-500 underline">{product.reviewCount} Reviews</span>
            </div>

            <p className="text-2xl font-medium text-brand-900 mb-8">₹{product.price.toFixed(2)}</p>
            
            <p className="text-brand-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-bold text-brand-900 mb-3">Color: <span className="font-normal text-brand-500">{selectedColor || 'Select a color'}</span></h3>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 px-4 rounded-md border text-sm transition-all ${selectedColor === color ? 'border-brand-900 bg-brand-50 text-brand-900 font-bold' : 'border-brand-200 text-brand-600 hover:border-brand-400'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-bold text-brand-900 mb-3">Size: <span className="font-normal text-brand-500">{selectedSize || 'Select a size'}</span></h3>
                <div className="flex gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center rounded-full border text-sm transition-all ${selectedSize === size ? 'bg-brand-900 text-white border-brand-900' : 'border-brand-200 text-brand-600 hover:border-brand-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 bg-brand-900 text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button className="p-4 border border-brand-200 rounded-md hover:bg-brand-50">
                <Star className="text-brand-400" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-8 border-t border-brand-100">
               <div className="flex items-center gap-4">
                  <Truck className="text-brand-500" size={20}/>
                  <div className="text-sm text-brand-600">Free shipping on all orders over ₹100</div>
               </div>
               <div className="flex items-center gap-4">
                  <Shield className="text-brand-500" size={20}/>
                  <div className="text-sm text-brand-600">2-Year durability guarantee</div>
               </div>
               <div className="flex items-center gap-4">
                  <RotateCcw className="text-brand-500" size={20}/>
                  <div className="text-sm text-brand-600">30-day easy returns</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;