import React, { useState } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import {
  Compass,
  MapPin,
  Calendar,
  Search,
  LogOut,
  Star,
  Car,
  ShieldCheck,
  UserCheck,
  Clock,
  IndianRupee,
  Navigation,
  Sparkles,
  ArrowRight,
  Eye,
  Users,
  Luggage,
  Fuel,
  CheckCircle2
} from 'lucide-react';
import VehicleDetailsModal from '../components/Fleet/VehicleDetailsModal';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

const FEATURED_CARS = [
  {
    id: 'innova_crysta',
    name: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    categoryLabel: '7-Seater Premium MUV',
    image: '/images/innova-crysta.jpg',
    seating: '6 + 1 Chauffeur',
    luggage: '4 Large Bags',
    fuel: 'Diesel • Manual / Auto',
    ac: 'Dual Zone AC with Rear Vents',
    ratePerKm: '₹15 / KM',
    dailyRate: '₹3,200 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Mumbai ⇄ Goa • Pune ⇄ Mahabaleshwar',
    rating: '4.96',
    trips: '2,840+ trips'
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga ZXi+',
    category: 'muv',
    categoryLabel: '7-Seater Family MUV',
    image: '/images/ertiga.jpg',
    seating: '6 + 1 Chauffeur',
    luggage: '3 Bags',
    fuel: 'Petrol / CNG • AC',
    ac: 'Powerful Dual AC',
    ratePerKm: '₹12 / KM',
    dailyRate: '₹2,600 / Day',
    minKmPerDay: '250 KM / Day',
    popularRoutes: 'Ahmedabad ⇄ Surat ⇄ Somnath',
    rating: '4.92',
    trips: '4,150+ trips'
  },
  {
    id: 'carens',
    name: 'Kia Carens Prestige Plus (7-Seater)',
    category: 'muv',
    categoryLabel: '7-Seater Luxury MUV',
    image: '/images/carens.jpg',
    seating: '6/7 + 1 Chauffeur',
    luggage: '3 Large Bags',
    fuel: 'Diesel / Turbo Petrol',
    ac: 'Roof AC Vents with Diffuser',
    ratePerKm: '₹13.5 / KM',
    dailyRate: '₹2,900 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Pune ⇄ Goa • Bengaluru ⇄ Coorg',
    rating: '4.95',
    trips: '1,920+ trips'
  },
  {
    id: 'dzire',
    name: 'Maruti Suzuki Dzire Tour S',
    category: 'sedan',
    categoryLabel: '4-Seater Compact Sedan',
    image: '/images/dzire.jpg',
    seating: '4 + 1 Chauffeur',
    luggage: '2 Large + 1 Small Bag',
    fuel: 'Petrol / CNG • AC',
    ac: 'Chilled AC',
    ratePerKm: '₹10.5 / KM',
    dailyRate: '₹2,100 / Day',
    minKmPerDay: '250 KM / Day',
    popularRoutes: 'Bengaluru ⇄ Mysuru • Pune ⇄ Lonavala',
    rating: '4.90',
    trips: '5,920+ trips'
  },
  {
    id: 'aura',
    name: 'Hyundai Aura Commercial Sedan',
    category: 'sedan',
    categoryLabel: '4-Seater Executive Sedan',
    image: '/images/aura.jpg',
    seating: '4 + 1 Chauffeur',
    luggage: '2 Large Bags (402L Boot)',
    fuel: 'CNG / Petrol',
    ac: 'Rear AC Vents',
    ratePerKm: '₹10.5 / KM',
    dailyRate: '₹2,150 / Day',
    minKmPerDay: '250 KM / Day',
    popularRoutes: 'Mumbai ⇄ Pune • Ahmedabad ⇄ Vadodara',
    rating: '4.91',
    trips: '3,210+ trips'
  },
  {
    id: 'wagonr',
    name: 'Maruti Suzuki WagonR Tour H3',
    category: 'sedan',
    categoryLabel: 'Tall-Boy Budget Cab',
    image: '/images/wagonr.jpg',
    seating: '4 + 1 Chauffeur',
    luggage: '2 Medium Bags',
    fuel: 'CNG (High Mileage 34km/kg)',
    ac: 'Powerful AC',
    ratePerKm: '₹9.5 / KM',
    dailyRate: '₹1,850 / Day',
    minKmPerDay: '200 KM / Day',
    popularRoutes: 'City Tours • Airport Drops • Daily Commute',
    rating: '4.89',
    trips: '7,400+ trips'
  },
  {
    id: 'old_innova',
    name: 'Toyota Innova 2.5D Classic',
    category: 'muv',
    categoryLabel: '7-Seater Legend MUV',
    image: '/images/old-innova.jpg',
    seating: '7 + 1 Chauffeur',
    luggage: '4 Large Bags',
    fuel: 'Diesel D-4D Engine',
    ac: 'Classic Dual AC',
    ratePerKm: '₹13 / KM',
    dailyRate: '₹2,800 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Pilgrimage Tours • Shirdi • Tirupati • Goa Roadtrips',
    rating: '4.93',
    trips: '8,200+ trips'
  },
  {
    id: 'urbania',
    name: 'Force Urbania Luxury Van (13-Seater)',
    category: 'van',
    categoryLabel: 'Luxury Group Traveler',
    image: '/images/car-fleet-images.jpg',
    seating: '12 + 1 Chauffeur',
    luggage: '10+ Bags Dedicated Boot',
    fuel: 'Diesel • High Roof AC',
    ac: 'Individual AC Blowers on all seats',
    ratePerKm: '₹26 / KM',
    dailyRate: '₹6,800 / Day',
    minKmPerDay: '300 KM / Day',
    popularRoutes: 'Goa Wedding Trips • Hampi Heritage Tours • Family Groups',
    rating: '4.97',
    trips: '850+ trips'
  }
];

