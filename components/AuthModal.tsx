import React, { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result: { error: string | null };
    if (mode === 'login') {
      result = await signIn(formData.email, formData.password);
    } else {
      if (!formData.fullName.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      result = await signUp(formData.email, formData.password, formData.fullName);
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-400 hover:text-brand-900 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <span className="font-serif text-2xl font-bold tracking-tighter text-brand-900">VÉRIXA</span>
          <h2 className="mt-2 text-xl font-bold text-brand-900">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-brand-400 mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Join the Vérixa community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Full Name</label>
              <input
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full border border-brand-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full border border-brand-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-brand-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-brand-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className="font-bold text-brand-900 hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className="font-bold text-brand-900 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
