import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  Check,
  Tag,
  ShieldCheck,
  Maximize2,
  Waves,
  Wind,
  Mountain,
  Palmtree,
  Camera,
  Car,
  UserCheck,
  Ticket,
  Copy,
  CheckCircle2,
  Loader2,
  HelpCircle,
  ExternalLink,
  Edit3,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import TripPlannerMapExperience from './TripPlannerMapExperience';
import { getDrivingRoute, getPresetCoords } from '../../services/osmService';
import { generateChatCompletion, isAIConfigured } from '../../services/aiService';

import ErrorBoundary from '../Common/ErrorBoundary';

// Curated Tourism & Adventure Sports with Exclusive Touralink Partner Discounts
export const TOURISM_ACTIVITIES = [
  {
    id: 'scuba_goa',
    title: 'Scuba Diving & Coral Snorkeling',
    location: 'Grande Island, South/North Goa',
    destKey: 'goa',
    coords: [73.7554, 15.3524],
    category: 'Water Sports',
    discountPct: 25,
    originalPrice: 3500,
    discountedPrice: 2625,
    promoCode: 'TLK-SCUBA25',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    description: 'PADI-certified instructor, underwater HD video & photos, and boat safari to Grande Island.',
    icon: Waves
  },
  {
    id: 'paragliding_kamshet',
    title: 'Tandem Paragliding Safari',
    location: 'Kamshet & Panchgani Tableland',
    destKey: 'panchgani',
    coords: [73.5593, 18.7562],
    category: 'Aero Sports',
    discountPct: 20,
    originalPrice: 3200,
    discountedPrice: 2560,
    promoCode: 'TLK-FLY20',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
    description: 'Fly over scenic Sahyadri valleys with international certified pilot & GoPro recording included.',
    icon: Wind
  },
  {
    id: 'rafting_kolad',
    title: 'White Water River Rafting',
    location: 'Kundalika River, Kolad (Maharashtra)',
    destKey: 'kolad',
    coords: [73.3361, 18.4239],
    category: 'Adventure River',
    discountPct: 30,
    originalPrice: 2400,
    discountedPrice: 1680,
    promoCode: 'TLK-RAFT30',
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=600&q=80',
    description: '12 KM thrilling Grade III rapids on dam-released water. Safety gear & buffet lunch voucher.',
    icon: Waves
  },
  {
    id: 'watersports_combo',
    title: '5-in-1 Watersports Adventure Combo',
    location: 'Baga & Calangute Beach, Goa',
    destKey: 'goa',
    coords: [73.7517, 15.5553],
    category: 'Beach Sports',
    discountPct: 25,
    originalPrice: 2800,
    discountedPrice: 2100,
    promoCode: 'TLK-WATER25',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    description: 'Jet Ski, Speed Boat, Banana Ride, Bumper Ride & Parasailing with certified life jackets.',
    icon: Palmtree
  },
  {
    id: 'fort_trekking',
    title: 'Sahyadri Fort Trek & Valley Heritage',
    location: 'Sinhagad, Raigad & Murud-Janjira',
    destKey: 'mahabaleshwar',
    coords: [73.7554, 18.3662],
    category: 'Heritage & Trek',
    discountPct: 20,
    originalPrice: 1500,
    discountedPrice: 1200,
    promoCode: 'TLK-TREK20',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    description: 'Guided heritage walk, Shivaji Maharaj history, traditional Maharashtrian Pitla Bhakri lunch included.',
    icon: Mountain
  },
  {
    id: 'dudhsagar_safari',
    title: 'Dudhsagar Waterfall Jeep Safari',
    location: 'Mollem National Park (Goa-Karnataka)',
    destKey: 'goa',
    coords: [74.3143, 15.3144],
    category: 'Jungle Safari',
    discountPct: 20,
    originalPrice: 2200,
    discountedPrice: 1760,
    promoCode: 'TLK-DUDH20',
    image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=600&q=80',
    description: '4x4 Open Jeep jungle crossing, refreshing natural pool swim with lifejacket & Spice Plantation tour.',
    icon: Mountain
  }
];

const DESTINATION_PRESETS = [
  {
    id: 'goa',
    label: 'North & South Goa (Beaches, Scuba & Water Sports)',
    city: 'North Goa (Baga / Calangute)',
    coords: [73.7517, 15.5553],
    days: 4,
    recommendedActivities: ['scuba_goa', 'watersports_combo', 'dudhsagar_safari']
  },
  {
    id: 'panchgani',
    label: 'Mahabaleshwar & Panchgani (Ghats, Paragliding & Hills)',
    city: 'Mahabaleshwar & Panchgani Ghats',
    coords: [73.6586, 17.9237],
    days: 2,
    recommendedActivities: ['paragliding_kamshet', 'fort_trekking']
  },
  {
    id: 'kolad',
    label: 'Kolad Valley (White Water Rafting & Camping)',
    city: 'Kundalika River, Kolad',
    coords: [73.3361, 18.4239],
    days: 2,
    recommendedActivities: ['rafting_kolad']
  },
  {
    id: 'statue_unity',
    label: 'Statue of Unity & Narmada Valley (Gujarat Heritage)',
    city: 'Statue of Unity (Kevadia)',
    coords: [73.7191, 21.8380],
    days: 3,
    recommendedActivities: []
  }
];

