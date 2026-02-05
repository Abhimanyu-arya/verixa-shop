import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { About, Contact, FAQ } from './pages/StaticPages';
import { initDB } from './services/db';
import { Loader2, AlertTriangle } from 'lucide-react';

// ScrollToTop component to handle scroll restoration on route change
const ScrollToTop = () => {
    const { pathname } = React.useMemo(() => new URL(window.location.href), []);
  
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
};


const App: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    initDB()
      .then(() => setDbStatus('ready'))
      .catch((err) => {
        console.error("App DB Init Error:", err);
        setDbStatus('error');
        setErrorMessage(err.message || "Unknown error occurred during database initialization.");
      });
  }, []);

  if (dbStatus === 'loading') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-50 text-brand-900 gap-4">
        <Loader2 className="animate-spin h-10 w-10" />
        <p className="font-serif text-lg animate-pulse">Initializing PostgreSQL Database...</p>
      </div>
    );
  }

  if (dbStatus === 'error') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-50 text-brand-900 gap-6 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h1 className="font-serif text-3xl font-bold">Database Error</h1>
        <p className="max-w-md text-brand-600">
          We couldn't start the local database engine. This might be due to a browser compatibility issue or network restrictions loading the WASM bundle.
        </p>
        <div className="bg-red-50 border border-red-100 rounded p-4 text-xs font-mono text-red-800 break-all max-w-lg">
          {errorMessage}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-brand-900 text-white rounded hover:bg-black transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
};

export default App;