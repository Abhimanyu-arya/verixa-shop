import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { Header, Footer } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import { About, Contact, FAQ } from './pages/StaticPages';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ErrorBoundary>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-grow">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                  </Routes>
                </ErrorBoundary>
              </div>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
