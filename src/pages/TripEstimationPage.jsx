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
  Car,
  UserCheck,
  MapPin,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  Luggage,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Check,
  Loader2,
  Maximize2
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

// Popular Location Presets
const POPULAR_PICKUPS = [
  'Mumbai Airport (BOM)',
  'Pune - Baner / Hinjewadi',
  'South Mumbai / Colaba',
  'Panaji (Goa)',
  'Ahmedabad Airport',
  'Surat City',
  'Bengaluru Airport (BLR)',
  'Lonavala Town'
];

const POPULAR_DROPS = [
  'Pune City Center',
  'North Goa (Baga / Calangute)',
  'Mahabaleshwar Hills',
  'Lonavala / Khandala',
  'Shirdi Temple',
  'Statue of Unity (Kevadia)',
  'Mysuru Palace',
  'Coorg (Madikeri)'
];

// Distance Matrix for realistic estimation
const ROUTE_DISTANCES = {
  'mumbai-pune': 150,
  'mumbai-goa': 585,
  'mumbai-lonavala': 85,
  'mumbai-mahabaleshwar': 260,
  'mumbai-shirdi': 240,
  'mumbai-surat': 280,
  'pune-goa': 450,
  'pune-mahabaleshwar': 120,
  'pune-lonavala': 65,
  'pune-shirdi': 200,
  'ahmedabad-surat': 270,
  'ahmedabad-statue of unity': 195,
  'bengaluru-mysuru': 145,
  'bengaluru-coorg': 265,
  'goa-gokarna': 160
};

