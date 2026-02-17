import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';

const Shop: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('cat') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('Newest');
  const [allCategories, setAllCategories] = useState<string[]>(['All']);

  // Fetch products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await api.getProducts(category, sort);
        setProducts(fetchedProducts);
        
        // Extract unique categories for the filter list if looking at All, 
        // otherwise we keep the list consistent or fetch distinct categories separately.
        // For simplicity, we'll just hardcode the known ones or fetch all once.
        if (category === 'All' && allCategories.length === 1) {
             const cats = Array.from(new Set(fetchedProducts.map(p => p.category)));
             setAllCategories(['All', ...cats]);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [category, sort]);


  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-brand-100">
          <div>
            <h1 className="font-serif text-4xl text-brand-900 mb-2">Shop Collection</h1>
            <p className="text-brand-500">Discover our latest arrivals and timeless staples.</p>
          </div>
          
          <div className="flex items-center gap-4 mt-6 md:mt-0">
             {/* Simple Sort Dropdown */}
            <div className="relative group">
               <button className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900">
                 Sort by: <span className="text-brand-900">{sort}</span>
               </button>
               <div className="absolute right-0 mt-2 w-40 bg-white border border-brand-100 shadow-xl rounded-md z-20 hidden group-hover:block">
                  {['Newest', 'Price: Low to High', 'Price: High to Low'].map(opt => (
                     <button 
                        key={opt}
                        onClick={() => setSort(opt)}
                        className="block w-full text-left px-4 py-2 text-sm text-brand-600 hover:bg-brand-50"
                     >
                        {opt}
                     </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
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
                        className={`block text-sm w-full text-left transition-colors ${category === cat ? 'font-bold text-brand-900' : 'text-brand-500 hover:text-brand-800'}`}
                      >
                         {cat}
                      </button>
                   ))}
                </div>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">Price Range</p>
                <div className="flex items-center gap-2 text-sm text-brand-600">
                   <span>₹0</span>
                   <div className="h-1 flex-1 bg-brand-200 rounded-full"></div>
                   <span>₹200</span>
                </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="col-span-1 lg:col-span-3">
             {/* Mobile Filter Tabs */}
             <div className="lg:hidden flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {allCategories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setCategory(cat)}
                     className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${category === cat ? 'bg-brand-900 text-white border-brand-900' : 'bg-white text-brand-600 border-brand-200'}`}
                   >
                      {cat}
                   </button>
                ))}
             </div>

             {loading ? (
               <div className="flex justify-center items-center h-64">
                 <Loader2 className="animate-spin text-brand-900" size={32} />
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                 {products.map(product => (
                   <ProductCard key={product.id} product={product} />
                 ))}
               </div>
             )}
             
             {!loading && products.length === 0 && (
                <div className="py-20 text-center">
                   <p className="text-brand-500 text-lg">No products found in this category.</p>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;