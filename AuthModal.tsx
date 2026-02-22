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

const EMPTY_LOGIN = { email: '', password: '' };
const EMPTY_SIGNUP = { fullName: '', email: '', password: '', confirmPassword: '' };

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login', redirectTo = '/account' }) => {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Each form has its own completely independent state — they never share data
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [signupForm, setSignupForm] = useState(EMPTY_SIGNUP);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Reset everything when the modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccess(null);
      setShowPassword(false);
      // Always start both forms completely empty
      setLoginForm(EMPTY_LOGIN);
      setSignupForm(EMPTY_SIGNUP);
    }
  }, [isOpen, initialTab]);

  // Also reset errors/success when switching tabs manually
  const switchTab = (newTab: 'login' | 'signup') => {
    setTab(newTab);
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    // Clear both forms on every tab switch so no data bleeds across
    setLoginForm(EMPTY_LOGIN);
    setSignupForm(EMPTY_SIGNUP);
  };

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
      // Clear signup form, switch to login tab with empty fields — no data carries over
      setSignupForm(EMPTY_SIGNUP);
      setLoginForm(EMPTY_LOGIN);
      setSuccess('Account created! Please check your email to verify, then sign in.');
      setTab('login');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 pb-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal — sits below the header, fully visible */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 my-auto">
        {/* Header strip */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-100">
          <div>
            <span className="font-serif text-2xl font-bold tracking-tighter text-brand-900">VÉRIXA</span>
            <p className="text-xs text-brand-500 mt-0.5">
              {tab === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-brand-400 hover:text-brand-900 hover:bg-brand-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="flex rounded-lg bg-brand-50 p-1 mb-5">
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'login' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500 hover:text-brand-700'}`}
              onClick={() => switchTab('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'signup' ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500 hover:text-brand-700'}`}
              onClick={() => switchTab('signup')}
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
                className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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
                className="w-full bg-brand-900 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-brand-400 mt-5">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-brand-700">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-brand-700">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
