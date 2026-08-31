import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Star, ShieldCheck, Sparkles, Car, UserCheck, IndianRupee } from 'lucide-react';

const FEATURED_DESTINATIONS = [
  {
    id: 'maharashtra',
    title: 'Sahyadri & Western Ghats Circuit',
    state: 'Maharashtra',
    routes: 'Mumbai → Lonavala → Mahabaleshwar → Raigad',
    image: '/images/sahyadri-hills.jpg',
    rating: '4.96',
    reviews: '3,420 trips',
    tag: 'Scenic Ghats & Forts',
    price: '₹12/km',
    pricingNote: 'Zero middleman commission',
    quote: 'Hired an Ertiga with driver for our Mahabaleshwar family trip. 100% transparent rates and driver Ramesh was exceptionally polite and skilled.',
    author: 'Siddharth Joshi, Pune'
  },
  {
    id: 'goa',
    title: 'Malvan Coastline & Old Goa Heritage',
    state: 'Goa',
    routes: 'Panaji → Dudhsagar → Old Goa → Palolem',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    rating: '4.98',
    reviews: '4,890 trips',
    tag: 'Coastal Drive & Heritage',
    price: '₹1,800/day',
    pricingNote: 'Chauffeur only or Car+Driver',
    quote: 'Direct booking saved us at least ₹3,000 compared to travel agencies. Driver verified credentials gave us complete peace of mind.',
    author: 'Ananya & Rohit, Bengaluru'
  },
  {
    id: 'gujarat',
    title: 'Rann of Kutch & Saurashtra Heritage',
    state: 'Gujarat',
    routes: 'Ahmedabad → Bhuj → White Desert → Somnath',
    image: '/images/statue-of-unity.jpg',
    rating: '4.94',
    reviews: '2,750 trips',
    tag: 'Desert & Temple Trail',
    price: '₹14/km',
    pricingNote: 'Innova / SUVs with AC',
    quote: 'Touralink is a gamechanger for intercity trips. Direct driver connect with fixed per-km charges and zero hidden tolls.',
    author: 'Mehul Patel, Surat'
  },
  {
    id: 'karnataka',
    title: 'Hampi Heritage & Coorg Coffee Hills',
    state: 'Karnataka',
    routes: 'Bengaluru → Mysuru → Coorg → Hampi Ruins',
    image: '/images/hampi.jpg',
    rating: '4.95',
    reviews: '3,110 trips',
    tag: 'UNESCO Heritage & Hills',
    price: '₹13/km',
    pricingNote: 'Experienced Hill Drivers',
    quote: 'Booked a driver for our own car for the tricky Coorg ghat roads. Safe driving and great local food recommendations!',
    author: 'Kavita Menon, Bengaluru'
  }
];

export default function ShowcasePanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_DESTINATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = FEATURED_DESTINATIONS[currentIndex];

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 h-full min-h-[660px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
      {/* Background Image Carousel with smooth crossfade */}
      {FEATURED_DESTINATIONS.map((dest, index) => (
        <div
          key={dest.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          style={{ transitionProperty: 'opacity, transform', transitionDuration: '1.2s' }}
        >
          <img
            src={dest.image}
            alt={dest.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle Contrast Gradients for Light Theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-slate-900/10" />
        </div>
      ))}

      {/* Top Header: Trust Badges */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-md">
          <Car className="w-3.5 h-3.5 text-adventure-600" />
          <span>Maharashtra • Goa • Gujarat • Karnataka</span>
        </div>

        {/* Live Verified Drivers Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-semibold text-slate-800 shadow-md">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span><strong className="text-slate-900">1,500+</strong> Verified Drivers</span>
        </div>
      </div>

      {/* Center Destination & Rental USP Feature Card */}
      <div className="relative z-10 space-y-4 my-auto pt-10">
        <div className="bg-white/95 p-6 rounded-2xl border border-white/80 backdrop-blur-xl shadow-2xl space-y-3 max-w-md animate-slide-up text-slate-900">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-adventure-50 text-adventure-700 border border-adventure-200">
              {current.tag}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{current.rating}</span>
              <span className="text-slate-500 font-normal">({current.reviews})</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-900 font-display tracking-tight leading-snug">
              {current.title}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="font-bold text-slate-900">{current.state}:</span>
              <span className="text-slate-600 truncate">{current.routes}</span>
            </div>
          </div>

          {/* Pricing & Direct Booking USP */}
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Starting at <strong className="text-brand-700 font-extrabold">{current.price}</strong></span>
            </div>
            <span className="text-[11px] text-adventure-700 font-bold bg-adventure-100/60 px-2 py-0.5 rounded">
              {current.pricingNote}
            </span>
          </div>

          <p className="text-xs text-slate-600 italic leading-relaxed pt-1 border-t border-slate-100">
            "{current.quote}"
          </p>
          <p className="text-[11px] text-brand-700 font-bold">
            — {current.author}
          </p>
        </div>
      </div>

      {/* Bottom Controls & Transparency Guarantees */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          {/* Destination Carousel Dots */}
          <div className="flex items-center gap-2">
            {FEATURED_DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                  ? 'w-8 bg-brand-500'
                  : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Core Guarantees */}
          <div className="flex items-center gap-4 text-xs font-semibold text-white">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Driver Booking</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-adventure-400 font-black">0%</span> Middlemen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
