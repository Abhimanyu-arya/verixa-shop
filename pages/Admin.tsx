import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  LayoutDashboard, ShoppingBag, Package, Users, LogOut,
  Loader2, TrendingUp, Eye, RefreshCw, CheckCircle, XCircle, AlertTriangle, Lock
} from 'lucide-react';

// ── Admin credentials (simple local auth for demo) ─────────────────
const ADMIN_EMAIL = 'admin@verixa.com';
const ADMIN_PASSWORD = 'verixa-admin-2024';

type AdminTab = 'dashboard' | 'orders' | 'products' | 'customers';

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  is_new: boolean;
}

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0 });
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate
    if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid admin credentials.');
    }
    setLoginLoading(false);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
  };

  const fetchData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('products').select('*').order('id'),
      ]);

      if (ordersRes.error) throw new Error(ordersRes.error.message);
      if (productsRes.error) throw new Error(productsRes.error.message);

      const ordersData = ordersRes.data || [];
      const productsData = productsRes.data || [];
      const totalRevenue = ordersData.reduce((sum: number, o: Order) => sum + (o.total_amount || 0), 0);

      // Count unique customers
      const uniqueEmails = new Set(ordersData.map((o: Order) => o.customer_email));

      setOrders(ordersData);
      setProducts(productsData);
      setStats({
        totalOrders: ordersData.length,
        totalRevenue,
        totalProducts: productsData.length,
        totalCustomers: uniqueEmails.size,
      });
    } catch (err: any) {
      setDataError(err.message || 'Failed to load data.');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // ── Login Screen ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-white" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tighter text-brand-900">VÉRIXA</span>
            <p className="text-brand-500 text-sm mt-1">Admin Dashboard</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <XCircle size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Email</label>
              <input
                required type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none"
                placeholder="admin@verixa.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Password</label>
              <input
                required type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loginLoading}
              className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loginLoading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In to Admin'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-brand-50 rounded-lg">
            <p className="text-xs text-brand-500 font-mono text-center">Demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Layout ──────────────────────────────────────────────
  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { tab: 'orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
    { tab: 'products', label: 'Products', icon: <Package size={16} /> },
    { tab: 'customers', label: 'Customers', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-900 text-white flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="p-6 border-b border-brand-800">
          <span className="font-serif text-xl font-bold tracking-tighter">VÉRIXA</span>
          <p className="text-xs text-brand-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-white text-brand-900' : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`}
            >
              {icon} {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-800 space-y-2">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-400 hover:text-white transition-colors rounded-lg hover:bg-brand-800">
            <Eye size={14} /> View Store
          </a>
          <button onClick={handleAdminLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-800/40 transition-colors rounded-lg">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-56 flex-1 p-8 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          <button
            onClick={fetchData}
            disabled={dataLoading}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={dataLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {dataError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} /> {dataError}
            <button onClick={fetchData} className="ml-auto underline">Retry</button>
          </div>
        )}

        {dataLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-400" size={32} />
          </div>
        )}

        {!dataLoading && activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={20} />, color: 'bg-blue-100 text-blue-700' },
                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(0)}`, icon: <TrendingUp size={20} />, color: 'bg-green-100 text-green-700' },
                { label: 'Products', value: stats.totalProducts, icon: <Package size={20} />, color: 'bg-purple-100 text-purple-700' },
                { label: 'Customers', value: stats.totalCustomers, icon: <Users size={20} />, color: 'bg-orange-100 text-orange-700' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
              {orders.slice(0, 5).length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-bold font-mono text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.customer_name} · {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">₹{order.total_amount?.toFixed(2)}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {orders.length > 5 && (
                <button onClick={() => setActiveTab('orders')} className="mt-4 text-sm text-brand-600 hover:text-brand-900 font-medium">
                  View all {orders.length} orders →
                </button>
              )}
            </div>
          </div>
        )}

        {!dataLoading && activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No orders found.</td>
                  </tr>
                ) : orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900 text-xs">{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{order.total_amount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-brand-900 outline-none"
                      >
                        {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!dataLoading && activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{products.length} products in catalog</p>
              <p className="text-xs text-gray-400 italic">Product editing via Supabase dashboard</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">New Arrival</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No products found.</td></tr>
                ) : products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-400 text-xs font-mono">{product.id}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-3 text-gray-500">{product.category}</td>
                    <td className="px-6 py-3 font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      {product.is_new ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!dataLoading && activeTab === 'customers' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">{stats.totalCustomers} unique customers (by order email)</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Orders</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Total Spent</th>
                  <th className="text-left px-6 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(() => {
                  const customerMap: Record<string, { name: string; email: string; orders: number; total: number; lastOrder: string }> = {};
                  orders.forEach(o => {
                    if (!customerMap[o.customer_email]) {
                      customerMap[o.customer_email] = { name: o.customer_name, email: o.customer_email, orders: 0, total: 0, lastOrder: o.created_at };
                    }
                    customerMap[o.customer_email].orders++;
                    customerMap[o.customer_email].total += o.total_amount || 0;
                    if (o.created_at > customerMap[o.customer_email].lastOrder) {
                      customerMap[o.customer_email].lastOrder = o.created_at;
                    }
                  });
                  const customers = Object.values(customerMap).sort((a, b) => b.total - a.total);
                  if (customers.length === 0) return (
                    <tr><td colSpan={4} className="text-center py-10 text-gray-400">No customers yet.</td></tr>
                  );
                  return customers.map(c => (
                    <tr key={c.email} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="px-6 py-3 text-gray-700">{c.orders}</td>
                      <td className="px-6 py-3 font-bold text-gray-900">₹{c.total.toFixed(2)}</td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{new Date(c.lastOrder).toLocaleDateString()}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
