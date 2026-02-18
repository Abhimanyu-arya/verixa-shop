import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, Settings, LogOut, Loader2, CheckCircle, Lock } from 'lucide-react';

const Account: React.FC = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-brand-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-900 mb-2">Sign in required</h2>
          <p className="text-brand-500 text-sm mb-6">Please sign in to access your account.</p>
          <Link
            to="/"
            className="block w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors"
          >
            Go Home & Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await updateProfile(formData);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-900">My Account</h1>
            <p className="text-brand-500 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-brand-500 hover:text-red-600 transition-colors border border-brand-200 px-4 py-2 rounded-lg hover:border-red-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === id
                    ? 'bg-brand-900 text-white'
                    : 'text-brand-600 hover:bg-white hover:text-brand-900'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
            <Link
              to="/orders"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left text-brand-600 hover:bg-white hover:text-brand-900"
            >
              <Package size={16} />
              Order History
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-lg font-bold text-brand-900 mb-6">Personal Information</h2>
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Full Name</label>
                    <input
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full border border-brand-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      value={user.email ?? ''}
                      disabled
                      className="w-full border border-brand-100 rounded-lg px-4 py-3 text-sm bg-brand-50 text-brand-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-brand-400 mt-1">Email cannot be changed here.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full border border-brand-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-brand-900 text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-black transition-colors disabled:opacity-60"
                    >
                      {saving && <Loader2 size={14} className="animate-spin" />}
                      Save Changes
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={14} /> Saved!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-lg font-bold text-brand-900 mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="border border-brand-100 rounded-xl p-5">
                    <h3 className="font-bold text-brand-900 text-sm mb-1">Email Notifications</h3>
                    <p className="text-brand-500 text-xs mb-4">Manage which emails you receive from us.</p>
                    <div className="space-y-3">
                      {['Order updates', 'Shipping notifications', 'Promotional offers', 'Newsletter'].map(item => (
                        <label key={item} className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm text-brand-700">{item}</span>
                          <div className="relative">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-10 h-5 bg-brand-200 rounded-full peer peer-checked:bg-brand-900 transition-colors"></div>
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-red-100 rounded-xl p-5">
                    <h3 className="font-bold text-red-700 text-sm mb-1">Danger Zone</h3>
                    <p className="text-brand-500 text-xs mb-4">These actions are irreversible.</p>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 text-sm text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut size={14} />
                      Sign out of all devices
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
