import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShieldCheck, CreditCard, Loader2, CheckCircle, ShoppingBag } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartTotal, cart, clearCart } = useShop();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{ id: string } | null>(null);
  const [formData, setFormData] = useState({
     firstName: '',
     lastName: '',
     email: user?.email ?? '',
     address: '',
     city: '',
     zip: '',
     cardNumber: '',
     cardExpiry: '',
     cardCvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
       ...formData,
       [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsProcessing(true);
     
     // Simulate Payment Processing then Save to DB
     try {
       // Artificial delay for payment gateway simulation
       await new Promise(resolve => setTimeout(resolve, 1500));
       
       const result = await api.createOrder({
         customerName: `${formData.firstName} ${formData.lastName}`,
         customerEmail: formData.email,
         totalAmount: (cartTotal * 1.08 + (cartTotal > 100 ? 0 : 10)),
         items: cart
       });

       if (result.success) {
          clearCart();
          setOrderComplete({ id: result.orderId });
       }
     } catch (error) {
        alert("Payment or Database transaction failed. Please try again.");
        console.error(error);
     } finally {
        setIsProcessing(false);
     }
  };

  const totalAmount = (cartTotal * 1.08 + (cartTotal > 100 ? 0 : 10)).toFixed(2);

  if (orderComplete) {
     return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center py-12 px-4">
           <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                 <CheckCircle size={40} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-brand-900 mb-2">Order Confirmed!</h1>
              <p className="text-brand-500 mb-8">Thank you for your purchase. Your order has been saved to the database.</p>
              
              <div className="bg-brand-50 rounded-lg p-4 mb-8 text-left">
                 <p className="text-xs text-brand-400 uppercase font-bold tracking-wider mb-1">Order ID</p>
                 <p className="text-brand-900 font-mono">{orderComplete.id}</p>
              </div>

              <Link to="/shop" className="block w-full bg-brand-900 text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-black transition-colors">
                 Continue Shopping
              </Link>
           </div>
        </div>
     );
  }

  if (cart.length === 0) {
      return (
         <div className="min-h-screen flex flex-col items-center justify-center bg-brand-50 p-4">
             <div className="bg-white p-8 rounded-xl shadow-sm text-center">
               <ShoppingBag size={48} className="mx-auto text-brand-300 mb-4" />
               <h2 className="font-serif text-2xl mb-2 text-brand-900">Cart is Empty</h2>
               <p className="text-brand-500 mb-6">Add some items before checking out.</p>
               <Link to="/shop" className="inline-block px-6 py-2 bg-brand-900 text-white rounded-md hover:bg-black transition-colors">
                  Go to Shop
               </Link>
             </div>
         </div>
      )
  }

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
         <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-brand-900">Checkout</h1>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm font-bold uppercase tracking-widest">
               <span className="text-brand-900">1. Shipping</span>
               <span className="text-brand-300">-</span>
               <span className="text-brand-900">2. Payment</span>
               <span className="text-brand-300">-</span>
               <span className="text-brand-900">3. Review</span>
            </div>
         </div>

         <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
               
               {/* Shipping Form */}
               <div className="bg-white p-8 rounded-xl shadow-sm">
                  <h2 className="text-xl font-bold mb-6 text-brand-900 flex items-center gap-2">
                     Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-1">
                        <label className="block text-xs font-bold text-brand-500 mb-1">First Name</label>
                        <input required name="firstName" onChange={handleInputChange} type="text" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                     <div className="col-span-1">
                        <label className="block text-xs font-bold text-brand-500 mb-1">Last Name</label>
                        <input required name="lastName" onChange={handleInputChange} type="text" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-brand-500 mb-1">Email Address</label>
                        <input required name="email" onChange={handleInputChange} type="email" value={formData.email} placeholder="you@example.com" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-brand-500 mb-1">Address</label>
                        <input required name="address" onChange={handleInputChange} type="text" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                     <div className="col-span-1">
                        <label className="block text-xs font-bold text-brand-500 mb-1">City</label>
                        <input required name="city" onChange={handleInputChange} type="text" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                     <div className="col-span-1">
                        <label className="block text-xs font-bold text-brand-500 mb-1">Zip Code</label>
                        <input required name="zip" onChange={handleInputChange} type="text" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none" />
                     </div>
                  </div>
               </div>

               {/* Payment Placeholder */}
               <div className="bg-white p-8 rounded-xl shadow-sm opacity-100">
                  <h2 className="text-xl font-bold mb-6 text-brand-900 flex items-center gap-2">
                     <CreditCard size={20}/> Payment Method
                  </h2>
                  <div className="p-4 border border-brand-200 rounded-lg bg-brand-50 mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-brand-900 border border-brand-900"></div>
                        <span className="font-bold text-brand-900">Credit Card</span>
                     </div>
                     <div className="mt-4 pl-7 space-y-3">
                        <input required name="cardNumber" onChange={handleInputChange} type="text" placeholder="Card Number" className="w-full border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none bg-white" />
                        <div className="flex gap-4">
                           <input required name="cardExpiry" onChange={handleInputChange} type="text" placeholder="MM/YY" className="w-1/2 border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none bg-white" />
                           <input required name="cardCvc" onChange={handleInputChange} type="text" placeholder="CVC" className="w-1/2 border border-brand-200 rounded p-2 focus:ring-1 focus:ring-brand-900 outline-none bg-white" />
                        </div>
                     </div>
                  </div>
               </div>

               <button 
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-brand-900 text-white py-4 rounded-md font-bold text-lg hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isProcessing ? (
                     <>
                        <Loader2 className="animate-spin" /> Processing...
                     </>
                  ) : (
                     `Pay $${totalAmount}`
                  )}
               </button>

            </div>

            {/* Sidebar Summary */}
            <div className="md:col-span-1">
               <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                  <h3 className="font-bold text-brand-900 mb-4">Order Review</h3>
                  <div className="space-y-2 text-sm text-brand-600 border-b border-brand-100 pb-4 mb-4">
                     <div className="flex justify-between">
                        <span>Items Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{cartTotal > 100 ? 'Free' : '₹10.00'}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{(cartTotal * 0.08).toFixed(2)}</span>
                     </div>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-brand-900">
                     <span>Total</span>
                     <span>${totalAmount}</span>
                  </div>
                  
                  <div className="mt-6 flex items-start gap-2 text-xs text-brand-400">
                     <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
                     <p>Your payment information is encrypted and secure.</p>
                  </div>
               </div>
            </div>
         </form>
      </div>
    </div>
  );
};

export default Checkout;