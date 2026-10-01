import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import LocationAutocompleteInput from '../components/Common/LocationAutocompleteInput';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import InteractiveRouteModal from '../components/Common/InteractiveRouteModal';
import RouteMapPreview from '../components/Common/RouteMapPreview';
import { getPresetCoords, getDrivingRoute } from '../services/osmService';
import { createTripRequest } from '../services/tripService';
import {
  UserCheck,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  Check,
  Loader2,
  Maximize2,
  Award,
  Languages,
  Car,
  Compass,
  Zap,
  PhoneCall
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

// Popular Presets for Chauffeur Outstation & Ghat Trips
const CHAUFFEUR_PICKUPS = [
  'Pune - Baner / Hinjewadi',
  'Mumbai (Bandra / Airport)',
  'South Mumbai / Colaba',
  'Panaji (Goa)',
  'Ahmedabad (SG Highway)',
  'Bengaluru (Indiranagar / BLR)',
  'Surat City'
];

const CHAUFFEUR_DROPS = [
  'Mahabaleshwar & Panchgani Ghats',
  'North Goa (Baga / Candolim)',
  'Lonavala / Khandala Hill Station',
  'Coorg Coffee Estates',
  'Shirdi Pilgrimage',
  'Statue of Unity (Kevadia)'
];

const TERRAIN_SPECIALTIES = [
  {
    id: 'ghats',
    title: 'Ghats & Hill Curves',
    desc: 'Expert in hairpin turns, steep climbs, monsoon fog & hill descent braking.',
    icon: '⛰️',
    recommendedFor: 'Mahabaleshwar, Coorg, Lonavala, Amboli Ghat'
  },
  {
    id: 'highway',
    title: 'Long Expressway & Night Drive',
    desc: 'Smooth high-speed cruising, lane discipline, overtaking safety & fatigue resistance.',
    icon: '🛣️',
    recommendedFor: 'Mumbai-Goa, Samruddhi, National Highways'
  },
  {
    id: 'coastal',
    title: 'Coastal & Sightseeing',
    desc: 'Calm, patient chauffeur with local knowledge of scenic spots & beach routes.',
    icon: '🌴',
    recommendedFor: 'Goa, Konkan, Gokarna Coastal Corridor'
  },
  {
    id: 'luxury',
    title: 'Luxury / Automatic Sedan & SUV',
    desc: 'Skilled in high-end electronic suspensions, 4x4 automatic modes & VIP etiquette.',
    icon: '✨',
    recommendedFor: 'Mercedes, BMW, Audi, Fortuner, Lexus'
  }
];

export default function HireChauffeurPage({
  user,
  existingChauffeurDetails,
  onProceed,
  onBackToHome,
  onDirectBrowseDrivers,
  onSwitchToCarRental
}) {
  // Route state
  const [pickupLocation, setPickupLocation] = useState(
    existingChauffeurDetails?.pickupLocation || 'Pune - Baner / Hinjewadi'
  );
  const [pickupCoords, setPickupCoords] = useState(
    () => existingChauffeurDetails?.pickupCoords || getPresetCoords('Pune - Baner / Hinjewadi') || [73.7840, 18.5590]
  );

  const [dropoffLocation, setDropoffLocation] = useState(
    existingChauffeurDetails?.dropoffLocation || 'Mahabaleshwar & Panchgani Ghats'
  );
  const [dropoffCoords, setDropoffCoords] = useState(
    () => existingChauffeurDetails?.dropoffCoords || getPresetCoords('Mahabaleshwar Hills') || [73.6586, 17.9237]
  );

  // Traveler's Own Vehicle Details
  const [carBrandModel, setCarBrandModel] = useState(
    existingChauffeurDetails?.carBrandModel || 'Toyota Fortuner 4x4'
  );
  const [carType, setCarType] = useState(
    existingChauffeurDetails?.carType || 'suv'
  );
  const [transmission, setTransmission] = useState(
    existingChauffeurDetails?.transmission || 'automatic'
  );

  // Drive Terrain & Chauffeur Specialty Preferred
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    existingChauffeurDetails?.selectedSpecialty || 'ghats'
  );

  // Schedule & Duty Duration
  const [pickupDate, setPickupDate] = useState(
    existingChauffeurDetails?.pickupDate || 'Tomorrow Morning, 06:30 AM'
  );
  const [tripDurationDays, setTripDurationDays] = useState(
    existingChauffeurDetails?.tripDurationDays || 2
  );
  const [isOutstationNightStay, setIsOutstationNightStay] = useState(
    existingChauffeurDetails?.isOutstationNightStay !== undefined
      ? existingChauffeurDetails.isOutstationNightStay
      : true
  );

  // Preferred Driver Languages
  const [preferredLanguage, setPreferredLanguage] = useState(
    existingChauffeurDetails?.preferredLanguage || 'Marathi & Hindi'
  );

  // Mapbox Live Route State
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [liveRouteData, setLiveRouteData] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Calculate live road route with Mapbox
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;

    let isMounted = true;
    const fetchRoute = async () => {
      setIsCalculatingRoute(true);
      try {
        const route = await getDrivingRoute([pickupCoords, dropoffCoords]);
        if (isMounted && route) {
          setLiveRouteData(route);
        }
      } catch (err) {
        console.error('Error fetching Mapbox route for chauffeur:', err);
      } finally {
        if (isMounted) setIsCalculatingRoute(false);
      }
    };

    const timer = setTimeout(fetchRoute, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pickupCoords, dropoffCoords]);

  // Road distance and duration
  const estimatedDistance = useMemo(() => {
    if (liveRouteData?.distanceKm) {
      return Math.round(liveRouteData.distanceKm * (tripDurationDays > 1 ? 2 : 1));
    }
    return 260; // fallback
  }, [liveRouteData, tripDurationDays]);

  const estimatedDriveTime = useMemo(() => {
    if (liveRouteData?.durationFormatted) {
      return liveRouteData.durationFormatted;
    }
    return '3 hr 30 min';
  }, [liveRouteData]);


  // Transparent Daily Chauffeur Wage Calculation (0% platform markup)
  const estimatedWage = useMemo(() => {
    const baseDailyRate = 950;
    const nightAllowance = isOutstationNightStay ? (tripDurationDays - 1) * 300 : 0;
    const ghatsBonus = selectedSpecialty === 'ghats' ? 150 : 0;

    const total = baseDailyRate * tripDurationDays + nightAllowance + ghatsBonus;
    return {
      total,
      breakdown: `₹${baseDailyRate}/Day × ${tripDurationDays} Days${
        nightAllowance > 0 ? ` + ₹${nightAllowance} Night Allowance` : ''
      }`,
      label: `₹${total.toLocaleString()}`
    };
  }, [tripDurationDays, isOutstationNightStay, selectedSpecialty]);

  // Proceed to verified drivers directory
  const handleProceedToDrivers = async () => {
    const chauffeurTripData = {
      serviceMode: 'driver_only',
      tripType: tripDurationDays > 1 ? 'round_trip' : 'one_way',
      pickupLocation,
      pickupCoords,
      dropoffLocation,
      dropoffCoords,
      carBrandModel,
      carType,
      transmission,
      selectedSpecialty,
      pickupDate,
      tripDurationDays,
      isOutstationNightStay,
      preferredLanguage,
      estimatedDistance,
      estimatedDuration: estimatedDriveTime,
      estimatedFare: {
        label: estimatedWage.label,
        min: estimatedWage.total,
        max: estimatedWage.total + 300,
        unit: `${tripDurationDays} Days Outstation Chauffeur Duty`
      },
      travelerName: user?.name || 'Personal Car Owner',
      travelerPhone: user?.phone || '+91 98220 55410',
      createdAt: new Date().toISOString()
    };

    try {
      const created = await createTripRequest(chauffeurTripData);
      if (created?.id) chauffeurTripData.tripId = created.id;
    } catch (e) {
      console.error('Error broadcasting chauffeur request to backend:', e);
    }

    if (onProceed) {
      onProceed(chauffeurTripData, 'drivers');
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-slate-900 selection:bg-adventure-500 selection:text-white">
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
        <div className="absolute inset-0 bg-slate-900/15 pointer-events-none" />
      </div>

      {/* Foreground Interactive Page Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Frosted Header */}
        <header className="sticky top-0 z-50 bg-white/35 backdrop-blur-2xl saturate-[190%] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 min-h-[88px] flex items-center justify-between">
            <Logo size="md" />

            <div className="flex items-center gap-2.5">
              {onSwitchToCarRental && (
                <button
                  type="button"
                  onClick={onSwitchToCarRental}
                  className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-50 hover:bg-brand-100 border border-brand-200 text-xs font-bold text-brand-900 transition-all cursor-pointer shadow-xs"
                >
                  <Car className="w-4 h-4 text-brand-600" />
                  <span>Rent a Car + Driver</span>
                </button>
              )}

              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-900 shadow-xs hover:bg-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-adventure-600" />
                <span>Back to Home</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Police Verified Chauffeurs</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 flex-1 w-full">
          
          {/* Top Banner */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-xs font-black text-adventure-700 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-adventure-600" />
              <span>Hire a Personal Chauffeur For Your Own Car</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
              Match an Expert Chauffeur for Your Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Specify your car model, transmission, travel dates, and terrain specialty to hire a trusted, verified chauffeur with 0% platform commission.
            </p>

            {onSwitchToCarRental && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onSwitchToCarRental}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-brand-200 text-xs font-bold text-brand-800 transition-all cursor-pointer shadow-xs"
                >
                  <Car className="w-3.5 h-3.5 text-brand-600" />
                  <span>Need a complete vehicle + driver instead? Rent a Car & Cab →</span>
                </button>
              </div>
            )}
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Chauffeur Requirements Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 1: Your Car Details */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-adventure-50 border border-adventure-100 flex items-center justify-center text-adventure-600">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">Your Vehicle Details</h2>
                      <p className="text-xs text-slate-500 font-medium">Ensures chauffeur is skilled in your specific transmission and car size</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-adventure-700 bg-adventure-50 px-2.5 py-1 rounded-lg border border-adventure-200/60">
                    Your Personal Vehicle
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Car Brand & Model Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">
                      Car Brand & Model
                    </label>
                    <input
                      type="text"
                      value={carBrandModel}
                      onChange={(e) => setCarBrandModel(e.target.value)}
                      placeholder="e.g. Toyota Fortuner 4x4, Mercedes E-Class, Hyundai Creta, Honda City"
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-adventure-500 focus:outline-hidden transition-all shadow-xs"
                    />
                    {/* Quick Car Type Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Toyota Fortuner', 'Innova Crysta', 'Mahindra XUV700', 'Honda City', 'Mercedes / BMW', 'Hyundai Creta'].map((car) => (
                        <button
                          key={car}
                          type="button"
                          onClick={() => setCarBrandModel(car)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            carBrandModel.includes(car)
                              ? 'bg-adventure-50 text-adventure-700 border-adventure-300 font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {car}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transmission & Body Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">
                        Gearbox / Transmission
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTransmission('automatic')}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            transmission === 'automatic'
                              ? 'bg-adventure-600 text-white border-adventure-600 shadow-sm'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Automatic (AT / DCT)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransmission('manual')}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            transmission === 'manual'
                              ? 'bg-adventure-600 text-white border-adventure-600 shadow-sm'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          Manual Gearbox
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700">
                        Body Style
                      </label>
                      <select
                        value={carType}
                        onChange={(e) => setCarType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 shadow-xs cursor-pointer"
                      >
                        <option value="suv">SUV / MUV (Fortuner, Innova, Scorpio, XUV)</option>
                        <option value="sedan">Sedan (City, Ciaz, Verna, Dzire)</option>
                        <option value="luxury">Luxury / European (Mercedes, BMW, Audi)</option>
                        <option value="hatchback">Hatchback (Swift, Baleno, i20)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Route & Mapbox Autocomplete */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Trip Route & Destinations</h2>
                    <p className="text-xs text-slate-500 font-medium">Where will your chauffeur take the wheel?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Point A: Pickup Location */}
                  <LocationAutocompleteInput
                    label="Point A: Driver Pickup Location"
                    pointBadge="A"
                    pointBadgeColor="bg-adventure-600"
                    subLabel="Pickup Address"
                    subLabelColor="text-adventure-700"
                    pinColor="text-adventure-600"
                    focusRingColor="focus:ring-adventure-500 focus:border-adventure-500"
                    value={pickupLocation}
                    placeholder="Enter pickup society, landmark, or city"
                    onChange={(val) => {
                      setPickupLocation(val);
                      const preset = getPresetCoords(val);
                      if (preset) setPickupCoords(preset);
                    }}
                    onSelectCoords={(coords) => setPickupCoords(coords)}
                    chips={CHAUFFEUR_PICKUPS.slice(0, 4)}
                    activeChipClass="bg-adventure-50 text-adventure-700 border-adventure-300 font-bold"
                  />

                  {/* Point B: Final Destination */}
                  <LocationAutocompleteInput
                    label="Point B: Destination / Outstation Route"
                    pointBadge="B"
                    pointBadgeColor="bg-emerald-600"
                    subLabel="Outstation Destination"
                    subLabelColor="text-emerald-700"
                    pinColor="text-emerald-600"
                    focusRingColor="focus:ring-emerald-500 focus:border-emerald-500"
                    value={dropoffLocation}
                    placeholder="Enter hill station, outstation city, or circuit"
                    onChange={(val) => {
                      setDropoffLocation(val);
                      const preset = getPresetCoords(val);
                      if (preset) setDropoffCoords(preset);
                    }}
                    onSelectCoords={(coords) => setDropoffCoords(coords)}
                    chips={CHAUFFEUR_DROPS.slice(0, 4)}
                    activeChipClass="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                  />
                </div>
              </div>

              {/* Box 3: Driving Specialty & Terrain */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Driver Skill Specialty</h2>
                    <p className="text-xs text-slate-500 font-medium">Matches drivers with specific road certifications</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TERRAIN_SPECIALTIES.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setSelectedSpecialty(spec.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedSpecialty === spec.id
                          ? 'bg-adventure-50/80 border-adventure-500 ring-2 ring-adventure-500/20 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{spec.icon}</span>
                          <span className="text-xs font-black text-slate-900">{spec.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                          {spec.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-[10px] text-adventure-700 font-extrabold">
                        Best for: {spec.recommendedFor}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Box 4: Travel Schedule & Driver Preferences */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Duty Dates & Allowances</h2>
                    <p className="text-xs text-slate-500 font-medium">Fixed daily rate with transparent driver allowances</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-adventure-600" />
                      <span>Start Date & Time</span>
                    </label>
                    <input
                      type="text"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      placeholder="e.g. Tomorrow, 06:30 AM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700">
                      Duration (Days)
                    </label>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setTripDurationDays((d) => Math.max(1, d - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-base cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-slate-900 font-display">
                        {tripDurationDays} {tripDurationDays > 1 ? 'Days' : 'Day'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTripDurationDays((d) => Math.min(15, d + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-base cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-brand-600" />
                      <span>Language</span>
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 shadow-xs cursor-pointer"
                    >
                      <option value="Marathi & Hindi">Marathi & Hindi</option>
                      <option value="Hindi & English">Hindi & English</option>
                      <option value="Gujarati & Hindi">Gujarati & Hindi</option>
                      <option value="Konkani & Marathi">Konkani & Marathi</option>
                      <option value="Kannada & English">Kannada & English</option>
                    </select>
                  </div>
                </div>

                {/* Night Stay Allowance Checkbox */}
                {tripDurationDays > 1 && (
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOutstationNightStay}
                      onChange={(e) => setIsOutstationNightStay(e.target.checked)}
                      className="w-4 h-4 rounded text-adventure-600 focus:ring-adventure-500 cursor-pointer"
                    />
                    <div className="text-xs">
                      <div className="font-extrabold text-slate-900">
                        Include Outstation Night Stay Allowance (₹300 / Night)
                      </div>
                      <div className="text-slate-500 font-medium">
                        Standard driver meal & resting allowance for multi-day outstation circuits.
                      </div>
                    </div>
                  </label>
                )}
              </div>

            </div>

            {/* Right Column: Live Route & Transparent Driver Wage Card (5 cols) */}
            <div className="lg:col-span-5 space-y-5 sticky top-28">
              
              <div className="rounded-3xl bg-slate-950 text-white shadow-2xl p-6 sm:p-7 space-y-6 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-adventure-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                      Chauffeur Duty Summary
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-adventure-400 bg-adventure-950/80 px-2.5 py-1 rounded-full border border-adventure-800/60">
                    Direct Driver Payment
                  </span>
                </div>

                {/* Journey & Vehicle Summary Badge */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Route & Your Vehicle</span>
                    <span className="text-adventure-400 font-extrabold uppercase text-[10px]">
                      {transmission}
                    </span>
                  </div>

                  {/* OpenStreetMap Route Preview with Click-to-Zoom */}
                  {pickupCoords && dropoffCoords ? (
                    <RouteMapPreview
                      startCoords={pickupCoords}
                      endCoords={dropoffCoords}
                      routeGeometry={liveRouteData?.geometry}
                      onClick={() => setIsRouteModalOpen(true)}
                    />
                  ) : null}


                  <div className="space-y-1.5 text-xs font-black text-white pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-adventure-500 text-slate-950 flex items-center justify-center text-[9px]">A</span>
                      <span className="truncate">{pickupLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[9px]">B</span>
                      <span className="truncate">{dropoffLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-adventure-300 text-[11px] font-bold pt-1">
                      <Car className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{carBrandModel} ({transmission.toUpperCase()})</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-xl bg-white/5">
                      <div className="text-[10px] text-slate-400 font-semibold">Est. Distance</div>
                      <div className="text-base font-black text-white">{estimatedDistance} KM</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5">
                      <div className="text-[10px] text-slate-400 font-semibold">Drive Time</div>
                      <div className="text-base font-black text-white">{estimatedDriveTime}</div>
                    </div>
                  </div>
                </div>

                {/* Direct Chauffeur Wage */}
                <div className="space-y-1.5 relative z-10">
                  <div className="text-xs font-semibold text-slate-300">
                    Transparent Chauffeur Wage ({tripDurationDays} Days)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400 tracking-tight">
                    {estimatedWage.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {estimatedWage.breakdown} • Paid directly to driver via UPI
                  </div>
                </div>

                {/* Match Advice */}
                <div className="p-3.5 rounded-2xl bg-adventure-950/60 border border-adventure-800/60 space-y-1.5 relative z-10 text-xs">
                  <div className="flex items-center gap-1.5 font-extrabold text-adventure-300">
                    <Sparkles className="w-4 h-4 text-adventure-400 shrink-0" />
                    <span>Specialty Match: {selectedSpecialty.toUpperCase()} Expert</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                    Filtering drivers tested in {carBrandModel}'s {transmission} controls, hill safety, and night driving endurance.
                  </p>
                </div>

                {/* Primary Proceed CTA Button */}
                <div className="space-y-2.5 pt-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleProceedToDrivers}
                    className="w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-adventure-300 to-emerald-400 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer group"
                  >
                    <span>View Verified Chauffeurs</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-semibold">
                    <button
                      type="button"
                      onClick={onDirectBrowseDrivers}
                      className="hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Browse full chauffeur list
                    </button>
                    <span>100% Police Verified</span>
                  </div>
                </div>

              </div>

              {/* Guarantees Box */}
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-4 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-adventure-600" />
                  <span>Chauffeur Hire Guarantees:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-slate-600 text-[11px]">
                  <li>0% platform commissions — direct driver UPI payout on completion</li>
                  <li>Live police background check & valid Indian commercial driving badge</li>
                  <li>Tested on hairpin ghats, expressways & luxury automatic transmissions</li>
                </ul>
              </div>

            </div>

          </div>

        </main>

        <Footer />

      </div>

      {/* Interactive Map Modal */}
      {isRouteModalOpen && (
        <ErrorBoundary onReset={() => setIsRouteModalOpen(false)}>
          <InteractiveRouteModal
            isOpen={isRouteModalOpen}
            onClose={() => setIsRouteModalOpen(false)}
            pickupLocation={pickupLocation}
            pickupCoords={pickupCoords}
            dropoffLocation={dropoffLocation}
            dropoffCoords={dropoffCoords}
            additionalStops={[]}
            routeData={liveRouteData}
            tripType={tripDurationDays > 1 ? 'round_trip' : 'one_way'}
            allowEV={false}
            showAIPlanner={false}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
