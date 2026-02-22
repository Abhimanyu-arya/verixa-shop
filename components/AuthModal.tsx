import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  redirectTo?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login', redirectTo = '/account' }) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Sync tab when modal re-opens with a different initialTab
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      onClose();
      navigate(redirectTo);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess('Account created! Check your email to verify, then sign in below.');
      setTab('login');
      setLoginForm({ email: signupForm.email, password: '' });
      setSignupForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-400 hover:text-brand-900 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-tighter text-brand-900">VÉRIXA</span>
          <p className="text-sm text-brand-500 mt-1">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-brand-50 p-1 mb-6">
          <button
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'login' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500 hover:text-brand-700'}`}
            onClick={() => { setTab('login'); setError(null); setSuccess(null); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'signup' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500 hover:text-brand-700'}`}
            onClick={() => { setTab('signup'); setError(null); setSuccess(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-start gap-2">
            <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
            {success}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Email</label>
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Full Name</label>
              <input
                required
                type="text"
                value={signupForm.fullName}
                onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all"
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Email</label>
              <input
                required
                type="email"
                value={signupForm.email}
                onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all"
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all pr-10"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-500 mb-1 uppercase tracking-wider">Confirm Password</label>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={signupForm.confirmPassword}
                onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                className="w-full border border-brand-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-900 outline-none transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-brand-400 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-brand-700">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-brand-700">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
