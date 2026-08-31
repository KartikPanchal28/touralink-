import React, { useState } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import { 
  Car, 
  Users, 
  Luggage, 
  Fuel, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  IndianRupee,
  Calendar,
  PhoneCall,
  LogOut,
  UserCheck
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

const FLEET_DATA = [
  {
    id: 'innova_crysta',
    name: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    categoryLabel: '7-Seater Premium MUV',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seating: '6 + 1 Chauffeur',
    luggage: '4 Large Bags',
    fuel: 'Diesel • Manual / Auto',
    ac: 'Dual Zone AC with Rear Vents',
    ratePerKm: '₹15 / KM',
    dailyRate: '₹3,200 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Mumbai ⇄ Goa • Pune ⇄ Mahabaleshwar',
    features: ['Captain Seats', 'Airbags & ABS', 'GPS Live Tracked', 'Roof Carrier Available'],
    rating: '4.96',
    trips: '2,840+ trips'
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga ZXi+',
    category: 'muv',
    categoryLabel: '7-Seater Family MUV',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    seating: '6 + 1 Chauffeur',
    luggage: '3 Bags',
    fuel: 'Petrol / CNG • AC',
    ac: 'Powerful Dual AC',
    ratePerKm: '₹12 / KM',
    dailyRate: '₹2,600 / Day',
    minKmPerDay: '250 KM / Day',
    popularRoutes: 'Ahmedabad ⇄ Surat ⇄ Somnath',
    features: ['High Fuel Economy', 'Spacious Legroom', 'Clean Sanitized', 'Music System'],
    rating: '4.92',
    trips: '4,150+ trips'
  },
  {
    id: 'dzire',
    name: 'Maruti Suzuki Dzire Tour S',
    category: 'sedan',
    categoryLabel: '4-Seater Compact Sedan',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    seating: '4 + 1 Chauffeur',
    luggage: '2 Large + 1 Small Bag',
    fuel: 'Petrol / CNG • AC',
    ac: 'Chilled AC',
    ratePerKm: '₹10.5 / KM',
    dailyRate: '₹2,100 / Day',
    minKmPerDay: '250 KM / Day',
    popularRoutes: 'Bengaluru ⇄ Mysuru • Pune ⇄ Lonavala',
    features: ['Boot Space for Luggage', 'Comfortable Rear Seat', 'Ideal for Couples & Small Families'],
    rating: '4.90',
    trips: '5,920+ trips'
  },
  {
    id: 'fortuner',
    name: 'Toyota Fortuner 4x4 Sigma-4',
    category: 'suv',
    categoryLabel: 'Premium Executive 4x4 SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    seating: '6 + 1 Chauffeur',
    luggage: '4 Large Bags',
    fuel: 'Diesel • Automatic 4x4',
    ac: 'Tri-Zone Climate Control',
    ratePerKm: '₹24 / KM',
    dailyRate: '₹5,500 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Western Ghats • Coorg Hills • VIP Tours',
    features: ['High Ground Clearance', 'Leather Upholstery', 'Ghats & Offroad Specialist Chauffeur'],
    rating: '4.98',
    trips: '1,210+ trips'
  },
  {
    id: 'scorpio_n',
    name: 'Mahindra Scorpio-N Z8L',
    category: 'suv',
    categoryLabel: 'Rugged 7-Seater SUV',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    seating: '6 + 1 Chauffeur',
    luggage: '3 Large Bags',
    fuel: 'Diesel 4x4 • Manual',
    ac: 'Dual AC Vents',
    ratePerKm: '₹16 / KM',
    dailyRate: '₹3,500 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Rann of Kutch • Sahyadri Fort Trails',
    features: ['Powerful Engine', 'Commanding Road Presence', 'Sony 3D Surround Audio'],
    rating: '4.94',
    trips: '1,890+ trips'
  },
  {
    id: 'urbania',
    name: 'Force Urbania Luxury Van (13-Seater)',
    category: 'van',
    categoryLabel: 'Luxury Group Traveler',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    seating: '12 + 1 Chauffeur',
    luggage: '10+ Bags Dedicated Boot',
    fuel: 'Diesel • High Roof AC',
    ac: 'Individual AC Blowers on all seats',
    ratePerKm: '₹26 / KM',
    dailyRate: '₹6,800 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Goa Wedding Trips • Hampi Heritage Tours • Family Groups',
    features: ['Reclining Push-Back Seats', 'Individual USB Charging', 'Air Suspension Comfort', 'LED Ambient Lights'],
    rating: '4.97',
    trips: '850+ trips'
  }
];

export default function FleetPage({ user, onLogout, onBackToHome, onNavigateToDrivers }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);

  const filteredFleet = selectedCategory === 'all'
    ? FLEET_DATA
    : FLEET_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="relative min-h-screen font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
      
      {/* 🎥 Background Video Fixed Over Entire Screen */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          src={BACKGROUND_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Soft Translucent Light Tint */}
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
      </div>

      {/* Foreground Interactive Page Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Apple Music Style Translucent Frosted Header */}
        <header className="sticky top-0 z-50 bg-white/35 backdrop-blur-2xl saturate-[190%] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 min-h-[88px] flex items-center justify-between">
            
            {/* Left: Logo & Region Badge */}
            <Logo size="md" />

            {/* Right: Back to Home + Switch to Drivers + User Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-900 shadow-xs hover:bg-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-brand-600" />
                <span>Back to Overview</span>
              </button>

              {onNavigateToDrivers && (
                <button
                  onClick={onNavigateToDrivers}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold shadow-md hover:bg-slate-850 transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-adventure-400" />
                  <span>View Drivers Only</span>
                </button>
              )}

              <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-xs hover:bg-white/70 transition-all">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-500 shadow-xs"
                />
                <div className="text-left hidden sm:block pr-1">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    Traveler
                  </div>
                  <div className="text-[10px] text-brand-600 font-bold">
                    India Beta
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* Main Fleet Directory Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
          
          {/* Header Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-10 space-y-5 transition-all">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-adventure-600" />
                <span>Verified Commercial Fleet Directory</span>
              </div>

              <button
                onClick={onBackToHome}
                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                Available Fleet & Commercial Cabs
              </h1>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Direct vehicles from verified owners across Maharashtra, Goa, Gujarat & Karnataka. 
                <strong className="text-slate-950 font-bold"> Fixed transparent per-km billing with 0% middleman markups.</strong>
              </p>
            </div>

            {/* Category Filter Pills (Footer style) */}
            <div className="pt-4 border-t border-white/30 flex flex-wrap items-center gap-2.5">
              {[
                { id: 'all', label: 'All Fleet Vehicles' },
                { id: 'muv', label: '7-Seater MUVs (Innova / Ertiga)' },
                { id: 'sedan', label: 'Comfort Sedans (Dzire / Etios)' },
                { id: 'suv', label: 'Executive 4x4 SUVs (Fortuner / Scorpio)' },
                { id: 'van', label: 'Luxury Group Vans (Urbania 13-Seater)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                    selectedCategory === tab.id
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-white/90 border border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </section>

          {/* Fleet Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredFleet.map((vehicle) => (
              <div
                key={vehicle.id}
                className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Vehicle Image Preview */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 text-xs font-extrabold text-slate-900 shadow-xs">
                    <Car className="w-3.5 h-3.5 text-brand-600" />
                    <span>{vehicle.categoryLabel}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vehicle.rating}</span>
                  </div>

                  {/* Vehicle Name Headline */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-lg font-black font-display drop-shadow-md">
                      {vehicle.name}
                    </div>
                  </div>
                </div>

                {/* Card Specs & Features */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  
                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <Users className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{vehicle.seating}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <Luggage className="w-4 h-4 text-adventure-600 shrink-0" />
                      <span>{vehicle.luggage}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2">
                      <Fuel className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{vehicle.ac}</span>
                    </div>
                  </div>

                  {/* Popular Route Tag */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-brand-50/70 p-2.5 rounded-xl border border-brand-100">
                    <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span className="truncate"><strong>Popular:</strong> {vehicle.popularRoutes}</span>
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Outstation Rate</span>
                      <span className="text-base font-black text-slate-900">{vehicle.ratePerKm}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Full Day Package</span>
                      <span className="font-bold text-slate-700">{vehicle.dailyRate}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => setSelectedVehicleForModal(vehicle)}
                    className="w-full py-3 px-5 rounded-2xl font-black text-xs sm:text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                  >
                    <span>Request Driver Connect</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                </div>
              </div>
            ))}
          </section>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* Driver Connect Booking Confirmation Modal */}
      {selectedVehicleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {selectedVehicleForModal.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedVehicleForModal.categoryLabel}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicleForModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Transparent Pricing</span>
                <span className="text-sm font-black text-brand-700">{selectedVehicleForModal.ratePerKm}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Middleman Commission</span>
                <span className="text-sm font-black text-emerald-600">0% (Direct Pay to Driver)</span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>100% Police KYC & Commercial Permit Verified Chauffeur assigned instantly.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedVehicleForModal(null)}
                className="w-1/2 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Direct Driver Request confirmed for ${selectedVehicleForModal.name}! A verified chauffeur will contact you shortly.`);
                  setSelectedVehicleForModal(null);
                }}
                className="w-1/2 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Confirm Direct Connect
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
