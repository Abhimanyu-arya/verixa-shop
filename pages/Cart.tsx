import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-4">
        <h2 className="font-serif text-3xl mb-4">Your Cart is Empty</h2>
        <p className="text-brand-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="bg-brand-900 text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-black transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl mb-10 text-brand-900">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 space-y-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-6 py-6 border-b border-brand-100 last:border-0 last:pb-0">
                    <div className="w-24 h-32 flex-shrink-0 bg-brand-100 rounded-md overflow-hidden">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-lg text-brand-900 font-bold hover:underline">
                            <Link to={`/product/${item.id}`}>{item.name}</Link>
                          </h3>
                          <p className="text-sm text-brand-500 mt-1">{item.category}</p>
                          <div className="mt-2 text-sm text-brand-600 flex gap-4">
                            <span>Size: <span className="font-bold">{item.selectedSize}</span></span>
                            <span>Color: <span className="font-bold">{item.selectedColor}</span></span>
                          </div>
                        </div>
                        <p className="font-medium text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-brand-200 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                            className="p-2 hover:bg-brand-50 text-brand-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                            className="p-2 hover:bg-brand-50 text-brand-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-8 sticky top-24">
              <h2 className="font-serif text-2xl mb-6 text-brand-900">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm text-brand-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span>{cartTotal > 100 ? 'Free' : '$10.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Estimate</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-brand-100 pt-4 mb-8">
                <div className="flex justify-between font-bold text-lg text-brand-900">
                  <span>Total</span>
                  <span>${(cartTotal + (cartTotal > 100 ? 0 : 10) + (cartTotal * 0.08)).toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" className="w-full block text-center bg-brand-900 text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 group">
                Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
              
              <div className="mt-6 text-xs text-center text-brand-400">
                Secure Checkout • 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;