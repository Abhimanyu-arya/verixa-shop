import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { ShoppingBag, Loader2, Package, ChevronRight, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dbError) throw new Error(dbError.message);
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
    else if (!authLoading) setLoading(false);
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-900">My Orders</h1>
            <p className="text-brand-500 mt-1">Track and manage your purchases</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-400" size={32} />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-brand-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-900 mb-2">No orders yet</h2>
            <p className="text-brand-500 mb-6">When you place an order, it will appear here.</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-brand-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-900 text-sm font-mono">{order.id}</p>
                      <p className="text-xs text-brand-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-brand-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-brand-500">Order Total</p>
                    <p className="text-lg font-bold text-brand-900">₹{order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-500">Customer</p>
                    <p className="text-sm font-medium text-brand-700">{order.customer_name}</p>
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

export default Orders;