export default function TravelerHome({
  user,
  onLogout,
  onNavigateToFleet,
  onNavigateToDrivers
}) {
  // Rental mode tab: 'car_driver' | 'driver_only'
  const [activeTab, setActiveTab] = useState('car_driver');
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);

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

            {/* Logo & Region Badge */}
            <Logo size="md" />

            {/* Right Actions: User Profile */}
            <div className="flex items-center gap-3">
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

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 flex-1 w-full">
          
          {/* Apple Music Style Frosted Welcome Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-10 space-y-6 transition-all">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-adventure-600" />
              <span>Maharashtra • Goa • Gujarat • Karnataka</span>
            </div>

            {/* Heading Content */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                Namaste, <span className="text-brand-600">Traveler</span>!
                <br />Where are you driving next?
              </h1>

              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Rent verified drivers for your personal car, or book transparent per-km car + driver rentals.
                <strong className="text-slate-950 font-bold"> Zero middleman commissions. 100% verified police & commercial badges.</strong>
              </p>
            </div>

            {/* Quick Stats Badges on Bottom */}
            <div className="pt-4 border-t border-white/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-brand-600 shrink-0 shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">1,500+</div>
                  <div className="text-xs text-slate-600 font-semibold">Verified Chauffeurs</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-adventure-600 shrink-0 shadow-xs">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">0% Markup</div>
                  <div className="text-xs text-slate-600 font-semibold">Direct Driver Rates</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">100% KYC</div>
                  <div className="text-xs text-slate-600 font-semibold">Background Checked</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
                  <Star className="w-5 h-5 fill-purple-600 text-purple-600" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">4.92 / 5</div>
                  <div className="text-xs text-slate-600 font-semibold">Driver Avg Rating</div>
                </div>
              </div>
            </div>
          </section>

          {/* 🚗 Two Choice Modes: Car + Driver vs Driver Only */}
          <section className="max-w-5xl mx-auto w-full space-y-6">

            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Choose Your Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Transparent direct pricing • 0% Middleman Commission • 100% Police & Commercial Badge Verified
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">

              {/* Card 1: Car + Verified Driver */}
              <div
                onClick={() => setActiveTab('car_driver')}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${activeTab === 'car_driver'
                  ? 'border-brand-600 bg-white shadow-2xl shadow-slate-300/60 ring-2 ring-brand-500/25'
                  : 'border-slate-200 bg-white/90 hover:bg-white hover:border-slate-300 shadow-xl shadow-slate-200/50'
                  } backdrop-blur-xl`}
              >
                {/* Top Image Preview */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                  <img
                    src="/images/car-fleet-images.jpg"
                    alt="Car + Verified Driver"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 text-xs font-extrabold text-slate-900 shadow-xs">
                    <Car className="w-3.5 h-3.5 text-brand-600" />
                    <span>Outstation & City Cabs</span>
                  </div>

                  {/* Active Indicator Badge */}
                  {activeTab === 'car_driver' && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                      Selected
                    </div>
                  )}

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xl font-black font-display drop-shadow-md">
                      Car + Verified Driver
                    </div>
                    <div className="text-xs text-slate-200 font-medium drop-shadow-sm">
                      Innova Crysta • Ertiga • Dzire • WagonR • SUVs
                    </div>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Book complete AC vehicles with experienced commercial chauffeurs. Fixed transparent rates with zero hidden charges for one-way or round trips across Maharashtra, Goa, Gujarat & Karnataka.
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={onNavigateToFleet}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                  >
                    <span>Browse All Cabs & Rates</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Card 2: Driver Only (For Your Own Car / Fleet) */}
              <div
                onClick={() => setActiveTab('driver_only')}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${activeTab === 'driver_only'
                  ? 'border-adventure-600 bg-white shadow-2xl shadow-slate-300/60 ring-2 ring-adventure-500/25'
                  : 'border-slate-200 bg-white/90 hover:bg-white hover:border-slate-300 shadow-xl shadow-slate-200/50'
                  } backdrop-blur-xl`}
              >
                {/* Top Image Preview */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80"
                    alt="Driver Only Chauffeur"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/80 text-xs font-extrabold text-slate-900 shadow-xs">
                    <UserCheck className="w-3.5 h-3.5 text-adventure-600" />
                    <span>Personal Chauffeur</span>
                  </div>

                  {/* Active Indicator Badge */}
                  {activeTab === 'driver_only' && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-adventure-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                      Selected
                    </div>
                  )}

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xl font-black font-display drop-shadow-md">
                      Driver Only (For Your Car)
                    </div>
                    <div className="text-xs text-slate-200 font-medium drop-shadow-sm">
                      Ghats • Outstation • Night Drives • Fleet
                    </div>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Have your own car or fleet? Hire verified, professional chauffeurs for steep ghat drives, long highway trips, or city tours with 100% peace of mind.
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={onNavigateToDrivers}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                  >
                    <span>Hire Verified Drivers</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

            </div>

          </section>

          {/* 🚗 Live Commercial Fleet Cars Showcase with Direct Photos */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                  Available Fleet & Commercial Cabs
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                  Verified vehicles ready for one-way or round-trip outstation & city dispatch. Click any car to inspect.
                </p>
              </div>

              <button
                onClick={onNavigateToFleet}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 border border-slate-200 text-xs font-extrabold text-slate-800 hover:bg-white shadow-xs"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </button>
            </div>

            {/* Grid of All Real Car Pictures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {FEATURED_CARS.map((car) => (
                <div
                  key={car.id}
                  className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo Container */}
                  <div 
                    onClick={() => setSelectedVehicleForModal(car)}
                    className="relative h-48 w-full overflow-hidden cursor-pointer bg-slate-900"
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Category & Rating Badges */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-black text-slate-900 shadow-xs">
                      <Car className="w-3 h-3 text-brand-600" />
                      <span>{car.categoryLabel.split(' ')[0]}</span>
                    </div>

                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-white text-[11px] font-bold shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{car.rating}</span>
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="text-sm font-black font-display drop-shadow-md truncate">
                        {car.name}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-black drop-shadow-xs">
                        {car.ratePerKm}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                    
                    {/* Specs Pills */}
                    <div className="grid grid-cols-2 gap-1.5 text-slate-600 font-semibold text-[11px]">
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200/60 truncate">
                        <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span className="truncate">{car.seating}</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200/60 truncate">
                        <Luggage className="w-3.5 h-3.5 text-adventure-600 shrink-0" />
                        <span className="truncate">{car.luggage}</span>
                      </div>
                    </div>

                    {/* Action Buttons: View Vehicle & Request Driver */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedVehicleForModal(car)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-600" />
                        <span>View Car</span>
                      </button>

                      <button
                        onClick={() => setSelectedVehicleForModal(car)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* Comprehensive Vehicle Details & Showcase Modal */}
      <VehicleDetailsModal
        vehicle={selectedVehicleForModal}
        isOpen={Boolean(selectedVehicleForModal)}
        onClose={() => setSelectedVehicleForModal(null)}
        onBookDirect={(v) => {
          alert(`Chauffeur connect requested for ${v.name}! Driver details dispatched.`);
        }}
      />

    </div>
  );
}