export const FLEET_PRESETS = [
  {
    id: 'innova_crysta',
    name: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    categoryLabel: '7-Seater Premium MUV',
    image: '/images/innova-crysta.jpg',
    seating: '6 + 1 Chauffeur',
    luggage: '4 Large Bags',
    ratePerKm: '₹15 / KM',
    dailyRate: '₹3,200 / Day',
    rating: '4.96',
    features: ['Captain Seats', 'Dual Zone AC', 'Roof Carrier', 'GPS Live Tracked']
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga ZXi+',
    category: 'muv',
    categoryLabel: '7-Seater Family MUV',
    image: '/images/ertiga.jpg',
    seating: '6 + 1 Chauffeur',
    luggage: '3 Bags',
    ratePerKm: '₹12 / KM',
    dailyRate: '₹2,600 / Day',
    rating: '4.92',
    features: ['Spacious Legroom', 'High Fuel Economy', 'Clean Sanitized', 'Dual AC']
  },
  {
    id: 'carens',
    name: 'Kia Carens Prestige Plus',
    category: 'muv',
    categoryLabel: '7-Seater Luxury MUV',
    image: '/images/carens.jpg',
    seating: '6/7 + 1 Chauffeur',
    luggage: '3 Large Bags',
    ratePerKm: '₹13.5 / KM',
    dailyRate: '₹2,900 / Day',
    rating: '4.95',
    features: ['One-Touch Tumble Seats', 'Air Purifier', 'Bose Sound', 'All 4 Disc Brakes']
  },
  {
    id: 'dzire',
    name: 'Maruti Suzuki Dzire Tour S',
    category: 'sedan',
    categoryLabel: '4-Seater Compact Sedan',
    image: '/images/dzire.jpg',
    seating: '4 + 1 Chauffeur',
    luggage: '2 Large Bags',
    ratePerKm: '₹10.5 / KM',
    dailyRate: '₹2,100 / Day',
    rating: '4.90',
    features: ['Spacious 378L Boot', 'Chilled AC', 'Best for Couples & Small Groups']
  },
  {
    id: 'urbania',
    name: 'Force Urbania Luxury Van',
    category: 'van',
    categoryLabel: '13-Seater Luxury Van',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80',
    seating: '12 + 1 Chauffeur',
    luggage: '10+ Bags',
    ratePerKm: '₹26 / KM',
    dailyRate: '₹6,800 / Day',
    rating: '4.97',
    features: ['Reclining Push-Back Seats', 'High Roof Walkthrough', 'Individual USB Charging']
  }
];

export const DRIVER_PRESETS = [
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
    carExpertise: 'Manual & Automatic SUVs • Innova, Ertiga, Fortuner',
    dailyRate: '₹900 / Day',
    rating: '4.98',
    languages: 'Marathi, Hindi, English'
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
    specialty: 'North & South Goa • Dudhsagar • Coastal Highway',
    carExpertise: 'Automatic Sedans, Premium 7-Seaters',
    dailyRate: '₹950 / Day',
    rating: '4.96',
    languages: 'Konkani, Hindi, English, Marathi'
  },
  {
    id: 'praful_patel',
    name: 'Praful Patel',
    location: 'Ahmedabad / Surat (Gujarat)',
    category: 'highway',
    categoryLabel: 'Long Highway & Expressway Expert',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    experience: '16 Years Driving Experience',
    badge: 'Police Verified • GJ-01-9032',
    specialty: 'Statue of Unity • Somnath • Expressway Long Hauls',
    carExpertise: 'All Manual & Automatic Vehicles',
    dailyRate: '₹850 / Day',
    rating: '4.95',
    languages: 'Gujarati, Hindi, English'
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
    specialty: 'Bengaluru ⇄ Coorg • Mysuru Palace • Ooty Hills',
    carExpertise: 'Fortuner 4x4, Innova Crysta, Automatic Cars',
    dailyRate: '₹900 / Day',
    rating: '4.97',
    languages: 'Kannada, Telugu, Hindi, English'
  }
];

export const POPULAR_FLEET_ROUTES = [
  {
    id: 'bom_goa',
    label: 'Mumbai Airport ➔ North Goa (Baga)',
    pickup: 'Mumbai Airport (BOM)',
    pickupCoords: [72.8746, 19.0896],
    dropoff: 'North Goa (Baga / Calangute)',
    dropoffCoords: [73.7553, 15.5527],
    distance: 585,
    duration: '10 hr 35 min'
  },
  {
    id: 'pun_maha',
    label: 'Pune Baner ➔ Mahabaleshwar Ghats',
    pickup: 'Pune - Baner / Hinjewadi',
    pickupCoords: [73.7840, 18.5590],
    dropoff: 'Mahabaleshwar Hills',
    dropoffCoords: [73.6586, 17.9237],
    distance: 120,
    duration: '3 hr 15 min'
  },
  {
    id: 'bom_pune',
    label: 'Mumbai ➔ Pune Expressway',
    pickup: 'South Mumbai / Colaba',
    pickupCoords: [72.8258, 18.9067],
    dropoff: 'Pune City Center',
    dropoffCoords: [73.8567, 18.5204],
    distance: 150,
    duration: '3 hr 10 min'
  },
  {
    id: 'blr_coorg',
    label: 'Bengaluru Airport ➔ Coorg (Madikeri)',
    pickup: 'Bengaluru Airport (BLR)',
    pickupCoords: [77.7066, 13.1986],
    dropoff: 'Coorg (Madikeri)',
    dropoffCoords: [75.7382, 12.4244],
    distance: 265,
    duration: '5 hr 45 min'
  },
  {
    id: 'ahm_sou',
    label: 'Ahmedabad ➔ Statue of Unity (Kevadia)',
    pickup: 'Ahmedabad Airport',
    pickupCoords: [72.6346, 23.0734],
    dropoff: 'Statue of Unity (Kevadia)',
    dropoffCoords: [73.7191, 21.8380],
    distance: 195,
    duration: '3 hr 45 min'
  }
];

