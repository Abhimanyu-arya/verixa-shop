import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Package, ShoppingBag, Lock, Loader2, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const result = await api.getOrdersByEmail(user.email);
        setOrders(result || []);
      } catch (e) {
        console.error('Failed to load orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-brand-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-2">Sign in to see your orders</h2>
          <p className="text-brand-500 text-sm mb-6">
            Create an account or sign in to view your order history.
          </p>
          <Link
            to="/"
            className="block w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-900" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-900">Order History</h1>
            <p className="text-brand-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </div>
          <Link
            to="/account"
            className="text-sm text-brand-600 hover:text-brand-900 border border-brand-200 px-4 py-2 rounded-lg hover:border-brand-400 transition-colors"
          >
            My Account
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag size={40} className="text-brand-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-brand-900 mb-2">No orders yet</h2>
            <p className="text-brand-500 text-sm mb-6">When you make a purchase, your orders will appear here.</p>
            <Link
              to="/shop"
              className="inline-block bg-brand-900 text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-brand-50 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-brand-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-900 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-brand-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-brand-900">₹{Number(order.total_amount).toFixed(2)}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-brand-100 text-brand-700'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-brand-400 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-brand-100 px-6 py-5">
                    <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wide mb-3">Items Ordered</h4>
                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-brand-700">
                            {item.name} <span className="text-brand-400">× {item.quantity}</span>
                          </span>
                          <span className="font-medium text-brand-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-brand-100 flex justify-between font-bold">
                      <span className="text-brand-900">Total</span>
                      <span className="text-brand-900">₹{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