export default function TripEstimationPage({
  user,
  existingTripDetails,
  onProceed,
  onBackToHome,
  onDirectBrowseFleet,
  onSwitchToHireDriver
}) {
  // Service mode is strictly Car + Verified Driver (Cab Rental)
  const serviceMode = 'car_driver';

  // Trip route type: 'one_way' | 'round_trip' | 'multi_city' | 'local_tour'
  const [tripType, setTripType] = useState(
    existingTripDetails?.tripType || 'one_way'
  );

  // Point A (Main Pickup)
  const [pickupLocation, setPickupLocation] = useState(
    existingTripDetails?.pickupLocation || 'Mumbai Airport (BOM)'
  );
  const [pickupCoords, setPickupCoords] = useState(
    () => existingTripDetails?.pickupCoords || getPresetCoords(existingTripDetails?.pickupLocation || 'Mumbai Airport (BOM)') || [72.8746, 19.0896]
  );

  // Additional / En-Route Pickup Locations (Point A2, A3...)
  const [additionalStops, setAdditionalStops] = useState(() => {
    if (!existingTripDetails?.additionalStops) return [];
    return existingTripDetails.additionalStops.map((s, idx) => {
      if (typeof s === 'string') {
        return { id: `stop-${idx}-${Date.now()}`, address: s, coords: getPresetCoords(s) };
      }
      return { id: s.id || `stop-${idx}`, address: s.address || '', coords: s.coords || null };
    });
  });

  // Point B (Final Drop-off)
  const [dropoffLocation, setDropoffLocation] = useState(
    existingTripDetails?.dropoffLocation || 'North Goa (Baga / Calangute)'
  );
  const [dropoffCoords, setDropoffCoords] = useState(
    () => existingTripDetails?.dropoffCoords || getPresetCoords(existingTripDetails?.dropoffLocation || 'North Goa (Baga / Calangute)') || [73.7553, 15.5527]
  );

  // Mapbox Live Route Calculation
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [liveRouteData, setLiveRouteData] = useState(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Travel Schedule
  const [pickupDate, setPickupDate] = useState(
    existingTripDetails?.pickupDate || 'Tomorrow, 07:00 AM'
  );
  const [pickupTimeSlot, setPickupTimeSlot] = useState(
    existingTripDetails?.pickupTimeSlot || '07:00 AM'
  );
  const [returnDate, setReturnDate] = useState(
    existingTripDetails?.returnDate || '3 Days Later'
  );

  // Passengers count
  const [passengers, setPassengers] = useState(
    existingTripDetails?.passengers || 4
  );

  // Luggage count
  const [largeBags, setLargeBags] = useState(
    existingTripDetails?.largeBags || 2
  );
  const [smallBags, setSmallBags] = useState(
    existingTripDetails?.smallBags || 2
  );

  // Vehicle Category Preferred
  const [vehicleCategory, setVehicleCategory] = useState(
    existingTripDetails?.vehicleCategory || 'all'
  );

  // Handle adding an extra pickup/en-route stop
  const handleAddStop = () => {
    if (additionalStops.length < 3) {
      setAdditionalStops((prev) => [
        ...prev,
        { id: `stop-${Date.now()}`, address: '', coords: null }
      ]);
    }
  };

  const handleUpdateStopAddress = (index, value) => {
    setAdditionalStops((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        address: value,
        coords: getPresetCoords(value) || updated[index]?.coords
      };
      return updated;
    });
  };

  const handleUpdateStopCoords = (index, coords) => {
    setAdditionalStops((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        coords
      };
      return updated;
    });
  };

  const handleRemoveStop = (index) => {
    setAdditionalStops((prev) => prev.filter((_, i) => i !== index));
  };

  // Real-time Mapbox Directions Route Calculation
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;

    let isMounted = true;
    const waypoints = additionalStops
      .map((s) => s.coords)
      .filter((c) => Array.isArray(c) && c.length === 2);

    const allCoords = [pickupCoords, ...waypoints, dropoffCoords];

    const fetchRoute = async () => {
      setIsCalculatingRoute(true);
      try {
        const route = await getDrivingRoute(allCoords);
        if (isMounted && route) {
          setLiveRouteData(route);
        }
      } catch (err) {
        console.error('Error calculating live route with Mapbox:', err);
      } finally {
        if (isMounted) setIsCalculatingRoute(false);
      }
    };

    const timer = setTimeout(fetchRoute, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [pickupCoords, dropoffCoords, additionalStops]);

  // Fallback distance calculation if offline or unmapped address
  const fallbackDistance = useMemo(() => {
    const p = pickupLocation.toLowerCase();
    const d = dropoffLocation.toLowerCase();
    
    for (const [route, km] of Object.entries(ROUTE_DISTANCES)) {
      const [fromCity, toCity] = route.split('-');
      if (
        (p.includes(fromCity) && d.includes(toCity)) ||
        (p.includes(toCity) && d.includes(fromCity))
      ) {
        let total = km;
        total += additionalStops.filter((s) => (s.address || s).trim().length > 0).length * 25;
        return total;
      }
    }

    let base = 220;
    if (p.includes('mumbai') && d.includes('goa')) base = 585;
    else if (p.includes('mumbai') && d.includes('pune')) base = 150;
    else if (p.includes('pune') && d.includes('goa')) base = 450;
    else if (p.includes('bengaluru') && d.includes('mysuru')) base = 145;
    else if (p.includes('bengaluru') && d.includes('coorg')) base = 265;
    else if (p.includes('ahmedabad') && d.includes('surat')) base = 270;
    
    base += additionalStops.filter((s) => (s.address || s).trim().length > 0).length * 25;
    return base;
  }, [pickupLocation, dropoffLocation, additionalStops]);

  // Dynamic distance prioritizing Mapbox road distance
  const estimatedDistance = useMemo(() => {
    const baseKm = liveRouteData?.distanceKm || fallbackDistance;
    if (tripType === 'round_trip') {
      return Math.round(baseKm * 1.95);
    }
    return Math.round(baseKm);
  }, [liveRouteData, fallbackDistance, tripType]);

  // Estimated Duration
  const estimatedDuration = useMemo(() => {
    if (liveRouteData?.durationMinutes) {
      let totalMins = liveRouteData.durationMinutes;
      if (tripType === 'round_trip') totalMins = Math.round(totalMins * 1.95);
      const hours = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return hours > 0 ? `${hours} hr ${mins > 0 ? `${mins} min` : ''}` : `${mins} min`;
    }

    const hours = Math.floor(estimatedDistance / 55);
    const mins = Math.round(((estimatedDistance % 55) / 55) * 60);
    return `${hours} hr ${mins > 0 ? `${mins} min` : ''}`;
  }, [liveRouteData, estimatedDistance, tripType]);


  // Recommended Vehicle based on passengers & luggage capacity
  const vehicleRecommendation = useMemo(() => {
    const totalLuggageWeight = largeBags * 2 + smallBags;
    if (passengers > 7 || totalLuggageWeight > 8) {
      return {
        type: 'van',
        title: 'Force Urbania Luxury Van (13-Seater)',
        reason: `Ideal for ${passengers} travelers and ${largeBags} large + ${smallBags} small bags with maximum luggage hold and pushback seats.`
      };
    } else if (passengers >= 5 || largeBags >= 3) {
      return {
        type: 'muv',
        title: 'Toyota Innova Crysta / Maruti Ertiga (7-Seater)',
        reason: `Recommended for ${passengers} passengers + ${largeBags} large bags for spacious luggage boot and dual-AC comfort.`
      };
    } else if (passengers <= 4 && largeBags <= 2) {
      return {
        type: 'sedan',
        title: 'Maruti Dzire / Hyundai Aura (4-Seater)',
        reason: `Perfect economical fit for ${passengers} passengers and ${largeBags} large bags.`
      };
    }
    return {
      type: 'muv',
      title: '7-Seater Family MUV (Innova Crysta / Carens)',
      reason: `Comfortable travel with flexible boot and legroom.`
    };
  }, [passengers, largeBags, smallBags]);

  // Estimated Price Range for Fleet Rental
  const estimatedFare = useMemo(() => {
    let ratePerKm = 12; // average
    if (vehicleCategory === 'sedan') ratePerKm = 10.5;
    else if (vehicleCategory === 'muv') ratePerKm = 14.5;
    else if (vehicleCategory === 'van') ratePerKm = 26;

    const roundMultiplier = tripType === 'round_trip' ? 2 : 1;
    const totalBilledDistance = estimatedDistance * roundMultiplier;
    const minTotal = Math.round(totalBilledDistance * ratePerKm);
    const maxTotal = Math.round(totalBilledDistance * (ratePerKm + 2.5));
    return {
      min: minTotal,
      max: maxTotal,
      label: `₹${minTotal.toLocaleString()} - ₹${maxTotal.toLocaleString()}`,
      unit: `Transparent ${totalBilledDistance} KM Direct Fleet Estimate`
    };
  }, [estimatedDistance, tripType, vehicleCategory]);

  // Prepare submission object, broadcast to backend, and navigate to fleet
  const handleProceedToResults = async () => {
    const finalTripData = {
      serviceMode: 'car_driver',
      tripType,
      pickupLocation,
      pickupCoords,
      additionalStops: additionalStops
        .map((s) => (typeof s === 'string' ? s : s.address))
        .filter((s) => s && s.trim().length > 0),
      dropoffLocation,
      dropoffCoords,
      isLiveMapboxRoute: !!liveRouteData,
      pickupDate,
      pickupTimeSlot,
      returnDate,
      passengers,
      largeBags,
      smallBags,
      vehicleCategory,
      estimatedDistance,
      estimatedDuration,
      estimatedFare,
      vehicleRecommendation,
      travelerName: user?.name || 'Touralink Traveler',
      travelerPhone: user?.phone || '+91 98765 43210'
    };

    try {
      const created = await createTripRequest(finalTripData);
      if (created?.id) finalTripData.tripId = created.id;
    } catch (e) {
      console.error('Error broadcasting trip request to backend:', e);
    }

    if (onProceed) {
      onProceed(finalTripData, 'fleet');
    }
  };

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
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
      </div>

      {/* Foreground Interactive Page Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Frosted Header */}
        <header className="sticky top-0 z-50 bg-white/35 backdrop-blur-2xl saturate-[190%] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 min-h-[88px] flex items-center justify-between">
            {/* Logo */}
            <Logo size="md" />

            {/* Back Button, Switcher & User Info */}
            <div className="flex items-center gap-2.5">
              {onSwitchToHireDriver && (
                <button
                  type="button"
                  onClick={onSwitchToHireDriver}
                  className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-adventure-50 hover:bg-adventure-100 border border-adventure-200 text-xs font-bold text-adventure-900 transition-all cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-4 h-4 text-adventure-600" />
                  <span>Hire Driver (For Your Own Car)</span>
                </button>
              )}

              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-900 shadow-xs hover:bg-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-brand-600" />
                <span>Back to Home</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Commission Booking</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Form & Estimation Experience */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 flex-1 w-full">
          
          {/* Top Headline Banner */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-xs font-black text-brand-700 shadow-xs">
              <Car className="w-3.5 h-3.5 text-brand-600" />
              <span>Outstation & City Cab Rental (Car + Commercial Driver)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
              Plan Your Car & Cab Rental
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Enter your pickup, intermediate stops, passenger count, and luggage to match the best vehicle and verified driver with 0% middleman commission.
            </p>

            {onSwitchToHireDriver && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onSwitchToHireDriver}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-adventure-200 text-xs font-bold text-adventure-800 transition-all cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-adventure-600" />
                  <span>Already own a car & only need a driver? Hire a Personal Chauffeur →</span>
                </button>
              </div>
            )}
          </div>

          {/* Form + Live Estimation 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Interactive Trip Details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Box 1: Route Builder (Point A, Stops, Point B) */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">Route & Pickups</h2>
                      <p className="text-xs text-slate-500 font-medium">Define pickup, en-route stops & final drop</p>
                    </div>
                  </div>

                  {/* Trip Type Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setTripType('one_way')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        tripType === 'one_way' ? 'bg-white text-slate-950 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      One-Way
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('round_trip')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        tripType === 'round_trip' ? 'bg-white text-slate-950 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Round-Trip
                    </button>
                  </div>
                </div>

                {/* Connected Route Line & Inputs with Mapbox Autocomplete */}
                <div className="space-y-4 relative">
                  
                  {/* Point A: Pickup Location */}
                  <LocationAutocompleteInput
                    label="Point A: Pickup Location"
                    pointBadge="A"
                    pointBadgeColor="bg-brand-600"
                    subLabel="Starting Point"
                    subLabelColor="text-brand-700"
                    pinColor="text-brand-600"
                    focusRingColor="focus:ring-brand-500 focus:border-brand-500"
                    value={pickupLocation}
                    placeholder="Enter pickup address, airport, or city"
                    onChange={(val) => {
                      setPickupLocation(val);
                      const preset = getPresetCoords(val);
                      if (preset) setPickupCoords(preset);
                    }}
                    onSelectCoords={(coords) => setPickupCoords(coords)}
                    chips={POPULAR_PICKUPS.slice(0, 4)}
                    activeChipClass="bg-brand-50 text-brand-700 border-brand-300 font-bold"
                  />

                  {/* Additional En-Route Pickup Locations (Point A2, A3...) */}
                  {additionalStops.map((stop, index) => (
                    <div key={stop.id || index} className="pl-3 border-l-2 border-dashed border-amber-300 ml-2.5 animate-fadeIn">
                      <LocationAutocompleteInput
                        label={`Additional Pickup / Via Stop ${index + 1}`}
                        pointBadge={`+${index + 1}`}
                        pointBadgeColor="bg-amber-500"
                        subLabel="En-Route Stop"
                        subLabelColor="text-amber-700"
                        pinColor="text-amber-500"
                        focusRingColor="focus:ring-amber-500 focus:border-amber-500"
                        value={typeof stop === 'string' ? stop : stop.address}
                        placeholder="e.g. Dadar TT Circle / Lonavala Toll / Airport Pickup"
                        onChange={(val) => handleUpdateStopAddress(index, val)}
                        onSelectCoords={(coords) => handleUpdateStopCoords(index, coords)}
                        onRemove={() => handleRemoveStop(index)}
                        chips={['Lonavala Express Toll', 'Navi Mumbai Vashi', 'Khandala Ghat']}
                        activeChipClass="bg-amber-50 text-amber-700 border-amber-300 font-bold"
                      />
                    </div>
                  ))}

                  {/* Add Extra Pickup Stop Button */}
                  {additionalStops.length < 3 && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleAddStop}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200/80 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Pickup Point / En-Route Stop</span>
                      </button>
                    </div>
                  )}

                  {/* Point B: Final Drop-off Location */}
                  <LocationAutocompleteInput
                    label="Point B: Final Destination (Drop-off)"
                    pointBadge="B"
                    pointBadgeColor="bg-emerald-600"
                    subLabel="End Point"
                    subLabelColor="text-emerald-700"
                    pinColor="text-emerald-600"
                    focusRingColor="focus:ring-emerald-500 focus:border-emerald-500"
                    value={dropoffLocation}
                    placeholder="Enter drop-off city, hotel, or landmark"
                    onChange={(val) => {
                      setDropoffLocation(val);
                      const preset = getPresetCoords(val);
                      if (preset) setDropoffCoords(preset);
                    }}
                    onSelectCoords={(coords) => setDropoffCoords(coords)}
                    chips={POPULAR_DROPS.slice(0, 4)}
                    activeChipClass="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                  />

                </div>
              </div>

              {/* Box 2: Travelers, Luggage & Timing */}
              <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl p-5 sm:p-7 space-y-6">
                
                <div className="border-b border-slate-200/60 pb-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-adventure-50 border border-adventure-100 flex items-center justify-center text-adventure-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Passengers, Luggage & Time</h2>
                    <p className="text-xs text-slate-500 font-medium">Ensures proper boot space & comfortable seating</p>
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-600" />
                      <span>Pickup Date</span>
                    </label>
                    <input
                      type="text"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      placeholder="e.g. Tomorrow, 15 Oct"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 shadow-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Pickup Time</span>
                    </label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 shadow-xs cursor-pointer"
                    >
                      <option value="06:00 AM">06:00 AM (Early Ghat Drive)</option>
                      <option value="07:00 AM">07:00 AM (Morning Highway)</option>
                      <option value="09:00 AM">09:00 AM (City Pickup)</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="03:00 PM">03:00 PM (Afternoon)</option>
                      <option value="07:00 PM">07:00 PM (Evening Tour)</option>
                      <option value="10:00 PM">10:00 PM (Overnight Trip)</option>
                    </select>
                  </div>
                </div>

                {/* Passengers & Bags Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  
                  {/* Amount of Persons / Passengers */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-brand-600" />
                        <span>Travelers</span>
                      </span>
                      <span className="text-xs font-black text-brand-600 px-2 py-0.5 rounded-md bg-brand-50">
                        {passengers} Persons
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <div className="text-xl font-black text-slate-900 font-display">
                        {passengers}
                      </div>
                      <button
                        type="button"
                        onClick={() => setPassengers((p) => Math.min(15, p + 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold text-center">
                      {passengers <= 4 ? 'Sedan / Hatchback' : passengers <= 7 ? 'MUV (Innova/Ertiga)' : 'Luxury Van (Urbania)'}
                    </div>
                  </div>

                  {/* Large Bags (Trolleys 24"+) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-adventure-600" />
                        <span>Large Bags</span>
                      </span>
                      <span className="text-xs font-black text-adventure-600 px-2 py-0.5 rounded-md bg-adventure-50">
                        {largeBags} Trolleys
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setLargeBags((b) => Math.max(0, b - 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <div className="text-xl font-black text-slate-900 font-display">
                        {largeBags}
                      </div>
                      <button
                        type="button"
                        onClick={() => setLargeBags((b) => Math.min(10, b + 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold text-center">
                      Full Size Suitcases
                    </div>
                  </div>

                  {/* Small Bags (Cabin / Handbags) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Small Bags</span>
                      </span>
                      <span className="text-xs font-black text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50">
                        {smallBags} Bags
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSmallBags((b) => Math.max(0, b - 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <div className="text-xl font-black text-slate-900 font-display">
                        {smallBags}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSmallBags((b) => Math.min(10, b + 1))}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center text-lg active:scale-95 transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold text-center">
                      Cabin & Backpacks
                    </div>
                  </div>

                </div>

                {/* Vehicle Specific Preferences */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black text-slate-700">
                    Vehicle Class Preference (Optional Filter)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'all', label: 'All Fleet', desc: 'Best fit' },
                      { id: 'sedan', label: 'Sedans', desc: 'Dzire • Aura' },
                      { id: 'muv', label: '7-Seater MUVs', desc: 'Innova • Ertiga' },
                      { id: 'van', label: 'Luxury Van', desc: 'Force Urbania' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setVehicleCategory(item.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          vehicleCategory === item.id
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-2 ring-brand-500/20 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Live Fare Estimation & Recommended Match Card (5 cols) */}
            <div className="lg:col-span-5 space-y-5 sticky top-28">
              
              <div className="rounded-3xl bg-slate-950 text-white shadow-2xl p-6 sm:p-7 space-y-6 border border-slate-800 relative overflow-hidden">
                
                {/* Subtle Amber / Blue Ambient Glow in background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-adventure-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header of Estimation Box */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                      Trip Fare & Distance Estimate
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-full border border-brand-800/60">
                    0% Platform Commission
                  </span>
                </div>

                {/* Journey Summary Visual Badge with Mapbox Route Preview */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-400">Route Summary</div>
                    {liveRouteData ? (
                      <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Mapbox Verified</span>
                      </span>
                    ) : isCalculatingRoute ? (
                      <span className="text-[10px] font-extrabold text-amber-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                        <span>Routing...</span>
                      </span>
                    ) : null}
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

                  
                  <div className="space-y-2 text-xs font-black text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-500 text-slate-950 flex items-center justify-center text-[9px]">A</span>
                      <span className="truncate">{pickupLocation || 'Pickup Point'}</span>
                    </div>

                    {additionalStops
                      .map((s) => (typeof s === 'string' ? s : s.address))
                      .filter((st) => st && st.trim().length > 0)
                      .map((st, i) => (
                        <div key={i} className="flex items-center gap-2 pl-6 text-amber-300 text-[11px] font-semibold">
                          <span>↳ Via {st}</span>
                        </div>
                      ))}

                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[9px]">B</span>
                      <span className="truncate">{dropoffLocation || 'Destination'}</span>
                    </div>
                  </div>

                  {/* Distance & Time Metrics */}
                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white/5 relative">
                      <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                        <span>Road Distance</span>
                        {isCalculatingRoute && <Loader2 className="w-2.5 h-2.5 animate-spin text-brand-400" />}
                      </div>
                      <div className="text-base font-black text-white">{estimatedDistance} KM</div>
                      {liveRouteData ? (
                        <div className="text-[9px] text-emerald-400 font-bold">✓ Live road distance</div>
                      ) : (
                        <div className="text-[9px] text-slate-400 font-medium">Standard matrix</div>
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 relative">
                      <div className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                        <span>Est. Drive Time</span>
                        {isCalculatingRoute && <Loader2 className="w-2.5 h-2.5 animate-spin text-brand-400" />}
                      </div>
                      <div className="text-base font-black text-white">{estimatedDuration}</div>
                      {liveRouteData ? (
                        <div className="text-[9px] text-emerald-400 font-bold">✓ Real-time traffic</div>
                      ) : (
                        <div className="text-[9px] text-slate-400 font-medium">Highway average</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-2 relative z-10">
                  <div className="text-xs font-semibold text-slate-300">
                    Estimated Fleet Rental Rate
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400 tracking-tight">
                    {estimatedFare.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{estimatedFare.unit}</span>
                  </div>
                </div>

                {/* Smart Luggage & Capacity Advisor */}
                <div className="p-3.5 rounded-2xl border space-y-1.5 relative z-10 text-xs bg-brand-950/60 border-brand-800/60">
                  <div className="flex items-center gap-1.5 font-extrabold text-brand-300">
                    <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>Recommended Fleet: {vehicleRecommendation.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                    {vehicleRecommendation.reason}
                  </p>
                </div>

                {/* Primary Proceed CTA Button */}
                <div className="space-y-2.5 pt-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleProceedToResults}
                    className="w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 cursor-pointer group"
                  >
                    <span>View Matching Cars & Cab Rentals</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  {/* Secondary direct skip */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-semibold">
                    <button
                      type="button"
                      onClick={onDirectBrowseFleet}
                      className="hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Browse full fleet catalog
                    </button>
                    <span>Instant Fleet Connect</span>
                  </div>
                </div>

              </div>

              {/* Guarantees Box */}
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-4 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Why travelers choose Touralink Direct:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-slate-600 text-[11px]">
                  <li>0% platform commissions = 20-30% cheaper than aggregator apps</li>
                  <li>Direct UPI payment to verified driver on duty completion</li>
                  <li>Live police background & commercial RTO badge verified</li>
                </ul>
              </div>

            </div>

          </div>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* Interactive Mapbox Route Modal */}
      {isRouteModalOpen && (
        <ErrorBoundary onReset={() => setIsRouteModalOpen(false)}>
          <InteractiveRouteModal
            isOpen={isRouteModalOpen}
            onClose={() => setIsRouteModalOpen(false)}
            pickupLocation={pickupLocation}
            pickupCoords={pickupCoords}
            dropoffLocation={dropoffLocation}
            dropoffCoords={dropoffCoords}
            additionalStops={additionalStops}
            routeData={liveRouteData}
            tripType={tripType}
            allowEV={false}
            showAIPlanner={false}
            onAddStop={(newStop) => {
              setAdditionalStops((prev) => [...prev, newStop]);
            }}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}