export const POPULAR_DRIVER_ROUTES = [
  {
    id: 'pun_maha_drv',
    label: 'Pune ➔ Mahabaleshwar & Panchgani Ghats',
    pickup: 'Pune - Baner / Hinjewadi',
    pickupCoords: [73.7840, 18.5590],
    dropoff: 'Mahabaleshwar & Panchgani Ghats',
    dropoffCoords: [73.6586, 17.9237],
    distance: 120,
    duration: '3 hr 15 min',
    specialty: 'ghats'
  },
  {
    id: 'bom_lonavala_drv',
    label: 'Mumbai ➔ Lonavala & Khandala Ghats',
    pickup: 'Mumbai Airport (BOM)',
    pickupCoords: [72.8746, 19.0896],
    dropoff: 'Lonavala / Khandala',
    dropoffCoords: [73.3667, 18.7615],
    distance: 85,
    duration: '2 hr 10 min',
    specialty: 'ghats'
  },
  {
    id: 'goa_coast_drv',
    label: 'Panaji ➔ Dudhsagar & South Goa',
    pickup: 'Panaji (Goa)',
    pickupCoords: [73.8278, 15.4909],
    dropoff: 'North Goa (Baga / Calangute)',
    dropoffCoords: [73.7553, 15.5527],
    distance: 95,
    duration: '2 hr 40 min',
    specialty: 'coastal'
  },
  {
    id: 'blr_coorg_drv',
    label: 'Bengaluru ➔ Coorg Coffee Estates',
    pickup: 'Bengaluru Airport (BLR)',
    pickupCoords: [77.7066, 13.1986],
    dropoff: 'Coorg (Madikeri)',
    dropoffCoords: [75.7382, 12.4244],
    distance: 260,
    duration: '5 hr 30 min',
    specialty: 'ghats'
  }
];

function isValidCoords(c) {
  return Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1]);
}

