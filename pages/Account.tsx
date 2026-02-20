import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShoppingBag, Heart, Settings, Loader2, CheckCircle, ChevronRight } from 'lucide-react';

const Account: React.FC = () => {
  const { user, profile, updateProfile, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync form when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({ full_name: profile.full_name || '', phone: profile.phone || '' });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const { error } = await updateProfile(formData);
    setSaving(false);
    if (error) {
      setSaveError(error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-900">My Account</h1>
          <p className="text-brand-500 mt-1">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              <div className="px-3 py-4 text-center border-b border-brand-100 mb-2">
                <div className="w-16 h-16 rounded-full bg-brand-900 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-2">
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <p className="text-sm font-bold text-brand-900 truncate">{profile?.full_name || 'Member'}</p>
                <p className="text-xs text-brand-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'}`}
              >
                <User size={16} /> Overview
              </button>
              <Link to="/orders" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors">
                <ShoppingBag size={16} /> My Orders
              </Link>
              <Link to="/wishlist" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors">
                <Heart size={16} /> Wishlist
              </Link>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-brand-900 text-white' : 'text-brand-600 hover:bg-brand-50'}`}
              >
                <Settings size={16} /> Settings
              </button>
              <div className="border-t border-brand-100 mt-2 pt-2">
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/orders" className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs text-brand-500 uppercase font-bold tracking-wider mb-1">Total Orders</p>
                      <p className="text-3xl font-bold font-serif text-brand-900">—</p>
                    </div>
                    <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center">
                      <ShoppingBag size={20} className="text-brand-600" />
                    </div>
                  </Link>
                  <Link to="/wishlist" className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs text-brand-500 uppercase font-bold tracking-wider mb-1">Wishlist Items</p>
                      <p className="text-3xl font-bold font-serif text-brand-900">—</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      <Heart size={20} className="text-red-400" />
                    </div>
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-bold text-brand-900 mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <Link to="/orders" className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition-colors">
                      <span className="text-sm font-medium text-brand-700">View Order History</span>
                      <ChevronRight size={16} className="text-brand-400" />
                    </Link>
                    <Link to="/wishlist" className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition-colors">
                      <span className="text-sm font-medium text-brand-700">View Wishlist</span>
                      <ChevronRight size={16} className="text-brand-400" />
                    </Link>
                    <button onClick={() => setActiveTab('settings')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-brand-50 transition-colors">
                      <span className="text-sm font-medium text-brand-700">Edit Profile</span>
                      <ChevronRight size={16} className="text-brand-400" />
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-bold text-brand-900 mb-4">Account Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-500">Name</span>
                      <span className="font-medium text-brand-900">{profile?.full_name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-500">Email</span>
                      <span className="font-medium text-brand-900">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-500">Phone</span>
                      <span className="font-medium text-brand-900">{profile?.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-500">Member Since</span>
                      <span className="font-medium text-brand-900">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="font-bold text-xl text-brand-900 mb-6">Profile Settings</h2>

                {saveSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle size={16} /> Profile updated successfully!
                  </div>
                )}
                {saveError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {saveError}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full border border-brand-100 rounded-lg p-3 text-sm bg-brand-50 text-brand-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-brand-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-brand-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ full_name: profile?.full_name || '', phone: profile?.phone || '' })}
                      className="px-6 py-3 border border-brand-200 text-brand-700 rounded-lg font-bold text-sm hover:bg-brand-50 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
