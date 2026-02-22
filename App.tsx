import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { Header, Footer } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner } from './components/OfflineBanner';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import { About, Contact, FAQ } from './pages/StaticPages';

// Store layout — has header & footer
const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
    <Footer />
    <OfflineBanner />
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ErrorBoundary>
            {/* Scrolls to top on every route change */}
            <ScrollToTop />
            <Routes>
              {/* Admin — completely standalone, no header/footer */}
              <Route path="/admin" element={<Admin />} />

              {/* All store routes wrapped in StoreLayout */}
              <Route path="/*" element={
                <StoreLayout>
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
                </StoreLayout>
              } />
            </Routes>
          </ErrorBoundary>
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
