import React, { useState, useEffect } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import { subscribeToDrivers } from '../services/driverService';
import WhatsAppNotificationModal from '../components/Common/WhatsAppNotificationModal';
import { dispatchBookingWhatsAppAlerts } from '../services/whatsappNotificationService';
import RouteMapPreview from '../components/Common/RouteMapPreview';

import ErrorBoundary from '../components/Common/ErrorBoundary';
import InteractiveRouteModal from '../components/Common/InteractiveRouteModal';
import DriverDetailsModal from '../components/Drivers/DriverDetailsModal';
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
  PhoneCall,
  Maximize2,
  Eye,
  MessageSquare
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

import { DRIVERS_DATA } from '../data/driversData';
export { DRIVERS_DATA };

export default function DriversPage({ 
  user, 
  onLogout, 
  onBackToHome, 
  onNavigateToFleet,
  tripDetails,
  onEditTrip,
  onSelectDriver
}) {
  const [driversList, setDriversList] = useState(DRIVERS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDriverForModal, setSelectedDriverForModal] = useState(null);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppDispatchRecord, setWhatsAppDispatchRecord] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Subscribe to real-time drivers, preserving rich verification & KYC data
  useEffect(() => {
    const unsub = subscribeToDrivers((liveDrivers) => {
      if (liveDrivers && liveDrivers.length > 0) {
        const merged = DRIVERS_DATA.map((staticDriver) => {
          const live = liveDrivers.find((ld) => ld.id === staticDriver.id);
          return live ? { ...staticDriver, ...live } : staticDriver;
        });
        setDriversList(merged);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const filteredDrivers = selectedCategory === 'all'
    ? driversList
    : driversList.filter((driver) => driver.category === selectedCategory);

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

              {onNavigateToFleet && (
                <button
                  onClick={onNavigateToFleet}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-800 shadow-xs hover:bg-white transition-all cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5 text-brand-600" />
                  <span>Switch to Car Rentals</span>
                </button>
              )}

              <button
                onClick={() => onLogout?.('driver_partner', 'partner_type_selection')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-950 text-white hover:bg-slate-850 text-xs font-black shadow-sm transition-all cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Join Partner (Driver / Fleet)</span>
                <span className="sm:hidden">Join Partner</span>
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
                  onClick={() => onLogout?.('driver_partner', 'partner_type_selection')}
                  title="Sign Out / Switch to Partner"
                  className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* Main Driver Directory Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 flex-1 w-full">
          
          {/* Active Trip Requirement & Route Context Banner with Real OpenStreetMap Preview */}
          {tripDetails && (
            <section className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-adventure-200/90 shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 animate-fadeIn">
              <div className="flex items-start sm:items-center gap-3.5 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-adventure-500 text-white flex items-center justify-center shadow-md shadow-adventure-500/20 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-adventure-700 tracking-wider bg-adventure-50 px-2 py-0.5 rounded-md border border-adventure-200">
                      Chauffeur Duty Route
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {tripDetails.pickupLocation} → {tripDetails.dropoffLocation}
                    </span>
                    {tripDetails.additionalStops?.length > 0 && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        +{tripDetails.additionalStops.length} En-Route Stop{tripDetails.additionalStops.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-adventure-600" />
                      <span>{tripDetails.estimatedDistance} KM Circuit</span>
                    </span>
                    <span>•</span>
                    <span>🚗 Your Car: {tripDetails.carBrandModel || tripDetails.ownCarType?.toUpperCase() || 'PERSONAL CAR'} ({tripDetails.transmission || 'Automatic'})</span>
                    <span>•</span>
                    <span>📅 {tripDetails.pickupDate}</span>
                  </div>
                </div>
              </div>

              {/* Dedicated Driver Route OpenStreetMap Preview */}
              <div className="w-full lg:w-72 shrink-0">
                <RouteMapPreview
                  startCoords={tripDetails.pickupCoords || [73.8567, 18.5204]}
                  endCoords={tripDetails.dropoffCoords || [73.6586, 17.9237]}
                  routeGeometry={tripDetails.liveRouteData?.geometry}
                  onClick={() => setIsRouteModalOpen(true)}
                />
              </div>

              <div className="flex flex-row lg:flex-col items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(true)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-adventure-600" />
                  <span>Inspect Route & Stops</span>
                </button>
                <button
                  type="button"
                  onClick={onEditTrip}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Edit Requirements</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          )}

          {/* Header Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-8 space-y-5 transition-all">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-adventure-600" />
                <span>100% Police & KYC Verified Chauffeur Network</span>
              </div>

              <button
                onClick={() => onLogout?.('driver_partner', 'partner_type_selection')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-black shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Join as Partner • Choose Driver or Fleet →</span>
              </button>

              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                {onNavigateToFleet && (
                  <button
                    onClick={onNavigateToFleet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs"
                  >
                    <Car className="w-3.5 h-3.5 text-brand-600" />
                    <span>Cabs</span>
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-3xl space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                {tripDetails ? 'Verified Chauffeurs for Your Drive' : 'Verified Personal Chauffeurs'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
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
            {filteredDrivers.map((driver) => {
              const isDriverSelected = tripDetails?.selectedDriver?.id === driver.id || 
                tripDetails?.assignedDriverName?.toLowerCase() === driver.name.toLowerCase();

              return (
                <div
                  key={driver.id}
                  className={`relative rounded-3xl overflow-hidden border bg-white/90 backdrop-blur-xl shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                    isDriverSelected
                      ? 'border-adventure-500 ring-2 ring-adventure-500/40 shadow-2xl'
                      : 'border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-2xl'
                  }`}
                >
                  {/* Active Selected Driver Badge */}
                  {isDriverSelected && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-lg flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active On Main Page Map</span>
                    </div>
                  )}

                  {/* Driver Profile Header - Click to open Full Real KYC & Profile */}
                  <div 
                    onClick={() => setSelectedDriverForModal(driver)}
                    className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                    title="Click to view full real KYC, vehicle mastery & customer reviews"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={driver.image}
                        alt={driver.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-adventure-500 shadow-sm"
                      />
                      <div>
                        <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                          <span>{driver.name}</span>
                          <span className="text-[10px] font-bold text-adventure-600 bg-adventure-50 px-1.5 py-0.5 rounded border border-adventure-200">
                            Details
                          </span>
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

                    {/* Action Buttons: Full KYC Details, Select for Map & Direct Hire */}
                    <div className="space-y-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => setSelectedDriverForModal(driver)}
                        className="w-full py-2.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-xs hover:border-slate-300"
                      >
                        <Eye className="w-4 h-4 text-adventure-600" />
                        <span>View Real KYC, Routes & Profile</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => onSelectDriver?.(driver)}
                          className={`py-2.5 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs truncate ${
                            isDriverSelected
                              ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-500'
                              : 'bg-adventure-50 hover:bg-adventure-100 text-adventure-800 border border-adventure-200'
                          }`}
                        >
                          {isDriverSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">Active on Map</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5 text-adventure-600 shrink-0" />
                              <span className="truncate">Select for Map</span>
                            </>
                          )}
                        </button>

                        <button 
                          type="button"
                          onClick={() => {
                            onSelectDriver?.(driver);
                            setSelectedDriverForModal(driver);
                          }}
                          className="py-2.5 px-3 rounded-2xl font-black text-xs text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-950/20 group cursor-pointer truncate"
                        >
                          <span className="truncate">Hire Chauffeur</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </section>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* Driver Full Detail & Real KYC Data Modal */}
      <DriverDetailsModal
        driver={selectedDriverForModal}
        tripDetails={tripDetails}
        isOpen={Boolean(selectedDriverForModal)}
        onClose={() => setSelectedDriverForModal(null)}
        onSelectForMap={(driver) => {
          if (onSelectDriver) {
            onSelectDriver(driver);
          }
        }}
        onHireDirect={(driver) => {
          const record = dispatchBookingWhatsAppAlerts({
            tripData: tripDetails,
            traveler: user,
            driver: {
              name: driver.name,
              phone: driver.phone || '+91 98221 44510',
              badge: driver.badgeNumber || driver.badge
            },
            fleetOwner: {
              agencyName: 'Touralink Verified Chauffeur Guild',
              phone: '+91 94220 99881',
              city: driver.location || 'Maharashtra'
            }
          });
          if (onSelectDriver) {
            onSelectDriver(driver);
          }
          setWhatsAppDispatchRecord(record);
          setWhatsAppModalOpen(true);
          setSelectedDriverForModal(null);
        }}
      />

      {/* Real-time WhatsApp Notification Modal for Traveler, Driver & Fleet Owner */}
      <WhatsAppNotificationModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        dispatchRecord={whatsAppDispatchRecord}
      />

      {/* Real-time OpenStreetMap Route Modal for Driver Booking (allowEV={false}, showAIPlanner={false}) */}
      {isRouteModalOpen && (
        <ErrorBoundary onReset={() => setIsRouteModalOpen(false)}>
          <InteractiveRouteModal
            isOpen={isRouteModalOpen}
            onClose={() => setIsRouteModalOpen(false)}
            pickupLocation={tripDetails?.pickupLocation || 'Pickup Point'}
            pickupCoords={tripDetails?.pickupCoords || [73.8567, 18.5204]}
            dropoffLocation={tripDetails?.dropoffLocation || 'Destination'}
            dropoffCoords={tripDetails?.dropoffCoords || [73.6586, 17.9237]}
            additionalStops={tripDetails?.additionalStops || []}
            routeData={tripDetails?.liveRouteData}
            tripType={tripDetails?.tripType || 'one_way'}
            allowEV={false}
            showAIPlanner={false}
          />
        </ErrorBoundary>
      )}

    </div>
  );
}
