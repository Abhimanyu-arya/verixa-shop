import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, ChevronDown, Check, Loader2, User, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { mockBackend } from '../services/mockBackend';
import AuthModal from './AuthModal';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount, wishlist } = useShop();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const openLogin = () => { setAuthModalTab('login'); setAuthModalOpen(true); };
  const openSignup = () => { setAuthModalTab('signup'); setAuthModalOpen(true); };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop', hasDropdown: true },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* AuthModal rendered OUTSIDE the header so it's never clipped or obscured by it */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      <header className="sticky top-0 z-50 bg-white border-b border-brand-200 shadow-sm">
        {/* Top Banner */}
        <div className="bg-brand-900 text-white text-xs text-center py-2 tracking-widest uppercase font-medium">
          Free Shipping on Orders Over ₹100
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-3xl font-bold tracking-tighter text-brand-900">VÉRIXA</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.path}
                    className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                      isActive(link.path) ? 'text-brand-900' : 'text-brand-500 hover:text-brand-900'
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} />}
                  </Link>
                  {link.hasDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-brand-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                      <div className="py-2">
                        <Link to="/shop?cat=Basics" className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">Basics Collection</Link>
                        <Link to="/shop?cat=Premium" className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">Premium Linen</Link>
                        <Link to="/shop?cat=Graphic" className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50">Graphic Arts</Link>
                        <Link to="/shop" className="block px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 font-bold">View All</Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-5">
              <button className="text-brand-600 hover:text-brand-900 transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link to="/wishlist" className="text-brand-600 hover:text-brand-900 transition-colors relative hidden sm:block">
                <Heart size={20} strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-400 rounded-full"></span>
                )}
              </Link>
              <Link to="/cart" className="text-brand-600 hover:text-brand-900 transition-colors relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-900 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div ref={userMenuRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-brand-600 hover:text-brand-900 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold">
                      {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-brand-100 shadow-xl rounded-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-brand-100 mb-1">
                        <p className="text-xs font-bold text-brand-900 truncate">{profile?.full_name || 'My Account'}</p>
                        <p className="text-xs text-brand-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50">
                        <User size={14} /> Profile Settings
                      </Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50">
                        <ShoppingBag size={14} /> My Orders
                      </Link>
                      <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={openLogin}
                    className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors px-1"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignup}
                    className="text-sm font-bold bg-brand-900 text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <button
                className="md:hidden text-brand-600 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-brand-200 absolute w-full left-0 z-40 shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-3 text-base font-medium text-brand-700 hover:text-brand-900 hover:bg-brand-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-brand-100 pt-3 mt-2 space-y-1">
                {user ? (
                  <>
                    <Link to="/account" className="block px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
                      My Account
                    </Link>
                    <Link to="/orders" className="block px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-100 rounded-md" onClick={() => setIsMenuOpen(false)}>
                      My Orders
                    </Link>
                    <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { openLogin(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-3 text-base font-medium text-brand-700 hover:bg-brand-100 rounded-md">
                      Sign In
                    </button>
                    <button onClick={() => { openSignup(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-3 text-base font-bold text-brand-900 hover:bg-brand-100 rounded-md">
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await mockBackend.subscribeNewsletter(email);
    setStatus('success');
    setEmail('');
  };

  return (
    <footer className="bg-brand-900 text-brand-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="font-serif text-2xl font-bold tracking-tighter text-white">VÉRIXA</span>
            <p className="mt-4 text-sm text-brand-400 leading-relaxed">
              Redefining the standard of everyday wear with premium materials, artisan craftsmanship, and a commitment to sustainability.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Shop</h3>
            <ul className="space-y-3 text-sm text-brand-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Basics</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Support</h3>
            <ul className="space-y-3 text-sm text-brand-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Care Guide</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white">Stay Connected</h3>
            <p className="text-sm text-brand-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status !== 'idle'}
                className="flex-1 bg-brand-800 border-none rounded-l-md px-4 py-2 text-sm focus:ring-1 focus:ring-brand-500 outline-none text-white placeholder-brand-500 disabled:opacity-50"
              />
              <button disabled={status !== 'idle'} className="bg-brand-100 text-brand-900 px-4 py-2 rounded-r-md text-sm font-bold hover:bg-white transition-colors min-w-[60px] flex items-center justify-center">
                {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : status === 'success' ? <Check size={16} /> : 'Join'}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-brand-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-500">
          <p>&copy; {new Date().getFullYear()} Vérixa. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-300">Privacy Policy</a>
            <a href="#" className="hover:text-brand-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
