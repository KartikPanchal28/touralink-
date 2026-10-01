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
  Camera,
  Eye,
  Images
} from 'lucide-react';
import FleetGalleryModal from '../components/Fleet/FleetGalleryModal';
import CustomTripPlannerSection from '../components/Traveler/CustomTripPlannerSection';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

export default function TravelerHome({
  user,
  onLogout,
  onNavigateToEstimate,
  onNavigateToFleet,
  onNavigateToDrivers,
  onNavigateToHireDriver,
  tripDetails,
  chauffeurDetails,
  onProceedFromEstimate,
  onProceedFromChauffeur,
  onSelectVehicle,
  onSelectDriver,
  onUpdateTripDetails,
  onUpdateChauffeurDetails
}) {
  // Rental mode tab: 'car_driver' | 'driver_only'
  const [activeTab, setActiveTab] = useState(() => {
    if (chauffeurDetails?.selectedDriver && !tripDetails?.selectedVehicle) {
      return 'driver_only';
    }
    return 'car_driver';
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

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
                    {user?.name || 'Traveler'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <span>📱 {user?.phone || 'WhatsApp Verified'}</span>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
          
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

          {/* 🚗 Two Wide Centered Choice Cards: Car + Driver vs Driver Only */}
          <section className="max-w-5xl mx-auto w-full space-y-6">

            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Choose Your Rental Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Transparent direct pricing • 0% Middleman Commission • 100% Police & Commercial Badge Verified
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">

              {/* Card 1: Car & Cab Rental (Car + Driver) */}
              <div
                onClick={() => {
                  setActiveTab('car_driver');
                  if (onNavigateToEstimate) onNavigateToEstimate('car_driver');
                  else onNavigateToFleet();
                }}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${activeTab === 'car_driver'
                  ? 'border-brand-600 bg-white shadow-2xl shadow-slate-300/60 ring-2 ring-brand-500/25'
                  : 'border-slate-200 bg-white/90 hover:bg-white hover:border-slate-300 shadow-xl shadow-slate-200/50'
                  } backdrop-blur-xl`}
              >
                {/* Top Interactive Image Preview with Photo Gallery Trigger */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsGalleryOpen(true);
                  }}
                  className="relative h-56 sm:h-64 w-full overflow-hidden cursor-pointer"
                  title="Click to browse 8+ verified fleet car photos"
                >
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

                  {/* Interactive Fleet Photo Gallery Trigger Badge */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 text-xs font-extrabold shadow-lg transition-transform group-hover:scale-105">
                    <Images className="w-3.5 h-3.5 text-brand-400" />
                    <span>8+ Fleet Photos</span>
                  </div>

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                    <div>
                      <div className="text-xl font-black font-display drop-shadow-md">
                        Car & Cab Rental
                      </div>
                      <div className="text-xs text-slate-200 font-medium drop-shadow-sm">
                        Innova Crysta • Ertiga • Dzire • Force Urbania
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-brand-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>View fleet</span>
                    </span>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Don't have a car? Book complete sanitized AC commercial vehicles with verified chauffeurs. Fixed transparent per-km rates with zero hidden charges for one-way or round trips across Maharashtra, Goa, Gujarat & Karnataka.
                  </p>

                  <div className="space-y-2.5">
                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToEstimate) onNavigateToEstimate('car_driver');
                        else onNavigateToFleet();
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                    >
                      <span>Plan Car Rental</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToFleet();
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-brand-600 hover:underline cursor-pointer transition-colors"
                      >
                        Or directly browse fleet directory →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Driver Only (For Your Own Car) */}
              <div
                onClick={() => {
                  setActiveTab('driver_only');
                  if (onNavigateToHireDriver) onNavigateToHireDriver();
                  else onNavigateToDrivers();
                }}
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

                  {/* Bottom Image Headline */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xl font-black font-display drop-shadow-md">
                      Hire Driver (For Your Own Car)
                    </div>
                    <div className="text-xs text-slate-200 font-medium drop-shadow-sm">
                      Ghats Specialists • Expressways • Luxury Automatics
                    </div>
                  </div>
                </div>

                {/* Card Content & Action */}
                <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Already own a car or fleet? Hire verified, background-checked chauffeurs specialized in steep hairpin ghats, long expressway journeys, or luxury automatic vehicles. Transparent daily driver wages.
                  </p>

                  <div className="space-y-2.5">
                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToHireDriver) onNavigateToHireDriver();
                        else onNavigateToDrivers();
                      }}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/20 group cursor-pointer"
                    >
                      <span>Hire Chauffeur For Your Car</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToDrivers();
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-adventure-600 hover:underline cursor-pointer transition-colors"
                      >
                        Or directly browse verified chauffeurs →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </section>

          {/* 🏖️ Wanna Plan Your Own Trip? We Are Here! (Discounted Sports, Tourism Activities, OSM Map & AI Planner) */}
          <CustomTripPlannerSection
            user={user}
            tripDetails={tripDetails}
            chauffeurDetails={chauffeurDetails}
            activeRentalMode={activeTab}
            onBookFleetTrip={(tripConfig) => {
              if (onProceedFromEstimate) {
                onProceedFromEstimate(tripConfig, 'fleet');
              } else if (onNavigateToEstimate) {
                onNavigateToEstimate('car_driver', tripConfig);
              } else {
                onNavigateToFleet();
              }
            }}
            onHireChauffeurTrip={(tripConfig) => {
              if (onProceedFromChauffeur) {
                onProceedFromChauffeur(tripConfig, 'drivers');
              } else if (onNavigateToHireDriver) {
                onNavigateToHireDriver(tripConfig);
              } else {
                onNavigateToDrivers();
              }
            }}
            onNavigateToEstimate={onNavigateToEstimate}
            onNavigateToHireDriver={onNavigateToHireDriver}
            onDirectFleet={onNavigateToFleet}
            onDirectDrivers={onNavigateToDrivers}
            onSelectVehicle={onSelectVehicle}
            onSelectDriver={onSelectDriver}
            onUpdateTripDetails={onUpdateTripDetails}
            onUpdateChauffeurDetails={onUpdateChauffeurDetails}
          />

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* 📸 Comprehensive Fleet Photo Gallery Modal */}
      <FleetGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectVehicle={() => {
          setIsGalleryOpen(false);
          onNavigateToFleet();
        }}
      />

    </div>
  );
}
