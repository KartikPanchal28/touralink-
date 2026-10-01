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
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Maximize2,
  Minimize2,
  Camera,
  Layers,
  ZoomIn,
  SlidersHorizontal
} from 'lucide-react';

export const ALL_FLEET_VEHICLES = [
  {
    id: 'innova_crysta',
    name: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    categoryLabel: '7-Seater Premium MUV',
    image: '/images/innova-crysta.jpg',
    gallery: [
      { label: 'Exterior', url: '/images/innova-crysta.jpg' },
      { label: 'Rear Profile', url: '/images/innova-crysta-2.jpg' },
      { label: 'Cabin Luxury', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80' }
    ],
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
    gallery: [
      { label: 'Exterior', url: '/images/ertiga.jpg' },
      { label: '7-Seat Cabin', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Fleet Standard', url: '/images/car-fleet-images.jpg' }
    ],
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
    gallery: [
      { label: 'Exterior', url: '/images/dzire.jpg' },
      { label: 'Passenger Cabin', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80' }
    ],
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
    name: 'Kia Carens Prestige Plus',
    category: 'muv',
    categoryLabel: '7-Seater Luxury MUV',
    image: '/images/carens.jpg',
    gallery: [
      { label: 'Exterior', url: '/images/carens.jpg' },
      { label: 'Luxury Interior', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' }
    ],
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
    gallery: [
      { label: 'Exterior', url: '/images/aura.jpg' },
      { label: 'Executive Cockpit', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' }
    ],
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
    gallery: [
      { label: 'Exterior', url: '/images/wagonr.jpg' },
      { label: 'Spacious Cabin', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80' }
    ],
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
    gallery: [
      { label: 'Exterior', url: '/images/old-innova.jpg' },
      { label: 'Rear Cargo View', url: '/images/innova-crysta-2.jpg' }
    ],
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
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      { label: 'Luxury Coach View', url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Fleet Overview', url: '/images/car-fleet-images.jpg' }
    ],
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
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [fitMode, setFitMode] = useState('contain'); // 'contain' (Whole car visible, no crop) | 'cover' (Fill frame)
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setActiveAngleIndex(0);
    setIsImageLoading(true);
  }, [initialIndex, isOpen]);

  // Reset angle index and loading when switching vehicles
  const handleSelectVehicleIndex = (idx) => {
    setCurrentIndex(idx);
    setActiveAngleIndex(0);
    setIsImageLoading(true);
  };

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
  }, [isOpen, currentIndex, activeAngleIndex]);

  if (!isOpen) return null;

  const currentVehicle = ALL_FLEET_VEHICLES[currentIndex];
  const photoGallery = currentVehicle.gallery && currentVehicle.gallery.length > 0
    ? currentVehicle.gallery
    : [{ label: 'Exterior', url: currentVehicle.image }];

  const currentPhoto = photoGallery[activeAngleIndex] || photoGallery[0];
  const currentPhotoUrl = currentPhoto.url || currentVehicle.image;

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % ALL_FLEET_VEHICLES.length;
    handleSelectVehicleIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + ALL_FLEET_VEHICLES.length) % ALL_FLEET_VEHICLES.length;
    handleSelectVehicleIndex(prevIdx);
  };

  const toggleFitMode = () => {
    setFitMode(prev => (prev === 'contain' ? 'cover' : 'contain'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 font-display">
                  Fleet Showcase ({currentIndex + 1} of {ALL_FLEET_VEHICLES.length})
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  HD Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Verified high-resolution photos of commercial fleet vehicles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fit / Fill Mode Toggle Button */}
            <button
              onClick={toggleFitMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={fitMode === 'contain' ? 'Switch to Fill/Zoom View' : 'Switch to Full Vehicle Fit (No Crop)'}
            >
              {fitMode === 'contain' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
                  <span className="hidden sm:inline">Fit Whole Car</span>
                  <span className="sm:hidden">Fit</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-adventure-600" />
                  <span className="hidden sm:inline">Fill Window</span>
                  <span className="sm:hidden">Fill</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close Gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Photo & Details Viewer */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          
          {/* Main Photo Cinema Stage with Dual-Layer Studio Presentation */}
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group flex items-center justify-center">
            
            {/* Layer 1: Ambient Blurred Backdrop to fill negative space smoothly */}
            <img
              src={currentPhotoUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-125 select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90 pointer-events-none" />

            {/* Layer 2: Skeleton Loader while image is downloading */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs z-10 animate-pulse">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Car className="w-8 h-8 animate-bounce text-brand-400" />
                  <span className="text-xs font-semibold">Loading crystal-clear vehicle view...</span>
                </div>
              </div>
            )}

            {/* Layer 3: Foreground Main Vehicle Photo with Auto-Fit */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
              <img
                key={`${currentVehicle.id}-${activeAngleIndex}-${fitMode}`}
                src={currentPhotoUrl}
                alt={`${currentVehicle.name} - ${currentPhoto.label}`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
                className={`max-w-full max-h-full transition-all duration-300 ${
                  fitMode === 'contain'
                    ? 'object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]'
                    : 'w-full h-full object-cover'
                } ${isImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              />
            </div>

            {/* Left Prev Arrow Button */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous car model"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Next Arrow Button */}
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next car model"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Top Badges Overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-black text-slate-900 shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
                <Car className="w-3.5 h-3.5 text-brand-600" />
                <span>{currentVehicle.categoryLabel}</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-adventure-500 text-white text-xs font-black shadow-sm">
                {currentVehicle.tag}
              </span>
            </div>

            {/* Interactive Framing Mode Badge (Clickable) */}
            <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5">
              <button
                onClick={toggleFitMode}
                className="px-2.5 py-1 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white text-[11px] font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3 text-brand-400" />
                <span>{fitMode === 'contain' ? 'Full View: No Crop' : 'Zoomed View'}</span>
              </button>
            </div>

            {/* Bottom Multi-Angle Photo Switcher (Exterior, Cabin, Boot) */}
            {photoGallery.length > 1 && (
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-xl">
                {photoGallery.map((photo, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setActiveAngleIndex(pIdx);
                      setIsImageLoading(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      activeAngleIndex === pIdx
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>{photo.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Vehicle Title & Rating on Stage */}
            <div className="absolute bottom-4 left-4 z-20 text-white space-y-1 pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-black">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{currentVehicle.rating}</span>
                </div>
                <span className="text-xs text-slate-300 font-semibold drop-shadow-sm">({currentVehicle.trips})</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                {currentVehicle.name}
              </h2>
            </div>

          </div>

          {/* Quick Thumbnails Selector Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Select Vehicle Model ({ALL_FLEET_VEHICLES.length} Available)</span>
              <span className="text-brand-600 font-bold capitalize">
                Showing: {currentVehicle.name}
              </span>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {ALL_FLEET_VEHICLES.map((vehicle, idx) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleSelectVehicleIndex(idx)}
                  className={`group relative shrink-0 w-28 sm:w-32 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-900 ${
                    idx === currentIndex
                      ? 'border-brand-500 scale-105 shadow-lg shadow-brand-500/20 ring-2 ring-brand-500/30'
                      : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  <div className="relative h-16 sm:h-20 w-full flex items-center justify-center p-1 bg-gradient-to-b from-slate-800 to-slate-950">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-1.5 bg-white text-left">
                    <div className="text-[10px] font-black text-slate-900 truncate">
                      {vehicle.name.split(' ')[0]} {vehicle.name.split(' ')[1] || ''}
                    </div>
                    <div className="text-[9px] font-extrabold text-emerald-600">
                      {vehicle.ratePerKm}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Specs & Commercial Tariff Details */}
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
              <div className="text-xs font-black text-emerald-600">{currentVehicle.ratePerKm} (0% Commission)</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-600 font-medium">
              Daily Outstation Rate: <strong className="text-slate-900 font-black">{currentVehicle.dailyRate}</strong> • Min: {currentVehicle.minKmPerDay}
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
                <span>Select {currentVehicle.name.split(' ')[0]} {currentVehicle.name.split(' ')[1] || ''}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
