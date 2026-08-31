import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Car,
  Users,
  Luggage,
  Fuel,
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ALL_FLEET_VEHICLES = [
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
    features: ['Captain Reclining Seats', 'Airbags & ABS', 'GPS Live Tracked', 'Roof Carrier Available'],
    rating: '4.96',
    trips: '2,840+ trips',
    tag: 'Most Popular for Family Outstations'
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
    features: ['High Fuel Economy', 'Spacious Legroom', 'Clean Sanitized', 'Music System'],
    rating: '4.92',
    trips: '4,150+ trips',
    tag: 'Budget-Friendly Family MUV'
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
    features: ['Boot Space for Luggage', 'Comfortable Rear Seat', 'Ideal for Couples & Small Families'],
    rating: '4.90',
    trips: '5,920+ trips',
    tag: 'Top Rated for Airport & Intercity'
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
    features: ['One-Touch Tumble Seats', 'Air Purifier', 'Bose Sound System', 'All 4 Disc Brakes'],
    rating: '4.95',
    trips: '1,920+ trips',
    tag: 'Modern Luxury Group Cruiser'
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
    features: ['Wireless Charger', 'Cooled Glovebox', 'Smooth Suspension', 'Rear Fast Type-C'],
    rating: '4.91',
    trips: '3,210+ trips',
    tag: 'Smooth Highway Comfort'
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
    features: ['Tall Roof Comfort', 'Maximum Legroom', 'Super Economical Rates'],
    rating: '4.89',
    trips: '7,400+ trips',
    tag: 'Lowest Price Guaranteed'
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
    features: ['Unbreakable Reliability', 'High Ground Clearance', 'Proven Long Distance Cruiser'],
    rating: '4.93',
    trips: '8,200+ trips',
    tag: 'Legendary Ghats & Pilgrimage Workhorse'
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
    features: ['Reclining Push-Back Seats', 'Individual USB Charging', 'Air Suspension Comfort', 'LED Ambient Lights'],
    rating: '4.97',
    trips: '850+ trips',
    tag: 'VIP Luxury Group Coach'
  }
];

export default function FleetGalleryModal({
  isOpen,
  onClose,
  initialIndex = 0,
  onSelectVehicle
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Keyboard navigation (Esc to close, Left/Right arrows to flip)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const currentVehicle = ALL_FLEET_VEHICLES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ALL_FLEET_VEHICLES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ALL_FLEET_VEHICLES.length) % ALL_FLEET_VEHICLES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 font-display">
                Fleet Photo Gallery ({currentIndex + 1} of {ALL_FLEET_VEHICLES.length})
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Verified photos uploaded by commercial fleet partners
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo & Details Viewer */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          
          {/* Main Large Image Box with Navigation Arrows */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner group">
            <img
              src={currentVehicle.image}
              alt={currentVehicle.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Left Prev Arrow Button */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous car image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow Button */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next car image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Top Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-black text-slate-900 shadow-sm flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-brand-600" />
                <span>{currentVehicle.categoryLabel}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-adventure-500 text-white text-xs font-black shadow-sm">
                {currentVehicle.tag}
              </span>
            </div>

            {/* Bottom Title & Specs on Photo */}
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-black">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{currentVehicle.rating}</span>
                </div>
                <span className="text-xs text-slate-300 font-semibold">({currentVehicle.trips})</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                {currentVehicle.name}
              </h2>
            </div>
          </div>

          {/* Quick Thumbnails Selector Strip */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Browse Fleet Vehicles ({ALL_FLEET_VEHICLES.length} Models)
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {ALL_FLEET_VEHICLES.map((vehicle, idx) => (
                <button
                  key={vehicle.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-24 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'border-brand-600 scale-105 shadow-md ring-2 ring-brand-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30" />
                  <div className="absolute bottom-1 left-1 right-1 text-[9px] font-extrabold text-white truncate text-center drop-shadow-xs">
                    {vehicle.name.split(' ')[1] || vehicle.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Specs & Tariff Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>Seating</span>
              </div>
              <div className="text-xs font-black text-slate-900">{currentVehicle.seating}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-adventure-600" />
                <span>Luggage</span>
              </div>
              <div className="text-xs font-black text-slate-900">{currentVehicle.luggage}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fuel & AC</span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate">{currentVehicle.fuel}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Commercial Tariff</span>
              </div>
              <div className="text-xs font-black text-emerald-600">{currentVehicle.ratePerKm} (0% Markup)</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-600 font-medium">
              Daily Rental: <strong className="text-slate-900 font-black">{currentVehicle.dailyRate}</strong> • Min: {currentVehicle.minKmPerDay}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial py-3 px-5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close Gallery
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onSelectVehicle) onSelectVehicle(currentVehicle);
                }}
                className="flex-1 sm:flex-initial py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-850 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Proceed with {currentVehicle.name.split(' ')[0]} {currentVehicle.name.split(' ')[1]}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
