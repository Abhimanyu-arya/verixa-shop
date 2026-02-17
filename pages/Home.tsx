import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Feather, Leaf, MoreHorizontal, MessageSquare } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import { Testimonial } from '../types';

const Home: React.FC = () => {
  return (
    <main className="flex-col min-h-screen">
      {/* 1. HOOK / HERO SECTION */}
      {/* Based on the Verixa image: Clean, large typography, lifestyle image */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-brand-100">
        <div className="absolute inset-0 z-0">
          {/* Using a high quality placeholder that matches the aesthetic */}
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop" 
            alt="Model wearing premium t-shirt" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-50/90 via-brand-50/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-brand-900"></span>
              <span className="text-sm font-bold tracking-widest uppercase text-brand-900">2025 Trend Collection</span>
            </div>
            
            <h1 className="font-serif text-7xl md:text-9xl font-bold text-brand-900 leading-[0.9] mb-8 tracking-tighter">
              Wear <br/><span className="italic font-light">Your</span><br/> Identity
            </h1>
            
            <p className="text-brand-700 text-lg md:text-xl max-w-md mb-10 leading-relaxed">
              Vérixa Fashion redefines modern style with a perfect blend of elegance, comfort, and confidence.
            </p>

            <div className="flex items-center gap-8">
               <Link 
                to="/shop" 
                className="group relative inline-flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-full bg-white text-brand-900 shadow-xl hover:scale-110 transition-transform duration-300"
              >
                <ArrowUpRight size={32} strokeWidth={1} />
              </Link>
              
              <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/50">
                <div className="flex items-center -space-x-2 mb-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u1/100" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u2/100" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u3/100" alt="User" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-orange-400 flex items-center justify-center text-[10px] text-white font-bold">+2k</div>
                </div>
                <p className="text-xs font-bold text-brand-800 tracking-wide">250k+ INFLUENCED PEOPLE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION (The Promise) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-900 mb-6">Not Just a Shirt, A Statement.</h2>
          <p className="max-w-3xl mx-auto text-brand-600 text-lg leading-relaxed">
            We believe that what you wear is an extension of who you are. That's why we've stripped away the unnecessary to focus on the essential: unparalleled quality, ethical production, and timeless design.
          </p>
        </div>
      </section>

      {/* 3. DETAILED VALUE (The Breakdown) */}
      <section className="py-16 bg-brand-50 border-t border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="h-16 w-16 bg-brand-200 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                <Feather size={28} />
              </div>
              <h3 className="font-serif text-2xl text-brand-900 mb-3">Supreme Comfort</h3>
              <p className="text-brand-500 leading-relaxed">
                Hand-picked organic cotton blends that feel like a second skin. Breathable, soft, and built to last.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="h-16 w-16 bg-brand-200 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                <Leaf size={28} />
              </div>
              <h3 className="font-serif text-2xl text-brand-900 mb-3">Ethically Crafted</h3>
              <p className="text-brand-500 leading-relaxed">
                Sustainability isn't just a buzzword. We ensure fair wages and eco-friendly practices in every stitch.
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
              <div className="h-16 w-16 bg-brand-200 rounded-full flex items-center justify-center mb-6 text-brand-800 group-hover:bg-brand-900 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-serif text-2xl text-brand-900 mb-3">Durability Guarantee</h3>
              <p className="text-brand-500 leading-relaxed">
                Designed to withstand the test of time. No shrinking, no fading—just perfect fit wash after wash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROOF (Feedback Section styled like SalesSync dashboard) */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-brand-900 mb-4">Real Feedback from Real People</h2>
            <p className="text-brand-500">Join thousands of satisfied customers scaling their style.</p>
          </div>

          <div className="relative">
             {/* Abstract Dashboard UI Background imitation */}
            <div className="absolute inset-0 bg-white shadow-2xl rounded-3xl -rotate-1 scale-95 opacity-50 z-0"></div>
            
            {/* Main Feedback Container imitating the image */}
            <div className="relative z-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
               {/* Mock Header of Dashboard */}
               <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                     <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                        <MessageSquare size={20} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-800">Feedback <span className="text-gray-400 text-sm font-normal">2204 feedbacks</span></h3>
                  </div>
                  <div className="flex gap-2">
                  </div>
               </div>

               {/* Feedback List */}
               <div className="space-y-6">
                 {TESTIMONIALS.map((testimonial) => (
                   <div key={testimonial.id} className="group bg-white rounded-2xl p-6 hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-4">
                            <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                               <h4 className="font-bold text-gray-900 text-sm">{testimonial.author}</h4>
                               <p className="text-xs text-gray-400">{testimonial.timeAgo}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            {testimonial.tags.map(tag => (
                              <span key={tag} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">{tag}</span>
                            ))}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              testimonial.sentiment === 'Very Satisfied' ? 'bg-purple-100 text-purple-600' : 
                              testimonial.sentiment === 'Satisfied' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                            }`}>{testimonial.sentiment}</span>
                            <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                         </div>
                      </div>
                      
                      <div className="pl-16">
                        <h5 className="font-bold text-gray-800 mb-2 text-lg">Product Quality Meets Expectations</h5>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                           {testimonial.content}
                        </p>
                        
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 bg-brand-900 text-brand-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-700 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">Ready to Upgrade Your Wardrobe?</h2>
          <p className="text-brand-300 text-xl mb-10 max-w-2xl mx-auto">
            Experience the difference of premium quality. Free shipping on all orders over ₹100.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/shop" 
              className="px-10 py-4 bg-white text-brand-900 font-bold tracking-widest uppercase hover:bg-brand-100 transition-colors w-full sm:w-auto min-w-[200px]"
            >
              Shop Collection
            </Link>
            <Link 
              to="/about" 
              className="px-10 py-4 bg-transparent border border-brand-600 text-white font-bold tracking-widest uppercase hover:bg-brand-800 transition-colors w-full sm:w-auto min-w-[200px]"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;