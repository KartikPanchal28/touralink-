import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function VehicleDetailsModal({ vehicle, isOpen, onClose, onBookDirect }) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleConfirm = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      if (onBookDirect) onBookDirect(vehicle);
      setBookingConfirmed(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
          title="Close Viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Hero Vehicle Photo & Badge Banner */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
            <img
              src={vehicle.image}
              alt={vehicle.name || vehicle.modelName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

            {/* Category & Rating Badges */}
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
            </div>

            {/* Bottom Title & Highlight */}
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
              {[
                '✓ Dual AC with Roof Vents',
                '✓ GPS Live Real-time Tracking',
                '✓ MVD Fitness Certified',
                '✓ Commercial Insurance Active',
                '✓ Fastag Electronic Toll Enabled',
                '✓ First Aid & Emergency Kit'
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700">
                  {item}
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