export default function CustomTripPlannerSection({
  user,
  tripDetails = null,
  chauffeurDetails = null,
  activeRentalMode = 'car_driver',
  onBookFleetTrip,
  onHireChauffeurTrip,
  onNavigateToEstimate,
  onNavigateToHireDriver,
  onDirectFleet,
  onDirectDrivers,
  onSelectVehicle,
  onSelectDriver,
  onUpdateTripDetails,
  onUpdateChauffeurDetails
}) {
  // Active Source Selection: 'fleet' | 'driver' | 'tourism'
  const [activeSource, setActiveSource] = useState(() => {
    if (activeRentalMode === 'driver_only' || (chauffeurDetails?.selectedDriver && !tripDetails?.selectedVehicle)) {
      return 'driver';
    }
    return 'fleet';
  });

  useEffect(() => {
    if (activeRentalMode === 'driver_only') {
      setActiveSource('driver');
    }
  }, [activeRentalMode]);

  // Handle switching fleet route directly from main page map
  const handleSelectFleetRoute = (routeId) => {
    const routeObj = POPULAR_FLEET_ROUTES.find((r) => r.id === routeId);
    if (!routeObj) return;
    if (onUpdateTripDetails) {
      onUpdateTripDetails({
        pickupLocation: routeObj.pickup,
        pickupCoords: routeObj.pickupCoords,
        dropoffLocation: routeObj.dropoff,
        dropoffCoords: routeObj.dropoffCoords,
        estimatedDistance: routeObj.distance,
        estimatedDuration: routeObj.duration,
        liveRouteData: null
      });
    }
  };

  // Handle switching fleet vehicle directly from main page map
  const handleChooseVehicle = (vehicle) => {
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    }
  };

  // Handle switching driver route directly from main page map
  const handleSelectDriverRoute = (routeId) => {
    const routeObj = POPULAR_DRIVER_ROUTES.find((r) => r.id === routeId);
    if (!routeObj) return;
    if (onUpdateChauffeurDetails) {
      onUpdateChauffeurDetails({
        pickupLocation: routeObj.pickup,
        pickupCoords: routeObj.pickupCoords,
        dropoffLocation: routeObj.dropoff,
        dropoffCoords: routeObj.dropoffCoords,
        estimatedDistance: routeObj.distance,
        estimatedDuration: routeObj.duration,
        selectedSpecialty: routeObj.specialty || 'ghats',
        liveRouteData: null
      });
    }
  };

  // Handle switching driver directly from main page map
  const handleChooseDriver = (driver) => {
    if (onSelectDriver) {
      onSelectDriver(driver);
    }
  };

  // Curated Tourism Circuit State
  const [origin, setOrigin] = useState('Mumbai Airport / Western Suburbs');
  const [originCoords, setOriginCoords] = useState([72.8746, 19.0896]);

  const [selectedDestKey, setSelectedDestKey] = useState('goa');
  const selectedDest = useMemo(
    () => DESTINATION_PRESETS.find((d) => d.id === selectedDestKey) || DESTINATION_PRESETS[0],
    [selectedDestKey]
  );

  const [tripDurationDays, setTripDurationDays] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState(['scuba_goa', 'watersports_combo']);
  const [travelersCount, setTravelersCount] = useState(4);

  // Active Real OSRM driving route state
  const [routeData, setRouteData] = useState(null);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [isInteractiveModalOpen, setIsInteractiveModalOpen] = useState(false);

  // AI Trip Planner State
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiItinerary, setAiItinerary] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // 1. Fleet Trip Data (from tripDetails)
  const fleetOrigin = tripDetails?.pickupLocation || 'Mumbai Airport (BOM)';
  const fleetOriginCoords = useMemo(() => {
    if (isValidCoords(tripDetails?.pickupCoords)) return tripDetails.pickupCoords;
    return getPresetCoords(fleetOrigin) || [72.8746, 19.0896];
  }, [tripDetails, fleetOrigin]);

  const fleetDest = tripDetails?.dropoffLocation || 'North Goa (Baga / Calangute)';
  const fleetDestCoords = useMemo(() => {
    if (isValidCoords(tripDetails?.dropoffCoords)) return tripDetails.dropoffCoords;
    return getPresetCoords(fleetDest) || [73.7553, 15.5527];
  }, [tripDetails, fleetDest]);

  const fleetDistance = tripDetails?.estimatedDistance || 585;
  const fleetDuration = tripDetails?.estimatedDuration || '10 hr 35 min';

  // 2. Driver Trip Data (from chauffeurDetails)
  const driverOrigin = chauffeurDetails?.pickupLocation || 'Pune - Baner / Hinjewadi';
  const driverOriginCoords = useMemo(() => {
    if (isValidCoords(chauffeurDetails?.pickupCoords)) return chauffeurDetails.pickupCoords;
    return getPresetCoords(driverOrigin) || [73.7840, 18.5590];
  }, [chauffeurDetails, driverOrigin]);

  const driverDest = chauffeurDetails?.dropoffLocation || 'Mahabaleshwar & Panchgani Ghats';
  const driverDestCoords = useMemo(() => {
    if (isValidCoords(chauffeurDetails?.dropoffCoords)) return chauffeurDetails.dropoffCoords;
    return getPresetCoords(driverDest) || [73.6586, 17.9237];
  }, [chauffeurDetails, driverDest]);

  const driverDistance = chauffeurDetails?.estimatedDistance || 120;
  const driverDuration = chauffeurDetails?.estimatedDuration || '3 hr 15 min';

  // 3. Tourism Circuit Data
  const tourismOrigin = origin;
  const tourismOriginCoords = originCoords;
  const tourismDest = selectedDest.city;
  const tourismDestCoords = selectedDest.coords;

  // Calculate total savings from selected discounted activities
  const savingsSummary = useMemo(() => {
    let originalTotal = 0;
    let discountedTotal = 0;

    TOURISM_ACTIVITIES.forEach((act) => {
      if (selectedActivities.includes(act.id)) {
        originalTotal += act.originalPrice * travelersCount;
        discountedTotal += act.discountedPrice * travelersCount;
      }
    });

    return {
      originalTotal,
      discountedTotal,
      savings: originalTotal - discountedTotal,
      savingsPercent: originalTotal > 0 ? Math.round(((originalTotal - discountedTotal) / originalTotal) * 100) : 0
    };
  }, [selectedActivities, travelersCount]);

  // Active Map Trip Properties depending on selected tab
  const currentTripData = useMemo(() => {
    if (activeSource === 'fleet') {
      const activeVehicle = tripDetails?.selectedVehicle || FLEET_PRESETS.find(v => v.name === tripDetails?.vehicleRecommendation?.title) || FLEET_PRESETS[0];
      const vehicleTitle = activeVehicle?.name || tripDetails?.vehicleRecommendation?.title || 'Toyota Innova Crysta 2.4 VX';
      const vehicleImage = activeVehicle?.image || tripDetails?.vehicleRecommendation?.image || '/images/innova-crysta.jpg';
      const vehicleCategory = activeVehicle?.categoryLabel || '7-Seater Premium MUV';
      const vehicleRate = activeVehicle?.ratePerKm || '₹15 / KM';
      const numericRate = parseFloat(String(vehicleRate).replace(/[^0-9.]/g, '') || '15');
      const dynamicTotal = tripDetails?.estimatedDistance ? Math.round(tripDetails.estimatedDistance * numericRate) : 8775;

      return {
        id: 'fleet',
        sourceName: 'Selected Fleet Cab Rental',
        badge: '🚗 Selected Fleet Cab',
        pickupLocation: fleetOrigin,
        pickupCoords: fleetOriginCoords,
        dropoffLocation: fleetDest,
        dropoffCoords: fleetDestCoords,
        distance: fleetDistance,
        duration: fleetDuration,
        vehicleTitle,
        vehicleImage,
        vehicleCategory,
        vehicleRate,
        dynamicTotal,
        seating: activeVehicle?.seating || '6 + 1 Chauffeur',
        luggage: activeVehicle?.luggage || '4 Large Bags',
        rating: activeVehicle?.rating || '4.96',
        subtext: activeVehicle?.features ? activeVehicle.features.slice(0, 3).join(' • ') : 'Dedicated verified chauffeur • 0% middleman markup',
        fareLabel: `₹${dynamicTotal.toLocaleString()} (Transparent Estimate)`,
        preRoute: tripDetails?.liveRouteData,
        allowEV: false,
        tripType: tripDetails?.tripType || 'one_way',
        activeVehicleId: activeVehicle?.id || 'innova_crysta'
      };
    }

    if (activeSource === 'driver') {
      const activeDriver = chauffeurDetails?.selectedDriver || DRIVER_PRESETS.find(d => d.name === chauffeurDetails?.assignedDriverName) || DRIVER_PRESETS[0];
      const driverName = activeDriver?.name || chauffeurDetails?.assignedDriverName || 'Ramesh Shinde';
      const driverImage = activeDriver?.image || chauffeurDetails?.assignedDriverImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
      const driverBadge = activeDriver?.badge || chauffeurDetails?.assignedDriverBadge || 'Police Verified • MH-12-8821';
      const driverRate = activeDriver?.dailyRate || chauffeurDetails?.assignedDriverRate || '₹900 / Day';
      const driverSpecialty = activeDriver?.specialty || activeDriver?.categoryLabel || 'Sahyadri Ghats & Hill Roads Specialist';
      const ownCar = chauffeurDetails?.carBrandModel ? `${chauffeurDetails.carBrandModel} (${chauffeurDetails.transmission || 'Automatic'})` : 'Toyota Fortuner 4x4 (Automatic)';

      return {
        id: 'driver',
        sourceName: 'Selected Driver Booking',
        badge: '👨‍✈️ Selected Driver Hire',
        pickupLocation: driverOrigin,
        pickupCoords: driverOriginCoords,
        dropoffLocation: driverDest,
        dropoffCoords: driverDestCoords,
        distance: driverDistance,
        duration: driverDuration,
        driverName,
        driverImage,
        driverBadge,
        driverRate,
        driverSpecialty,
        rating: activeDriver?.rating || '4.98',
        experience: activeDriver?.experience || '14 Years Driving Experience',
        languages: activeDriver?.languages || 'Marathi, Hindi, English',
        vehicleTitle: `${driverName} (Chauffeur for ${ownCar})`,
        subtext: `${driverSpecialty} • Daily Rate: ${driverRate} • 0% Middleman Fee`,
        fareLabel: `${driverRate} Direct Driver Settlement`,
        preRoute: chauffeurDetails?.liveRouteData,
        allowEV: true,
        tripType: 'round_trip',
        activeDriverId: activeDriver?.id || 'ramesh_shinde'
      };
    }

    return {
      id: 'tourism',
      sourceName: 'Curated Tourism Circuit',
      badge: '🏖️ Curated Tourism Passes',
      pickupLocation: tourismOrigin,
      pickupCoords: tourismOriginCoords,
      dropoffLocation: tourismDest,
      dropoffCoords: tourismDestCoords,
      distance: 585,
      duration: 'Scenic Highway Drive',
      vehicleTitle: `${tripDurationDays} Days Outstation Holiday • ${travelersCount} Travelers`,
      subtext: `${selectedActivities.length} Adventure Sports Passes Added • Exclusive Direct Discounts`,
      fareLabel: savingsSummary.savings > 0 ? `₹${savingsSummary.savings.toLocaleString()} Group Savings (${savingsSummary.savingsPercent}% OFF)` : 'Discount Passes Included',
      preRoute: null,
      allowEV: false,
      tripType: 'round_trip'
    };
  }, [
    activeSource,
    fleetOrigin,
    fleetOriginCoords,
    fleetDest,
    fleetDestCoords,
    fleetDistance,
    fleetDuration,
    tripDetails,
    driverOrigin,
    driverOriginCoords,
    driverDest,
    driverDestCoords,
    driverDistance,
    driverDuration,
    chauffeurDetails,
    tourismOrigin,
    tourismOriginCoords,
    tourismDest,
    tourismDestCoords,
    tripDurationDays,
    travelersCount,
    selectedActivities,
    savingsSummary
  ]);

  // Sync destination change
  const handleSelectDestination = (destKey) => {
    setSelectedDestKey(destKey);
    const destObj = DESTINATION_PRESETS.find((d) => d.id === destKey);
    if (destObj) {
      setTripDurationDays(destObj.days);
      if (destObj.recommendedActivities?.length > 0) {
        setSelectedActivities(destObj.recommendedActivities);
      }
    }
  };

  // Toggle activity selection
  const handleToggleActivity = (activityId) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  // Copy promo voucher
  const handleCopyVoucher = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Primitive route key prevents infinite re-render loops from new array references
  const routeKey = `${currentTripData.pickupCoords?.[0]}_${currentTripData.pickupCoords?.[1]}_${currentTripData.dropoffCoords?.[0]}_${currentTripData.dropoffCoords?.[1]}_${currentTripData.preRoute ? 'pre' : 'live'}`;

  // Fetch real OpenStreetMap driving route for current active trip
  useEffect(() => {
    if (!currentTripData.pickupCoords || !currentTripData.dropoffCoords) return;

    if (currentTripData.preRoute?.geometry?.coordinates?.length) {
      setRouteData(currentTripData.preRoute);
      return;
    }

    let isMounted = true;
    setIsRouteLoading(true);

    const waypoints = [currentTripData.pickupCoords, currentTripData.dropoffCoords];

    getDrivingRoute(waypoints)
      .then((data) => {
        if (isMounted && data) {
          setRouteData(data);
        }
      })
      .catch((err) => {
        console.warn('Error fetching route for active trip:', err);
      })
      .finally(() => {
        if (isMounted) setIsRouteLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [routeKey]);

  // Generate AI Custom Tourism & Activity Travel Itinerary
  const handleGenerateAIPlan = async () => {
    setAiGenerating(true);
    setAiItinerary(null);

    const chosenActivityObjects = TOURISM_ACTIVITIES.filter((a) =>
      selectedActivities.includes(a.id)
    );

    const activitiesListText = chosenActivityObjects.map(
      (a) => `• ${a.title} (${a.location}) - Discount Voucher: ${a.promoCode} (${a.discountPct}% OFF, ₹${a.discountedPrice}/person)`
    ).join('\n');

    const prompt = `You are Touralink's Premier Indian Tourism & Adventure Travel Concierge.
Create a personalized, exciting, and realistic day-by-day travel & activity itinerary for this trip:

Selected Trip Mode: ${currentTripData.sourceName}
Vehicle / Configuration: ${currentTripData.vehicleTitle}
Origin: ${currentTripData.pickupLocation}
Destination: ${currentTripData.dropoffLocation}
Duration: ${tripDurationDays} Days
Group Size: ${travelersCount} Travelers
Estimated Highway Drive: ${routeData?.distanceKm || currentTripData.distance} KM (${routeData?.durationFormatted || currentTripData.duration})
Travel Mode: Private Sanitized Vehicle with Dedicated Verified Touralink Chauffeur (0% platform commission)

Selected Adventure & Tourism Activities with Touralink Partner Discounts:
${activitiesListText || '• Sightseeing, local culinary exploration & scenic sunset points'}

Total Activity Group Savings: ₹${savingsSummary.savings.toLocaleString()} (${savingsSummary.savingsPercent}% OFF partner rates)

Please format your response clearly in structured Markdown with:
1. 🌟 **Trip Highlights & Executive Summary** (Why this circuit is unforgettable)
2. 📅 **Day-by-Day Schedule** (Clear morning, afternoon, evening milestones with timing, activity voucher application, and photography stops)
3. 🤿 **Discounted Activity Execution Tips** (Reporting time, instructor contacts, what to wear)
4. 🍽️ **Highway Dining & Driver Tips** (Recommended authentic local dhabas, rest stops, zero-fatigue chauffeur duty notes)
5. 💰 **Transparent Cost Breakdown** (Estimated chauffeur/cab fuel & direct driver settlement with 0% middleman markup)

Keep the tone enthusiastic, practical, well-formatted, and inspiring!`;

    try {
      const response = await generateChatCompletion({
        messages: [
          {
            role: 'system',
            content: 'You are Touralink AI Tourism Concierge. You specialize in crafting high-end, realistic, and budget-optimized Indian road trip itineraries with verified adventure sports and chauffeur coordination.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1100
      });

      setAiItinerary(response?.content || 'Your custom plan has been generated.');
    } catch (err) {
      console.error('Failed to generate AI custom tourism plan:', err);
      setAiItinerary(
        `# ${tripDurationDays}-Day Custom ${currentTripData.dropoffLocation.split(',')[0]} Tourism Itinerary\n\n` +
        `**Origin:** ${currentTripData.pickupLocation} ➔ **Destination:** ${currentTripData.dropoffLocation}\n` +
        `**Mode:** ${currentTripData.sourceName} (${currentTripData.vehicleTitle})\n\n` +
        `### Day 1: Highway Cruise & Arrival\n` +
        `- **06:30 AM**: Chauffeur reporting at ${currentTripData.pickupLocation}. Smooth highway cruising.\n` +
        `- **11:00 AM**: Scenic mid-way expressway brunch at partner food court.\n` +
        `- **03:30 PM**: Check-in and relax.\n\n` +
        `### Day 2: Adventure & Sightseeing Day\n` +
        `- **08:00 AM**: Report for ${chosenActivityObjects[0]?.title || 'Adventure Activities'}. Use voucher code **${chosenActivityObjects[0]?.promoCode || 'TLK-SAVE25'}** at counter for ${chosenActivityObjects[0]?.discountPct || 25}% direct discount.\n` +
        `- **05:00 PM**: Sunset panoramic views and local delicacies.\n\n` +
        `### Day 3: Heritage & Return Journey\n` +
        `- **10:00 AM**: Local souvenir shopping and exploration.\n` +
        `- **02:00 PM**: Comfortable return drive with your verified Touralink chauffeur.`
      );
    } finally {
      setAiGenerating(false);
    }
  };

  // Convert custom plan into actionable Fleet or Driver trip
  const handleProceedBooking = (mode) => {
    const configuredTrip = {
      serviceMode: mode === 'fleet' ? 'car_driver' : 'driver_only',
      pickupLocation: currentTripData.pickupLocation,
      pickupCoords: currentTripData.pickupCoords,
      dropoffLocation: currentTripData.dropoffLocation,
      dropoffCoords: currentTripData.dropoffCoords,
      pickupDate: 'Tomorrow Morning, 06:30 AM',
      pickupTimeSlot: '06:30 AM',
      tripDurationDays: tripDurationDays,
      passengers: travelersCount,
      estimatedDistance: routeData?.distanceKm || currentTripData.distance || 585,
      estimatedDuration: routeData?.durationFormatted || currentTripData.duration || 'Multi-hour drive',
      customActivities: selectedActivities,
      activitySavings: savingsSummary.savings,
      travelerName: user?.name || 'Touralink Traveler',
      travelerPhone: user?.phone || '+91 98765 43210'
    };

    if (mode === 'fleet' && onBookFleetTrip) {
      onBookFleetTrip(configuredTrip);
    } else if (onHireChauffeurTrip) {
      onHireChauffeurTrip(configuredTrip);
    }
  };

  return (
    <section className="relative rounded-3xl overflow-hidden border border-white/50 bg-white/40 backdrop-blur-2xl saturate-[190%] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 sm:p-10 space-y-8 transition-all">
      
      {/* 🏷️ Top Value Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-600/15 via-adventure-600/15 to-emerald-600/15 border border-brand-500/30 text-xs font-black text-brand-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
            <span>Wanna Plan Your Own Trip? We Are Here!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-slate-900 tracking-tight leading-tight">
            Plan a Trip with Us & Get Discounted Prices on <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-adventure-600">Sports & Tourism Activities</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-3xl leading-relaxed">
            Customize your highway circuit, bundle verified scuba diving, paragliding, or white-water river rafting, and lock in exclusive <strong className="text-emerald-700 font-bold">15% to 30% discount passes</strong> with verified drivers.
          </p>
        </div>

        {/* Live Total Savings Capsule */}
        {savingsSummary.savings > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-600/25 flex flex-col justify-between shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100">
                Bundle Pass Savings
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20">
                {savingsSummary.savingsPercent}% OFF
              </span>
            </div>

            <div className="text-2xl font-black tracking-tight mt-1">
              ₹{savingsSummary.savings.toLocaleString()} Saved
            </div>

            <div className="text-[10px] text-emerald-100 font-semibold mt-0.5">
              Direct partner discounts for {travelersCount} travelers
            </div>
          </div>
        )}
      </div>

      {/* 🧭 Trip Source Switcher */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 pl-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Show on Map:
          </span>
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            {currentTripData.sourceName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Fleet Trip Tab */}
          <button
            type="button"
            onClick={() => setActiveSource('fleet')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSource === 'fleet'
                ? 'bg-slate-950 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Car className={`w-3.5 h-3.5 ${activeSource === 'fleet' ? 'text-brand-400' : 'text-slate-500'}`} />
            <span>🚗 Selected Fleet Trip</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              activeSource === 'fleet' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {String(fleetOrigin || 'Mumbai').split(' ')[0]} ➔ {String(fleetDest || 'Goa').split(' ')[0]}
            </span>
          </button>

          {/* Driver Trip Tab */}
          <button
            type="button"
            onClick={() => setActiveSource('driver')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSource === 'driver'
                ? 'bg-adventure-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${activeSource === 'driver' ? 'text-white' : 'text-adventure-600'}`} />
            <span>👨‍✈️ Selected Driver Trip</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
              activeSource === 'driver' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {String(driverOrigin || 'Pune').split(' ')[0]} ➔ {String(driverDest || 'Ghats').split(' ')[0]}
            </span>
          </button>

          {/* Tourism Pass Tab */}
          <button
            type="button"
            onClick={() => setActiveSource('tourism')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeSource === 'tourism'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Ticket className={`w-3.5 h-3.5 ${activeSource === 'tourism' ? 'text-white' : 'text-purple-600'}`} />
            <span>🏖️ Curated Tourism Passes</span>
            {savingsSummary.savings > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeSource === 'tourism' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {savingsSummary.savingsPercent}% OFF
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 🚀 Next-Generation Interactive Map Studio: Main Trip Planner Centerpiece */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase tracking-wider">
                🗺️ Main Trip Planner Map Studio
              </span>
              <span className="text-xs text-slate-500 font-bold">• 100% Free OpenStreetMap & AI Rover Copilot</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-1">
              Interactive Highway & Adventure Route Explorer
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5 max-w-2xl">
              Enter the destination you want to visit first, sync your device GPS, choose your vehicle, and toggle between the <strong>Fastest Expressway</strong> and the <strong>Scenic Mountain Ghats</strong>. Watch Rover AI scout waterfalls, luxury stays, temples, and charging hubs!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-700 shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Fullscreen Google Maps Mode Ready</span>
            </span>
          </div>
        </div>

        {/* Dedicated Next-Gen Map Experience */}
        <TripPlannerMapExperience
          initialDestination={currentTripData.dropoffLocation}
          initialDestCoords={currentTripData.dropoffCoords}
          initialOrigin={currentTripData.pickupLocation}
          initialOriginCoords={currentTripData.pickupCoords}
          initialVehicleType={activeRentalMode === 'driver_only' ? 'ev' : 'petrol_diesel'}
          onSelectRoute={(chosenRoute) => {
            if (chosenRoute) {
              setRouteData(chosenRoute);
            }
          }}
          onAddStopToItinerary={(stop) => {
            if (stop.category === 'sports' || stop.category === 'waterfall') {
              const matchingAct = TOURISM_ACTIVITIES.find(
                (a) =>
                  a.title.toLowerCase().includes(stop.name.toLowerCase().split(' ')[0]) ||
                  stop.name.toLowerCase().includes(a.title.toLowerCase().split(' ')[0])
              );
              if (matchingAct) {
                handleToggleActivity(matchingAct.id);
              }
            }
          }}
        />
      </div>

      {/* 🧭 Dynamic Circuit / Trip Customization Card */}
      {activeSource === 'fleet' ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 border border-brand-200/90 shadow-lg space-y-4">
          {/* Top Row: Route & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-50 text-brand-700 border border-brand-200">
                  SELECTED FLEET ROUTE
                </span>
                <span className="text-xs font-bold text-slate-500">• {currentTripData.distance} KM Highway Drive ({currentTripData.duration})</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={POPULAR_FLEET_ROUTES.find(r => r.pickup === fleetOrigin && r.dropoff === fleetDest)?.id || ''}
                  onChange={(e) => handleSelectFleetRoute(e.target.value)}
                  className="text-base sm:text-lg font-black text-slate-900 bg-transparent outline-none cursor-pointer border-b border-dashed border-brand-400 max-w-full"
                >
                  <option value="" disabled>Custom: {String(fleetOrigin).split(',')[0]} ➔ {String(fleetDest).split(',')[0]}</option>
                  {POPULAR_FLEET_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.distance} KM)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToEstimate && (
                <button
                  type="button"
                  onClick={() => onNavigateToEstimate('car_driver')}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize Route</span>
                </button>
              )}
              {onDirectFleet && (
                <button
                  type="button"
                  onClick={onDirectFleet}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-slate-950 hover:bg-slate-850 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Car className="w-3.5 h-3.5 text-brand-400" />
                  <span>Browse All 8+ Cabs</span>
                </button>
              )}
            </div>
          </div>

          {/* Middle Row: Active Vehicle Spotlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-50/20 to-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentTripData.vehicleImage}
                alt={currentTripData.vehicleTitle}
                className="w-24 h-18 sm:w-28 sm:h-20 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-900">{currentTripData.vehicleTitle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 text-brand-800">
                    {currentTripData.vehicleCategory}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 flex items-center gap-0.5">
                    ★ {currentTripData.rating}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-3">
                  <span>👥 {currentTripData.seating}</span>
                  <span>🧳 {currentTripData.luggage}</span>
                  <span>❄️ Dual AC</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {currentTripData.subtext}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Estimated Cab Fare</span>
                <span className="text-lg sm:text-xl font-black text-slate-900">{String(currentTripData.fareLabel || '').split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 block">Rate: {currentTripData.vehicleRate}</span>
              </div>
              <button
                type="button"
                onClick={() => handleProceedBooking('fleet')}
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Book This Cab</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Quick Vehicle Switcher Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
              Quick Switch Fleet Vehicle:
            </span>
            <div className="flex flex-wrap gap-2">
              {FLEET_PRESETS.map((v) => {
                const isSelected = currentTripData.activeVehicleId === v.id || currentTripData.vehicleTitle.includes(v.name.split(' ')[1] || v.name);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleChooseVehicle(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white shadow-md ring-2 ring-brand-500/50'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Car className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                    <span>{v.name.split(' ')[0]} {v.name.split(' ')[1] || ''}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {v.ratePerKm}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : activeSource === 'driver' ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 border border-adventure-200/90 shadow-lg space-y-4">
          {/* Top Row: Route & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-adventure-50 text-adventure-800 border border-adventure-200">
                  SELECTED CHAUFFEUR HIRE (FOR YOUR OWN CAR)
                </span>
                <span className="text-xs font-bold text-slate-500">• {currentTripData.distance} KM ({currentTripData.duration})</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={POPULAR_DRIVER_ROUTES.find(r => r.pickup === driverOrigin && r.dropoff === driverDest)?.id || ''}
                  onChange={(e) => handleSelectDriverRoute(e.target.value)}
                  className="text-base sm:text-lg font-black text-slate-900 bg-transparent outline-none cursor-pointer border-b border-dashed border-adventure-400 max-w-full"
                >
                  <option value="" disabled>Custom: {String(driverOrigin).split(',')[0]} ➔ {String(driverDest).split(',')[0]}</option>
                  {POPULAR_DRIVER_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.distance} KM)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToHireDriver && (
                <button
                  type="button"
                  onClick={() => onNavigateToHireDriver()}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Car / Specialty</span>
                </button>
              )}
              {onDirectDrivers && (
                <button
                  type="button"
                  onClick={onDirectDrivers}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-adventure-600 hover:bg-adventure-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                  <span>Browse All 12+ Chauffeurs</span>
                </button>
              )}
            </div>
          </div>

          {/* Middle Row: Active Driver Spotlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-adventure-50/20 to-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentTripData.driverImage}
                alt={currentTripData.driverName}
                className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-adventure-500 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-900">{currentTripData.driverName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Badge
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 flex items-center gap-0.5">
                    ★ {currentTripData.rating}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-semibold">
                  {currentTripData.driverSpecialty} • {currentTripData.experience}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Languages: {currentTripData.languages} • Direct Settlement: {currentTripData.driverRate}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Chauffeur Daily Rate</span>
                <span className="text-lg sm:text-xl font-black text-adventure-700">{currentTripData.driverRate}</span>
                <span className="text-[10px] text-emerald-700 font-extrabold block">0% Middleman Fee</span>
              </div>
              <button
                type="button"
                onClick={() => handleProceedBooking('driver')}
                className="px-4 py-2.5 rounded-xl bg-adventure-600 hover:bg-adventure-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Hire This Chauffeur</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Quick Chauffeur Switcher Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
              Quick Switch Verified Chauffeur:
            </span>
            <div className="flex flex-wrap gap-2">
              {DRIVER_PRESETS.map((d) => {
                const isSelected = currentTripData.activeDriverId === d.id || currentTripData.driverName === d.name;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleChooseDriver(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-adventure-600 text-white shadow-md ring-2 ring-adventure-400/50'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-adventure-600'}`} />
                    <span>{d.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {d.categoryLabel.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Pickup / Origin City</span>
            </label>
            <select
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setOriginCoords(getPresetCoords(e.target.value) || [72.8746, 19.0896]);
              }}
              className="w-full text-xs font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
            >
              <option value="Mumbai Airport / Western Suburbs">Mumbai Airport / Western Suburbs</option>
              <option value="Pune - Baner / Hinjewadi">Pune - Baner / Hinjewadi</option>
              <option value="Ahmedabad - SG Highway">Ahmedabad - SG Highway</option>
              <option value="Bengaluru - Whitefield / Airport">Bengaluru - Whitefield / Airport</option>
              <option value="Panaji / North Goa">Panaji / North Goa</option>
            </select>
          </div>

          {/* Destination Vacation Circuit */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-adventure-600" />
              <span>Destination Circuit</span>
            </label>
            <select
              value={selectedDestKey}
              onChange={(e) => handleSelectDestination(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
            >
              {DESTINATION_PRESETS.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.city} ({dest.days} Days)
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Trip Duration</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{tripDurationDays} Days Outstation</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setTripDurationDays(day)}
                    className={`w-6 h-6 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      tripDurationDays === day
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Party Size */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Travelers Party Size</span>
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{travelersCount} Passengers</span>
              <div className="flex items-center gap-1">
                {[2, 4, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTravelersCount(num)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      travelersCount === num
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏄 Step 2: Choose Discounted Sports & Tourism Activities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-adventure-600" />
              <span>Select Discounted Adventure Sports & Tourism Experiences</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Click to include activities in your itinerary. Touralink partner voucher discounts apply directly.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            {selectedActivities.length} Activities Added
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOURISM_ACTIVITIES.map((activity) => {
            const isSelected = selectedActivities.includes(activity.id);
            const IconComp = activity.icon;

            return (
              <div
                key={activity.id}
                onClick={() => handleToggleActivity(activity.id)}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'border-brand-600 bg-white shadow-xl shadow-brand-600/10 ring-2 ring-brand-500/25'
                    : 'border-slate-200 bg-white/80 hover:bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Photo with Overlay Badge */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-md">
                    <Tag className="w-3 h-3" />
                    <span>{activity.discountPct}% OFF PASS</span>
                  </div>

                  {/* Selection Checkmark */}
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-black/40 text-white/60 group-hover:bg-white group-hover:text-slate-900'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {activity.category}
                    </span>
                    <h4 className="text-sm font-black text-white mt-1 drop-shadow-sm leading-tight">
                      {activity.title}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{activity.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>

                  {/* Pricing & Voucher Code Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] line-through text-slate-400 font-semibold mr-1.5">
                        ₹{activity.originalPrice}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{activity.discountedPrice}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold"> /person</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyVoucher(activity.promoCode);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold flex items-center gap-1 transition-colors"
                      title="Copy Partner Promo Code"
                    >
                      {copiedCode === activity.promoCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{activity.promoCode}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📅 Step 3: AI Itinerary Planner & Booking Formulation */}
      <div className="space-y-6 pt-4 border-t border-slate-200/60">

        {/* AI Trip Planner Engine Area (Wide & High Impact) */}
        <div className="rounded-3xl bg-white/90 border border-brand-200/80 p-5 sm:p-7 shadow-xl shadow-brand-500/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                  AI Travel Engine
                </span>
                <span className="text-xs text-slate-400 font-bold">• Powered by Groq AI & OSM Waypoints</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Generate Custom Itinerary & Scheduled Activity Plan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Day-by-day travel schedule incorporating {selectedActivities.length} adventure passes, verified stops, and chauffeur duty timings.
              </p>
            </div>

            <button
              type="button"
              disabled={aiGenerating}
              onClick={handleGenerateAIPlan}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-adventure-600 hover:from-brand-700 hover:to-adventure-700 active:scale-95 text-white font-black text-xs shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Structuring Travel Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Area / Initial Prompt Suggestion */}
          {aiItinerary ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto shadow-inner">
                {aiItinerary}
              </div>

              {/* Action Buttons: Book Car Rental vs Hire Driver with this plan */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleProceedBooking('fleet')}
                  className="w-full sm:w-1/2 py-3.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-850 active:scale-98 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Car className="w-4 h-4 text-brand-400" />
                  <span>Book Cab / Fleet for This Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleProceedBooking('driver')}
                  className="w-full sm:w-1/2 py-3.5 px-5 rounded-xl bg-adventure-600 hover:bg-adventure-700 active:scale-98 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-adventure-200" />
                  <span>Hire Chauffeur for Your Own Car</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-brand-50/30 border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Ready to formulate your customized holiday?
                </h4>
                <p className="text-xs text-slate-600 font-medium max-w-md mx-auto mt-1">
                  Click the button above to generate a day-by-day travel plan with scheduled stops for {selectedActivities.length} adventure activities, highway dining, and driver coordination.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white border border-slate-200 text-slate-700">
                  🤿 Scuba Diving at 25% OFF
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white border border-slate-200 text-slate-700">
                  🪂 Paragliding at 20% OFF
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white border border-slate-200 text-slate-700">
                  🚣 White Water Rafting at 30% OFF
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
