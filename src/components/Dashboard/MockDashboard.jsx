import React from 'react';
import Logo from '../Common/Logo';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Search, 
  LogOut, 
  Star, 
  Car, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  Fuel,
  IndianRupee,
  Navigation
} from 'lucide-react';

const FEATURED_RENTALS = [
  {
    id: 1,
    car: 'Toyota Innova Crysta (7-Seater)',
    type: 'Car + Verified Driver',
    driver: 'Rajesh Patil',
    driverRating: 4.96,
    trips: '480+ trips',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    experience: '9 Years Exp • Sahyadri Specialist',
    price: '₹14 / km',
    pricingDetail: 'Zero agent markup • Fuel & Toll as actuals',
    routes: 'Mumbai • Pune • Mahabaleshwar • Goa',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    tag: 'Family & Group Choice'
  },
  {
    id: 2,
    car: 'Maruti Suzuki Ertiga (Smart Hybrid)',
    type: 'Car + Verified Driver',
    driver: 'Ketan Solanki',
    driverRating: 4.98,
    trips: '350+ trips',
    driverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    experience: '6 Years Exp • Highway & Night Expert',
    price: '₹11 / km',
    pricingDetail: 'Fixed per-KM rates • Direct to driver',
    routes: 'Ahmedabad • Surat • Somnath • Kutch',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    tag: 'Best Economy Pick'
  },
  {
    id: 3,
    car: 'Private Professional Chauffeur',
    type: 'Driver Only (For Your Own Car)',
    driver: 'Santosh Gowda',
    driverRating: 4.95,
    trips: '620+ trips',
    driverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    experience: '12 Years Exp • Luxury & Ghat Specialist',
    price: '₹950 / day',
    pricingDetail: 'Hire verified driver for your personal car',
    routes: 'Bengaluru • Mysuru • Coorg • Gokarna',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    tag: 'Personal Chauffeur'
  }
];

export default function MockDashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-10 font-sans">
      
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 rounded-2xl glass-panel border border-white/10 mb-8">
        <Logo size="md" />

        {/* User Info & Logout Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-white/10">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-brand-400"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                {user.name}
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/20 text-brand-400 font-semibold uppercase">
                  {user.role === 'driver_partner' ? 'Driver Partner' : 'Traveler'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{user.email}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-red-500/40 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* Auth Success Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-950/80 via-slate-900 to-adventure-950/40 border border-brand-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Welcome to Touralink, {user.name}!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                You have direct access to <strong className="text-brand-300">1,500+ verified drivers & cab rentals</strong> across Maharashtra, Goa, Gujarat & Karnataka with <strong>zero middleman commission</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% KYC Verified
            </span>
          </div>
        </div>

        {/* Quick Driver & Car Search Bar */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Direct Rental Search
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">
                Rent a Verified Driver or Cab
              </h2>
            </div>
            
            {/* Quick Filter Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-adventure-400" />
              <span>Transparent Rates • No Extra Agency Charges</span>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/80 p-3 rounded-2xl border border-white/10">
            
            {/* Pickup City */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900 border border-white/5">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Pickup City</div>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Pune"
                  defaultValue="Mumbai / Pune"
                  className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900 border border-white/5">
              <Navigation className="w-4 h-4 text-adventure-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Destination / Route</div>
                <input
                  type="text"
                  placeholder="e.g. Goa, Mahabaleshwar"
                  defaultValue="Goa / Mahabaleshwar"
                  className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* Rental Model Toggle */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900 border border-white/5">
              <Car className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Rental Type</div>
                <select className="bg-transparent text-xs text-white outline-none w-full font-medium cursor-pointer">
                  <option value="car_and_driver" className="bg-slate-900">Car + Verified Driver</option>
                  <option value="driver_only" className="bg-slate-900">Driver Only (For My Car)</option>
                  <option value="intercity_cab" className="bg-slate-900">Intercity Fixed ₹/KM</option>
                </select>
              </div>
            </div>

            {/* Search CTA */}
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-adventure-500 hover:from-brand-400 hover:to-adventure-400 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all cursor-pointer">
              <Search className="w-4 h-4" />
              <span>Find Verified Drivers</span>
            </button>
          </div>
        </div>

        {/* Verified Drivers & Cars Listing */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Top Rated Drivers & Cars Near You</h3>
              <p className="text-xs text-slate-400">Directly connect, inspect reviews, and book without middleman markup</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-semibold cursor-pointer hover:underline">
              <span>View All 1,500+ Verified Listings</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_RENTALS.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col"
              >
                {/* Vehicle Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.car}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-950/85 backdrop-blur-md text-brand-300 border border-white/10">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-extrabold bg-slate-950/90 text-adventure-400 border border-adventure-500/30">
                    {item.price}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Rental Type */}
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {item.type}
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {item.car}
                    </h4>

                    {/* Driver Card Snippet */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.driverPhoto}
                          alt={item.driver}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-400/80"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            {item.driver}
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </div>
                          <div className="text-[10px] text-slate-400">{item.experience}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold justify-end">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.driverRating}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{item.trips}</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                      <span className="truncate">{item.routes}</span>
                    </p>
                  </div>

                  {/* Pricing transparency note & Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-400 font-medium">
                      0% Commission
                    </span>
                    <button className="py-1.5 px-3 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 font-bold border border-brand-500/30 transition-all cursor-pointer">
                      View Driver Profile & Rates →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
