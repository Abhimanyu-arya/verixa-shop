import React, { useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Loader2, Check } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-900 text-brand-50 py-20 text-center">
         <h1 className="font-serif text-5xl mb-4">Our Story</h1>
         <p className="max-w-2xl mx-auto text-brand-200">Crafting confidence through premium simplicity.</p>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12 text-brand-700 leading-relaxed text-lg">
        <p>
          Founded in 2023, Vérixa began with a simple question: Why is it so hard to find the perfect t-shirt? One that doesn't shrink, doesn't fade, and fits just right.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
           <img src="https://picsum.photos/seed/about1/600/400" className="rounded-lg shadow-lg" alt="Workshop" />
           <img src="https://picsum.photos/seed/about2/600/400" className="rounded-lg shadow-lg" alt="Fabric" />
        </div>
        <p>
          We partnered with artisanal textile mills in Portugal and Japan to source the finest long-staple cottons. Every thread is inspected, every seam is reinforced. We aren't just selling shirts; we're selling the foundation of your daily wardrobe.
        </p>
        <p>
          We believe in slow fashion. We don't chase micro-trends. We create timeless pieces that age gracefully with you, developing character with every wash and wear.
        </p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-50 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-4xl text-center mb-12 text-brand-900">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {[
            { q: "How do I find my size?", a: "We recommend checking our detailed size guide on each product page. Our cuts are generally true to size, but tailored. If you prefer a loose fit, size up." },
            { q: "What is your return policy?", a: "We offer free returns within 30 days of purchase for all unworn items with original tags attached." },
            { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs are calculated at checkout." },
            { q: "How do I care for my Vérixa products?", a: "Machine wash cold with like colors. Tumble dry low or hang dry for best results. Do not bleach." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-brand-900 mb-3">{item.q}</h3>
              <p className="text-brand-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mockBackend.submitContactForm({ /* form data */ });
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h1 className="font-serif text-4xl mb-6 text-brand-900">Get in Touch</h1>
          <p className="text-brand-600 mb-8">
            Have a question about an order, wholesale inquiries, or just want to say hello? We'd love to hear from you.
          </p>
          <div className="space-y-4 text-brand-800 font-medium">
            <p>Email: support@verixa.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Fashion Ave, Design District, NY 10012</p>
          </div>
        </div>
        
        <div className="bg-brand-50 p-8 rounded-xl">
           {success ? (
             <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-900">Message Sent!</h3>
                <p className="text-brand-500 mt-2">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-brand-900 underline text-sm">Send another message</button>
             </div>
           ) : (
             <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-md border border-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="Your Name" />
              </div>
              <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-md border border-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-900" placeholder="your@email.com" />
              </div>
              <div>
                  <label className="block text-sm font-bold text-brand-900 mb-2">Message</label>
                  <textarea required className="w-full px-4 py-3 rounded-md border border-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-900 h-32" placeholder="How can we help?"></textarea>
              </div>
              <button disabled={loading} className="w-full bg-brand-900 text-white py-3 rounded-md font-bold uppercase tracking-wide hover:bg-black transition-colors flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send Message'}
              </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};