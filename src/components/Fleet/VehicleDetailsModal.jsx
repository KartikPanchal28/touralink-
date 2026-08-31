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
  Camera
} from 'lucide-react';

export default function VehicleDetailsModal({ vehicle, isOpen, onClose, onBookDirect }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Reset photo index when a new vehicle is opened
  useEffect(() => {
    setActivePhotoIndex(0);
    setBookingConfirmed(false);
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
          
          {/* 📸 Multi-Photo Hero Showcase for this specific vehicle */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-84 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
              <img
                src={currentPhoto}
                alt={`${vehicle.name || vehicle.modelName} view ${activePhotoIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Graceful fallback to primary vehicle image if a supplementary image is loading
                  if (vehicle.image && e.target.src !== vehicle.image) {
                    e.target.src = vehicle.image;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

              {/* Multi-Photo Flip Controls (If multiple photos exist for this car) */}
              {photoList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Previous car photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Next car photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Category & Multi-Photo Counter Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
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
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-xs font-black">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{vehicle.rating || '4.95'}</span>
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">{vehicle.trips || '2,400+ verified trips'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
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
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      idx === activePhotoIndex
                        ? 'border-brand-600 scale-105 shadow-md ring-2 ring-brand-500/30'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
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
