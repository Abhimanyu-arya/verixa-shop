import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Loader2, Heart, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Shop: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('cat') || 'All';
  const showLikedOnly = queryParams.get('liked') === 'true';

  const { wishlist } = useShop();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('Newest');
  const [allCategories, setAllCategories] = useState<string[]>(['All']);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Price range state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch products when category or sort changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await api.getProducts(category, sort);
        setAllProducts(fetchedProducts);

        if (allCategories.length === 1) {
          const allFetched = await api.getProducts('All', 'Newest');
          const cats = Array.from(new Set(allFetched.map(p => p.category)));
          setAllCategories(['All', ...cats]);

          if (allFetched.length > 0) {
            const prices = allFetched.map(p => p.price);
            const lo = Math.floor(Math.min(...prices));
            const hi = Math.ceil(Math.max(...prices));
            setMinPrice(lo);
            setMaxPrice(hi);
            setPriceMin(lo);
            setPriceMax(hi);
          }
        }
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, sort]);

  // Apply liked filter + price range client-side
  const displayedProducts = allProducts.filter(p => {
    if (showLikedOnly && !wishlist.includes(p.id)) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    return true;
  });

  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'];

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-brand-100">
          <div>
            {showLikedOnly ? (
              <>
                <h1 className="font-serif text-4xl text-brand-900 mb-2 flex items-center gap-3">
                  <Heart size={32} className="text-red-400 fill-red-400" /> Liked Items
                </h1>
                <p className="text-brand-500">Your saved favourites.</p>
              </>
            ) : (
              <>
                <h1 className="font-serif text-4xl text-brand-900 mb-2">Shop Collection</h1>
                <p className="text-brand-500">Discover our latest arrivals and timeless staples.</p>
              </>
            )}
          </div>

          {/* Click-based Sort Dropdown — only shown on the main shop view */}
          {!showLikedOnly && (
            <div className="flex items-center gap-4 mt-6 md:mt-0">
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(prev => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900 select-none"
                >
                  Sort by: <span className="text-brand-900">{sort}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-brand-100 shadow-xl rounded-md z-20">
                    {sortOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSort(opt); setIsSortOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          sort === opt
                            ? 'bg-brand-50 font-semibold text-brand-900'
                            : 'text-brand-600 hover:bg-brand-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters — hidden on liked view */}
          {!showLikedOnly && (
            <div className="hidden lg:block col-span-1 space-y-8 pr-8 border-r border-brand-100">
              <div>
                <h3 className="font-bold text-brand-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filters
                </h3>
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Category</p>
                  {allCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`block text-sm w-full text-left transition-colors ${
                        category === cat ? 'font-bold text-brand-900' : 'text-brand-500 hover:text-brand-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Working Price Range Slider */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-4">Price Range</p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-brand-700">
                    <span>₹{priceMin}</span>
                    <span>₹{priceMax}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-brand-400 mb-1 block">Min price</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={priceMin}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val <= priceMax) setPriceMin(val);
                        }}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-400 mb-1 block">Max price</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={priceMax}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val >= priceMin) setPriceMax(val);
                        }}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-900"
                      />
                    </div>
                  </div>
                  {(priceMin > minPrice || priceMax < maxPrice) && (
                    <button
                      onClick={() => { setPriceMin(minPrice); setPriceMax(maxPrice); }}
                      className="text-xs text-brand-400 hover:text-brand-700 underline"
                    >
                      Reset price filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className={`col-span-1 ${!showLikedOnly ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Mobile Filter Tabs */}
            {!showLikedOnly && (
              <div className="lg:hidden flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
                      category === cat
                        ? 'bg-brand-900 text-white border-brand-900'
                        : 'bg-white text-brand-600 border-brand-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-brand-900" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!loading && displayedProducts.length === 0 && (
              <div className="py-20 text-center">
                {showLikedOnly ? (
                  <>
                    <Heart size={48} className="mx-auto text-brand-200 mb-4" />
                    <p className="text-brand-500 text-lg">No liked items yet.</p>
                    <p className="text-brand-400 text-sm mt-2">
                      Heart products in the shop to save them here.
                    </p>
                  </>
                ) : (
                  <p className="text-brand-500 text-lg">No products found matching your filters.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;