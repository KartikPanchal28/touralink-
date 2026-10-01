import React, { useState, useEffect } from 'react';
import {
  X,
  Car,
  Users,
  Luggage,
  Fuel,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Award,
  Zap,
  Clock,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Images,
  Camera,
  Maximize2,
  Minimize2,
  SlidersHorizontal
} from 'lucide-react';

export default function VehicleDetailsModal({ vehicle, tripDetails, isOpen, onClose, onBookDirect }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' (Whole car visible) | 'cover' (Zoomed)
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset photo index when a new vehicle is opened
  useEffect(() => {
    setActivePhotoIndex(0);
    setBookingConfirmed(false);
    setIsImageLoading(true);
  }, [vehicle, isOpen]);

  // Keyboard navigation for photos (Esc to close, Left/Right to flip photos)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activePhotoIndex, vehicle]);

  if (!isOpen || !vehicle) return null;

  // Extract all photos available for this specific vehicle model
  const photoList = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [vehicle.image || '/images/car-fleet-images.jpg'];

  const currentPhoto = photoList[activePhotoIndex] || photoList[0];

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % photoList.length);
  };

  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  const handleConfirm = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      if (onBookDirect) onBookDirect(vehicle);
      setBookingConfirmed(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 max-h-[94vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Close Vehicle Viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* 📸 Multi-Photo Hero Showcase with Dual-Layer Auto-Fit Presentation */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-84 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group flex items-center justify-center">
              
              {/* Layer 1: Ambient Blurred Backdrop to smoothly fill wide view */}
              <img
                src={currentPhoto}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-125 select-none pointer-events-none"
              />
              <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90 pointer-events-none" />

              {/* Layer 2: Skeleton Loader while switching photos */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs z-10 animate-pulse">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Car className="w-8 h-8 animate-bounce text-brand-400" />
                    <span className="text-xs font-semibold">Adjusting HD vehicle view...</span>
                  </div>
                </div>
              )}

              {/* Layer 3: Foreground Main Vehicle Photo with Auto-Fit */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  key={`${currentPhoto}-${fitMode}`}
                  src={currentPhoto}
                  alt={`${vehicle.name || vehicle.modelName} view ${activePhotoIndex + 1}`}
                  onLoad={() => setIsImageLoading(false)}
                  onError={(e) => {
                    setIsImageLoading(false);
                    if (vehicle.image && e.target.src !== vehicle.image) {
                      e.target.src = vehicle.image;
                    }
                  }}
                  className={`max-w-full max-h-full transition-all duration-300 ${
                    fitMode === 'contain'
                      ? 'object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]'
                      : 'w-full h-full object-cover'
                  } ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                />
              </div>

              {/* Framing Mode Toggle Button */}
              <div className="absolute top-4 right-16 z-20">
                <button
                  type="button"
                  onClick={() => setFitMode(prev => prev === 'contain' ? 'cover' : 'contain')}
                  className="px-2.5 py-1 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white text-[11px] font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
                  title={fitMode === 'contain' ? 'Switch to Zoomed Fill View' : 'Switch to Full Vehicle Fit (No Crop)'}
                >
                  <SlidersHorizontal className="w-3 h-3 text-brand-400" />
                  <span>{fitMode === 'contain' ? 'Fit Whole Car' : 'Fill View'}</span>
                </button>
              </div>

              {/* Multi-Photo Flip Controls (If multiple photos exist for this car) */}
              {photoList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      setIsImageLoading(true);
                      handlePrevPhoto(e);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Previous car photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      setIsImageLoading(true);
                      handleNextPhoto(e);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Next car photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Category & Multi-Photo Counter Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-black text-slate-900 shadow-xs flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-brand-600" />
                  <span>{vehicle.categoryLabel || vehicle.category?.toUpperCase()}</span>
                </span>

                {vehicle.numberPlate && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400 border border-amber-500 text-slate-950 text-[11px] font-black font-mono shadow-xs">
                    [IND] {vehicle.numberPlate}
                  </span>
                )}

                {photoList.length > 1 && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-md border border-white/20 text-[11px] font-black shadow-xs flex items-center gap-1">
                    <Camera className="w-3 h-3 text-brand-400" />
                    <span>Photo {activePhotoIndex + 1} of {photoList.length}</span>
                  </span>
                )}
              </div>

              {/* Bottom Title & Specs on Image */}
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white space-y-1 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-xs font-black">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{vehicle.rating || '4.95'}</span>
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">{vehicle.trips || '2,400+ verified trips'}</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                  {vehicle.name || vehicle.modelName}
                </h2>
              </div>
            </div>

            {/* Thumbnail Navigation Strip (When multiple photos are available for this car) */}
            {photoList.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {photoList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsImageLoading(true);
                      setActivePhotoIndex(idx);
                    }}
                    className={`relative w-22 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-slate-900 ${
                      idx === activePhotoIndex
                        ? 'border-brand-600 scale-105 shadow-md ring-2 ring-brand-500/30'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain p-1 filter drop-shadow-xs"
                    />
                    <div className="absolute bottom-0.5 right-1 text-[9px] font-black text-white bg-black/60 px-1 rounded">
                      #{idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Technical Specs Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>Seating Layout</span>
              </div>
              <div className="text-xs font-black text-slate-900">{vehicle.seating || '6+1 Persons'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-adventure-600" />
                <span>Luggage Boot</span>
              </div>
              <div className="text-xs font-black text-slate-900">{vehicle.luggage || vehicle.bootSpace || '3-4 Bags'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fuel & Power</span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate">{vehicle.fuel || 'Diesel / CNG'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Permit Type</span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate">{vehicle.permitType || 'All India AITP'}</div>
            </div>
          </div>

          {/* If Trip Details Configured: Display Route & Distance Quote */}
          {tripDetails && (
            <div className="p-4 sm:p-5 rounded-3xl bg-brand-50/90 border border-brand-200 text-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-brand-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Your Trip Quote</span>
                </span>
                <span className="text-xs font-black text-brand-700 bg-white px-2.5 py-1 rounded-full border border-brand-200 shadow-xs">
                  {tripDetails.estimatedDistance} KM • {tripDetails.estimatedDuration}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-brand-200/60 pt-2.5">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {tripDetails.pickupLocation} → {tripDetails.dropoffLocation}
                  </div>
                  <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-2 pt-0.5">
                    <span>👥 {tripDetails.passengers} Travelers</span>
                    <span>•</span>
                    <span>🧳 {tripDetails.largeBags} Bags</span>
                    <span>•</span>
                    <span>📅 {tripDetails.pickupDate}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Estimated Vehicle Total</div>
                  <div className="text-xl font-black text-brand-700 font-display">
                    ₹{(Math.round((parseFloat(vehicle.ratePerKm.replace(/[^0-9.]/g, '')) || 12) * tripDetails.estimatedDistance)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Commercial Transparency Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-brand-400">
                  Fixed Direct Commercial Tariff
                </span>
                <div className="text-2xl font-black font-display">
                  {vehicle.ratePerKm ? (typeof vehicle.ratePerKm === 'number' ? `₹${vehicle.ratePerKm}/KM` : vehicle.ratePerKm) : '₹14 / KM'}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  Full Day Rental Package
                </span>
                <div className="text-lg font-bold text-slate-200">
                  {vehicle.dailyRate || (vehicle.defaultDailyRate ? `₹${vehicle.defaultDailyRate}/Day` : '₹3,500 / Day')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0% Commission (Direct UPI to Driver)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hidden Night Surcharges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Min: {vehicle.minKmPerDay || '300 KM / Day'}</span>
              </div>
            </div>
          </div>

          {/* Assigned Driver Profile (If available in garage or fleet) */}
          {vehicle.assignedDriver && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={vehicle.assignedDriver.avatar}
                  alt={vehicle.assignedDriver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-xs"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>{vehicle.assignedDriver.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      ★ {vehicle.assignedDriver.rating || '4.97'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Badge: {vehicle.assignedDriver.badge} • Police KYC Verified
                  </div>
                </div>
              </div>

              <a
                href={`tel:${vehicle.assignedDriver.phone}`}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
                <span>Call Chauffeur</span>
              </a>
            </div>
          )}

          {/* Vehicle Highlights & Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Vehicle Amenities & Safety Clearances
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {(vehicle.features || [
                'Dual AC with Roof Vents',
                'GPS Live Real-time Tracking',
                'MVD Fitness Certified',
                'Commercial Insurance Active',
                'Fastag Electronic Toll Enabled',
                'First Aid & Emergency Kit'
              ]).map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          {/* Popular Circuit Recommendations */}
          {vehicle.popularRoutes && (
            <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center gap-2.5 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <strong>Recommended Circuits:</strong> {vehicle.popularRoutes}
              </div>
            </div>
          )}

          {/* Booking Confirmation Notice */}
          {bookingConfirmed && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Direct Chauffeur Connect dispatched! Driver details sent via SMS & WhatsApp.</span>
            </div>
          )}

          {/* Bottom Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3.5 px-4 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer text-center"
            >
              Back to Catalog
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-850 active:scale-[0.98] text-white text-xs font-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Connect with Verified Chauffeur</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
