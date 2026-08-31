import React, { useState } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import { 
  UserCheck, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Car, 
  Clock, 
  Award, 
  Languages, 
  CheckCircle2, 
  LogOut,
  PhoneCall
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

const DRIVERS_DATA = [
  {
    id: 'ramesh_shinde',
    name: 'Ramesh Shinde',
    location: 'Pune / Mumbai (Maharashtra)',
    category: 'ghats',
    categoryLabel: 'Ghats & Hill Roads Specialist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    experience: '14 Years Driving Experience',
    badge: 'Police Verified • MH-12-8821',
    specialty: 'Sahyadri Ghats • Mahabaleshwar • Lonavala • Mumbai-Goa Highway',
    carExpertise: 'Manual & Automatic SUVs • Innova, Ertiga, Fortuner, Sedans',
    languages: 'Marathi, Hindi, English',
    dailyRate: '₹900 / Day',
    outstationRate: '₹1,200 / Night Outstation',
    rating: '4.98',
    trips: '1,420+ safe trips',
    bio: 'Specialist in hairpin ghat curves, night drives, and rainy monsoon mountain routes. Zero accident record over 14 years.'
  },
  {
    id: 'sameer_sawant',
    name: 'Sameer Sawant',
    location: 'Panaji / Margao (Goa)',
    category: 'coastal',
    categoryLabel: 'Goa Coastline & Tourist Guide',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    experience: '10 Years Driving Experience',
    badge: 'Commercial Badge • GA-01-4419',
    specialty: 'North & South Goa • Dudhsagar • Gokarna Coastal Highway',
    carExpertise: 'Automatic Sedans, Hatchbacks, Premium 7-Seaters',
    languages: 'Konkani, Hindi, English, Marathi',
    dailyRate: '₹950 / Day',
    outstationRate: '₹1,300 / Night Outstation',
    rating: '4.96',
    trips: '980+ safe trips',
    bio: 'Calm, polite chauffeur with expert knowledge of scenic coastal hidden spots, heritage churches, and smooth beach route drives.'
  },
  {
    id: 'praful_patel',
    name: 'Praful Patel',
    location: 'Ahmedabad / Surat (Gujarat)',
    category: 'highway',
    categoryLabel: 'Long Highway & Outstation Expert',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    experience: '16 Years Driving Experience',
    badge: 'Police Verified • GJ-01-9032',
    specialty: 'Statue of Unity • Somnath • Rann of Kutch • Expressway Long Hauls',
    carExpertise: 'All Manual & Automatic Vehicles • Heavy SUVs & Fleets',
    languages: 'Gujarati, Hindi, English',
    dailyRate: '₹850 / Day',
    outstationRate: '₹1,150 / Night Outstation',
    rating: '4.95',
    trips: '1,890+ safe trips',
    bio: 'Veteran long-distance highway chauffeur. Punctual, non-smoker, and experienced in smooth cruising on National Expressways.'
  },
  {
    id: 'manjunath_gowda',
    name: 'Manjunath Gowda',
    location: 'Bengaluru / Mysuru (Karnataka)',
    category: 'ghats',
    categoryLabel: 'Coorg & Western Ghats Specialist',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    experience: '12 Years Driving Experience',
    badge: 'Police Verified • KA-05-6671',
    specialty: 'Bengaluru ⇄ Coorg • Mysuru Palace • Ooty Hills • Hampi Trail',
    carExpertise: 'Fortuner 4x4, Innova Crysta, Scorpio, Automatic Cars',
    languages: 'Kannada, Telugu, Hindi, English',
    dailyRate: '₹900 / Day',
    outstationRate: '₹1,250 / Night Outstation',
    rating: '4.97',
    trips: '1,150+ safe trips',
    bio: 'Experienced in coffee estate rugged trails and sharp hill inclines. Known for punctual early morning airport and outstation pickups.'
  },
  {
    id: 'vinod_kamat',
    name: 'Vinod Kamat',
    location: 'Mumbai / Navi Mumbai (Maharashtra)',
    category: 'luxury',
    categoryLabel: 'Luxury & Automatic Chauffeur',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    experience: '15 Years Driving Experience',
    badge: 'VIP Badge Verified • MH-02-3118',
    specialty: 'Mumbai Sea Link • Pune Expressway • Corporate & Wedding Drives',
    carExpertise: 'Mercedes-Benz, BMW, Audi, Fortuner, Lexus, Automatic',
    languages: 'Hindi, Marathi, English',
    dailyRate: '₹1,100 / Day',
    outstationRate: '₹1,500 / Night Outstation',
    rating: '4.99',
    trips: '2,100+ safe trips',
    bio: 'Professional corporate chauffeur. Well-groomed, fluent in English, and master of high-end luxury automatic vehicles.'
  },
  {
    id: 'dinesh_solanki',
    name: 'Dinesh Solanki',
    location: 'Vadodara / Rajkot (Gujarat)',
    category: 'highway',
    categoryLabel: 'Night Drive & Long Distance Pro',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    experience: '11 Years Driving Experience',
    badge: 'Police Verified • GJ-06-7782',
    specialty: 'Zero-Fatigue Overnight Highway Trips • Mumbai-Gujarat Corridor',
    carExpertise: 'Sedans, MUVs, Commercial Pickups & Fleets',
    languages: 'Gujarati, Hindi',
    dailyRate: '₹950 / Day',
    outstationRate: '₹1,200 / Night Outstation',
    rating: '4.93',
    trips: '1,340+ safe trips',
    bio: 'Trained in defensive night driving and alert long-distance cruising. Perfect for urgent overnight intercity transfers.'
  }
];

export default function DriversPage({ user, onLogout, onBackToHome, onNavigateToFleet }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDriverForModal, setSelectedDriverForModal] = useState(null);

  const filteredDrivers = selectedCategory === 'all'
    ? DRIVERS_DATA
    : DRIVERS_DATA.filter((driver) => driver.category === selectedCategory);

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

            {/* Right: Switch to Fleet + Back to Home + User Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-900 shadow-xs hover:bg-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-adventure-600" />
                <span>Back to Overview</span>
              </button>

              <button
                onClick={onNavigateToFleet}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-extrabold shadow-md hover:bg-slate-850 transition-all cursor-pointer"
              >
                <Car className="w-3.5 h-3.5 text-brand-400" />
                <span>View Fleet Cabs</span>
              </button>

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

        {/* Main Driver Directory Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
          
          {/* Header Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-10 space-y-5 transition-all">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-adventure-600" />
                <span>100% Police & KYC Verified Chauffeur Network</span>
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={onNavigateToFleet}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 text-white text-xs font-bold"
                >
                  <Car className="w-3.5 h-3.5 text-brand-400" />
                  <span>Fleet</span>
                </button>
              </div>
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                Verified Personal Chauffeurs
              </h1>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Hire trusted drivers for your personal car or commercial fleet across Maharashtra, Goa, Gujarat & Karnataka. 
                <strong className="text-slate-950 font-bold"> Direct driver rates starting at ₹850/day with 0% middleman fees.</strong>
              </p>
            </div>

            {/* Category Filter Pills (Footer style) */}
            <div className="pt-4 border-t border-white/30 flex flex-wrap items-center gap-2.5">
              {[
                { id: 'all', label: 'All Verified Drivers' },
                { id: 'ghats', label: '🏔️ Ghats & Hill Road Specialists' },
                { id: 'highway', label: '🛣️ Long Highway & Night Drives' },
                { id: 'coastal', label: '🌴 Goa & Coastal Route Experts' },
                { id: 'luxury', label: '✨ Luxury & Automatic Car Chauffeurs' },
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

          {/* Drivers Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Driver Profile Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={driver.image}
                      alt={driver.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-adventure-500 shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-black text-slate-900 font-display">
                        {driver.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span className="truncate">{driver.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{driver.rating}</span>
                  </div>
                </div>

                {/* Driver Credentials & Highlights */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  
                  {/* Badge & Experience */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{driver.badge}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 font-semibold">
                      <Award className="w-4 h-4 text-adventure-600 shrink-0" />
                      <span>{driver.experience}</span>
                    </div>
                  </div>

                  {/* Specialty Routes */}
                  <div className="p-3 rounded-2xl bg-brand-50/70 border border-brand-100 text-xs space-y-1">
                    <div className="font-extrabold text-brand-800 flex items-center gap-1">
                      <span>Key Expertise:</span>
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {driver.specialty}
                    </p>
                  </div>

                  {/* Languages & Car Types */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-semibold">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 truncate">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Languages</span>
                      {driver.languages}
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 truncate">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Cars Handled</span>
                      Manual & Auto
                    </div>
                  </div>

                  {/* Pricing Breakdown Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Daily Chauffeur Charge</span>
                      <span className="text-base font-black text-slate-900">{driver.dailyRate}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Outstation Night Rate</span>
                      <span className="font-bold text-slate-700">{driver.outstationRate}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => setSelectedDriverForModal(driver)}
                    className="w-full py-3 px-5 rounded-2xl font-black text-xs sm:text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                  >
                    <span>Hire Chauffeur Directly</span>
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

      {/* Driver Direct Hire Confirmation Modal */}
      {selectedDriverForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriverForModal.image}
                  alt={selectedDriverForModal.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-adventure-500"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-display">
                    {selectedDriverForModal.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedDriverForModal.badge}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDriverForModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Daily Chauffeur Charge</span>
                <span className="text-sm font-black text-adventure-700">{selectedDriverForModal.dailyRate}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-600">Middleman Fee</span>
                <span className="text-sm font-black text-emerald-600">0% (Pay Driver Directly)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">About Driver:</span>
                <p className="text-slate-600 italic">"{selectedDriverForModal.bio}"</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Driver ID, background verification & driving permit verified by Touralink.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedDriverForModal(null)}
                className="w-1/2 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Chauffeur hire request sent to ${selectedDriverForModal.name}! The driver will reach out directly to coordinate timings.`);
                  setSelectedDriverForModal(null);
                }}
                className="w-1/2 py-3 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Confirm Chauffeur Connect
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
