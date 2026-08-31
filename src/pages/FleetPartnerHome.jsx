import React, { useState } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import {
  Car,
  Building2,
  Users,
  ShieldCheck,
  Star,
  Sparkles,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  LogOut,
  PhoneCall,
  IndianRupee,
  Calendar,
  Filter,
  TrendingUp,
  Plus,
  Search,
  Check,
  X,
  Sliders,
  Fuel,
  Luggage,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { verifyVehicleWithRTO } from '../services/rtoVerificationService';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

// Indian Commercial Vehicle Catalog for Fleet Operators
const INDIAN_COMMERCIAL_CATALOG = [
  {
    modelId: 'innova_crysta',
    brand: 'Toyota',
    modelName: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    categoryLabel: '7-Seater Premium MUV',
    seating: '7 + 1 Chauffeur',
    fuel: 'Diesel',
    bootSpace: '4 Large Bags + 2 Small',
    defaultRatePerKm: 14,
    defaultDailyRate: 4200,
    image: '/images/innova crysta.jpg',
    description: 'The undisputed gold standard for Indian outstation & ghat tours. Unmatched comfort and reliability.'
  },
  {
    modelId: 'ertiga_tour_m',
    brand: 'Maruti Suzuki',
    modelName: 'Maruti Suzuki Ertiga Tour M',
    category: 'muv',
    categoryLabel: 'Smart Hybrid 6-Seater MUV',
    seating: '6 + 1 Chauffeur',
    fuel: 'CNG + Petrol',
    bootSpace: '3 Bags Boot Space',
    defaultRatePerKm: 11,
    defaultDailyRate: 3300,
    image: '/images/ertiga.jpg',
    description: 'High-mileage, budget-friendly commercial MUV ideal for family outstations and intercity routes.'
  },
  {
    modelId: 'carens',
    brand: 'Kia',
    modelName: 'Kia Carens Prestige Plus',
    category: 'muv',
    categoryLabel: '7-Seater Luxury MUV',
    seating: '6/7 + 1 Chauffeur',
    fuel: 'Diesel / Turbo Petrol',
    bootSpace: '3 Large Bags',
    defaultRatePerKm: 13,
    defaultDailyRate: 3900,
    image: '/images/carens.jpg',
    description: 'Modern luxury MPV with one-touch electric tumble captain seats and superior air conditioning.'
  },
  {
    modelId: 'dzire_tour_s',
    brand: 'Maruti Suzuki',
    modelName: 'Maruti Suzuki Dzire Tour S',
    category: 'sedan',
    categoryLabel: 'Economy Commercial Sedan',
    seating: '4 + 1 Chauffeur',
    fuel: 'CNG / Petrol',
    bootSpace: '2 Large Trolley Bags',
    defaultRatePerKm: 10,
    defaultDailyRate: 2800,
    image: '/images/dzire.jpg',
    description: 'India’s most trusted commercial sedan for airport transfers and smooth point-to-point intercity travel.'
  },
  {
    modelId: 'aura',
    brand: 'Hyundai',
    modelName: 'Hyundai Aura Commercial Sedan',
    category: 'sedan',
    categoryLabel: 'Executive 4-Seater Sedan',
    seating: '4 + 1 Chauffeur',
    fuel: 'CNG / Petrol',
    bootSpace: '2 Large Bags (402L)',
    defaultRatePerKm: 10.5,
    defaultDailyRate: 2900,
    image: '/images/aura.jpg',
    description: 'Refined suspension and quiet cabin tailored for smooth executive city and highway commutes.'
  },
  {
    modelId: 'wagonr',
    brand: 'Maruti Suzuki',
    modelName: 'Maruti Suzuki WagonR Tour H3',
    category: 'sedan',
    categoryLabel: 'Tall-Boy Budget City Cab',
    seating: '4 + 1 Chauffeur',
    fuel: 'CNG (High Mileage)',
    bootSpace: '2 Medium Bags',
    defaultRatePerKm: 9.5,
    defaultDailyRate: 2400,
    image: '/images/wagonr.jpg',
    description: 'Maximum headroom and highest mileage commercial hatchback for economical outstations.'
  },
  {
    modelId: 'old_innova',
    brand: 'Toyota',
    modelName: 'Toyota Innova 2.5D Classic',
    category: 'muv',
    categoryLabel: '7-Seater Legend Workhorse',
    seating: '7 + 1 Chauffeur',
    fuel: 'Diesel D-4D',
    bootSpace: '4 Large Bags',
    defaultRatePerKm: 12.5,
    defaultDailyRate: 3600,
    image: '/images/old innova.jpg',
    description: 'Unbeatable durability and proven suspension for ghats, pilgrim circuits, and rough terrain.'
  },
  {
    modelId: 'force_urbania',
    brand: 'Force Motors',
    modelName: 'Force Urbania Luxury Van (12-Seater)',
    category: 'van',
    categoryLabel: 'Luxury Monocoque Van',
    seating: '12 + 1 Chauffeur',
    fuel: 'Diesel High-Roof AC',
    bootSpace: '10+ Dedicated Luggage Boot',
    defaultRatePerKm: 26,
    defaultDailyRate: 6800,
    image: '/images/car fleet images.jpg',
    description: 'European-standard luxury group travel with individual AC vents, reclining pushback seats, and air suspension.'
  }
];

// Initial Virtual Garage Sample Fleet
const INITIAL_GARAGE_VEHICLES = [
  {
    id: 'veh_1',
    modelId: 'innova_crysta',
    modelName: 'Toyota Innova Crysta 2.4 VX',
    category: 'muv',
    numberPlate: 'MH 12 RN 8821',
    stateCode: 'MH',
    permitType: 'All India Tourist Permit (AITP)',
    fitnessExpiry: '14 Oct 2028',
    insuranceStatus: 'Active (ICICI Lombard Commercial)',
    rtoVerified: true,
    status: 'on_duty', // 'on_duty' | 'available' | 'maintenance'
    activeRoute: 'Mumbai (Bandra) → Goa (Panaji)',
    assignedDriver: {
      name: 'Ramesh Shinde',
      phone: '+91 98220 88210',
      badge: 'MH-12-8821',
      rating: 4.98,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 14,
    minKmPerDay: 300,
    fuel: 'Diesel',
    seating: '7 + 1',
    image: '/images/innova crysta.jpg'
  },
  {
    id: 'veh_2',
    modelId: 'ertiga_tour_m',
    modelName: 'Maruti Suzuki Ertiga Tour M',
    category: 'muv',
    numberPlate: 'MH 14 DX 4419',
    stateCode: 'MH',
    permitType: 'Maharashtra State Tourist Cab Permit',
    fitnessExpiry: '22 May 2027',
    insuranceStatus: 'Active (Digit Commercial Insurance)',
    rtoVerified: true,
    status: 'available',
    activeRoute: 'In Garage (Ready for Dispatch)',
    assignedDriver: {
      name: 'Sameer Sawant',
      phone: '+91 98220 44190',
      badge: 'GA-01-4419',
      rating: 4.96,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 11,
    minKmPerDay: 300,
    fuel: 'CNG + Petrol',
    seating: '6 + 1',
    image: '/images/ertiga.jpg'
  },
  {
    id: 'veh_3',
    modelId: 'carens',
    modelName: 'Kia Carens Prestige Plus (7-Seater)',
    category: 'muv',
    numberPlate: 'MH 12 QX 7701',
    stateCode: 'MH',
    permitType: 'All India Tourist Permit (AITP)',
    fitnessExpiry: '08 Dec 2029',
    insuranceStatus: 'Active (HDFC ERGO Commercial)',
    rtoVerified: true,
    status: 'on_duty',
    activeRoute: 'Pune (Kothrud) → Mahabaleshwar Group Tour',
    assignedDriver: {
      name: 'Kailash Patil',
      phone: '+91 94220 77010',
      badge: 'MH-12-7701',
      rating: 4.97,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 13,
    minKmPerDay: 300,
    fuel: 'Diesel',
    seating: '6/7 + 1',
    image: '/images/carens.jpg'
  },
  {
    id: 'veh_4',
    modelId: 'dzire_tour_s',
    modelName: 'Maruti Suzuki Dzire Tour S',
    category: 'sedan',
    numberPlate: 'GJ 01 BX 9032',
    stateCode: 'GJ',
    permitType: 'Gujarat Commercial Tourist Cab',
    fitnessExpiry: '30 Mar 2028',
    insuranceStatus: 'Active (Bajaj Allianz Commercial)',
    rtoVerified: true,
    status: 'available',
    activeRoute: 'In Garage (Ready for Dispatch)',
    assignedDriver: {
      name: 'Praful Patel',
      phone: '+91 98980 90320',
      badge: 'GJ-01-9032',
      rating: 4.95,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 10,
    minKmPerDay: 250,
    fuel: 'CNG',
    seating: '4 + 1',
    image: '/images/dzire.jpg'
  },
  {
    id: 'veh_5',
    modelId: 'wagonr',
    modelName: 'Maruti Suzuki WagonR Tour H3',
    category: 'sedan',
    numberPlate: 'MH 02 CK 6620',
    stateCode: 'MH',
    permitType: 'State Commercial Motor Cab',
    fitnessExpiry: '15 Aug 2028',
    insuranceStatus: 'Active (SBI General Commercial)',
    rtoVerified: true,
    status: 'available',
    activeRoute: 'In Garage (Ready for Dispatch)',
    assignedDriver: {
      name: 'Anand Shinde',
      phone: '+91 98220 66200',
      badge: 'MH-02-6620',
      rating: 4.92,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 9.5,
    minKmPerDay: 200,
    fuel: 'CNG',
    seating: '4 + 1',
    image: '/images/wagonr.jpg'
  },
  {
    id: 'veh_6',
    modelId: 'old_innova',
    modelName: 'Toyota Innova 2.5D Classic',
    category: 'muv',
    numberPlate: 'MH 14 BN 1990',
    stateCode: 'MH',
    permitType: 'All India Tourist Permit (AITP)',
    fitnessExpiry: '10 Nov 2027',
    insuranceStatus: 'Active (TATA AIG Commercial)',
    rtoVerified: true,
    status: 'available',
    activeRoute: 'In Garage (Ready for Dispatch)',
    assignedDriver: {
      name: 'Dattatray Gaikwad',
      phone: '+91 98220 19900',
      badge: 'MH-14-1990',
      rating: 4.96,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    ratePerKm: 12.5,
    minKmPerDay: 300,
    fuel: 'Diesel D-4D',
    seating: '7 + 1',
    image: '/images/old innova.jpg'
  }
];

export default function FleetPartnerHome({ user, onLogout }) {
  const [garageVehicles, setGarageVehicles] = useState(INITIAL_GARAGE_VEHICLES);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'muv' | 'sedan' | 'suv' | 'van'
  const [activeTab, setActiveTab] = useState('garage'); // 'garage' | 'broadcasts'
  
  // Add Vehicle Modal State
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(INDIAN_COMMERCIAL_CATALOG[0]);
  const [plateInput, setPlateInput] = useState('MH 12 AB 5544');
  const [driverNameInput, setDriverNameInput] = useState('Sunil Jadhav');
  const [driverPhoneInput, setDriverPhoneInput] = useState('+91 98220 77665');
  const [ratePerKmInput, setRatePerKmInput] = useState(14);
  
  // RTO Live Verification Simulation State
  const [isVerifyingPlate, setIsVerifyingPlate] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const agencyName = user?.fleetDetails?.agencyName || user?.name || 'Sahyadri Travels & Fleet';
  const operatingHub = user?.fleetDetails?.city || 'Mumbai / Pune (Maharashtra)';

  const filteredVehicles = selectedCategory === 'all'
    ? garageVehicles
    : garageVehicles.filter((v) => v.category === selectedCategory);

  const handleVerifyNumberPlate = async () => {
    if (!plateInput.trim()) return;

    setIsVerifyingPlate(true);
    setVerificationResult(null);

    try {
      const result = await verifyVehicleWithRTO(plateInput, selectedModel);
      setIsVerifyingPlate(false);
      setVerificationResult(result);
    } catch (err) {
      setIsVerifyingPlate(false);
    }
  };

  const handleAddVehicleToGarage = () => {
    if (!selectedModel) return;

    const formattedPlate = plateInput ? plateInput.toUpperCase().trim() : 'MH 12 AB 5544';
    const statePrefix = formattedPlate.slice(0, 2) || 'MH';

    const newVehicle = {
      id: `veh_${Date.now()}`,
      modelId: selectedModel.modelId || 'innova_crysta',
      modelName: selectedModel.modelName || 'Toyota Innova Crysta',
      category: selectedModel.category || 'muv',
      numberPlate: formattedPlate,
      stateCode: statePrefix,
      permitType: verificationResult?.permitType || 'All India Tourist Permit (AITP)',
      fitnessExpiry: verificationResult?.fitnessValidTill || '28 Dec 2028',
      insuranceStatus: verificationResult?.insuranceCompany || 'Active Commercial Fleet Insurance',
      rtoVerified: true,
      status: 'available',
      activeRoute: 'In Garage (Ready for Dispatch)',
      assignedDriver: {
        name: driverNameInput.trim() || 'Assigned Chauffeur',
        phone: driverPhoneInput.trim() || '+91 98220 77665',
        badge: `${formattedPlate.slice(0, 5)}-BADGE`,
        rating: 4.96,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      },
      ratePerKm: Number(ratePerKmInput) || selectedModel.defaultRatePerKm || 14,
      minKmPerDay: 300,
      fuel: selectedModel.fuel || 'Diesel',
      seating: selectedModel.seating || '7 + 1',
      image: selectedModel.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
    };

    setGarageVehicles((prev) => [newVehicle, ...prev]);
    setIsAddVehicleOpen(false);
    setVerificationResult(null);
    setPlateInput('MH 12 AB 5544');
    setDriverNameInput('Sunil Jadhav');
  };

  const toggleVehicleStatus = (vehicleId) => {
    setGarageVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const nextStatus = v.status === 'available' ? 'on_duty' : v.status === 'on_duty' ? 'maintenance' : 'available';
          const nextRoute = nextStatus === 'on_duty' ? 'Mumbai ⇄ Goa Outstation' : nextStatus === 'maintenance' ? 'Scheduled Service / Inspection' : 'In Garage (Ready for Dispatch)';
          return { ...v, status: nextStatus, activeRoute: nextRoute };
        }
        return v;
      })
    );
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
        {/* Soft Translucent Light Tint */}
        <div className="absolute inset-0 bg-slate-900/15 pointer-events-none" />
      </div>

      {/* Foreground Interactive Page Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        
        {/* Apple Music Style Translucent Frosted Header */}
        <header className="sticky top-0 z-50 bg-white/35 backdrop-blur-2xl saturate-[190%] border-b border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 min-h-[88px] flex items-center justify-between">
            
            {/* Left: Logo */}
            <Logo size="md" />

            {/* Right: Add Vehicle CTA + Fleet Profile Badge */}
            <div className="flex items-center gap-3">
              
              <button
                onClick={() => setIsAddVehicleOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-850 active:scale-[0.98] text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-brand-400" />
                <span className="hidden sm:inline">Add Vehicle to Garage</span>
                <span className="sm:hidden">Add Car</span>
              </button>

              {/* Fleet Agency Profile */}
              <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-xs hover:bg-white/70 transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-adventure-600 text-white flex items-center justify-center font-black text-xs border-2 border-brand-500 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block pr-1">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    {agencyName}
                  </div>
                  <div className="text-[10px] text-brand-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Commercial Fleet Partner</span>
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

        {/* Main Fleet Command Center */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
          
          {/* Apple Music Style Frosted Fleet Hero Card */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-10 space-y-6 transition-all">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Base Hub: {operatingHub} • 0% Middleman Commission</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VAHAN & RTO Commercial Registry Verified</span>
              </div>
            </div>

            {/* Heading Content */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                Virtual Garage & Fleet Command
                <br /><span className="text-brand-600">{agencyName}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Add, manage, and dispatch all Indian commercial vehicles with RTO number plate verification. 
                <strong className="text-slate-950 font-bold"> Direct traveler trip broadcasts with zero commission cuts.</strong>
              </p>
            </div>

            {/* Quick Fleet KPIs */}
            <div className="pt-4 border-t border-white/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-brand-600 shrink-0 shadow-xs">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">{garageVehicles.length} Cabs</div>
                  <div className="text-xs text-slate-600 font-semibold">Total in Garage</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">₹1,24,500</div>
                  <div className="text-xs text-slate-600 font-semibold">Direct Monthly Payout</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-adventure-600 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">100% AITP</div>
                  <div className="text-xs text-slate-600 font-semibold">All India Permits</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
                  <Star className="w-5 h-5 fill-purple-600 text-purple-600" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">4.97 / 5</div>
                  <div className="text-xs text-slate-600 font-semibold">Fleet Rating (2.8k trips)</div>
                </div>
              </div>

            </div>

          </section>

          {/* 🚗 Virtual Garage Grid Section */}
          <section className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                  Your Virtual Commercial Garage ({filteredVehicles.length})
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                  Every vehicle registered with live RTO commercial permit verification, assigned chauffeur, and duty state.
                </p>
              </div>

              {/* Category Filter Pills & Add Button */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    All Fleet ({garageVehicles.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('muv')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === 'muv'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    MUVs (Innova/Ertiga)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('sedan')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === 'sedan'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    Sedans
                  </button>
                  <button
                    onClick={() => setSelectedCategory('van')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedCategory === 'van'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    Urbania & Vans
                  </button>
                </div>

                <button
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car</span>
                </button>
              </div>
            </div>

            {/* Garage Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="relative rounded-3xl overflow-hidden border border-white/50 bg-white/80 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image Preview with Number Plate Overlay */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.modelName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                    {/* Indian Commercial Number Plate Badge (Yellow Board with IND) */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-400 border border-amber-500 text-slate-950 font-black text-xs shadow-md tracking-wider">
                      <span className="text-[10px] font-black text-slate-900 border-r border-slate-900/30 pr-1.5">IND</span>
                      <span>{vehicle.numberPlate}</span>
                    </div>

                    {/* Duty Status Badge */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleVehicleStatus(vehicle.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md border shadow-md transition-all cursor-pointer ${
                          vehicle.status === 'on_duty'
                            ? 'bg-emerald-500/90 text-white border-emerald-400'
                            : vehicle.status === 'available'
                            ? 'bg-blue-500/90 text-white border-blue-400'
                            : 'bg-amber-500/90 text-white border-amber-400'
                        }`}
                        title="Click to toggle status"
                      >
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>
                          {vehicle.status === 'on_duty' ? '🟢 On Duty' : vehicle.status === 'available' ? '🟡 In Garage (Ready)' : '🔧 Maintenance'}
                        </span>
                      </button>
                    </div>

                    {/* Bottom Headline on Image */}
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <div className="text-xl font-black font-display drop-shadow-md">
                        {vehicle.modelName}
                      </div>
                      <div className="text-xs text-slate-200 font-medium flex items-center gap-2">
                        <span>{vehicle.seating} Seater</span>
                        <span>•</span>
                        <span>{vehicle.fuel}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">₹{vehicle.ratePerKm}/KM</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details & Chauffeur Info */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    
                    {/* Live Location / Current Duty Route */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span>Current Dispatch Status</span>
                        <span className="text-brand-600 font-extrabold">0% Commission</span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{vehicle.activeRoute}</span>
                      </div>
                    </div>

                    {/* Assigned Chauffeur & RTO Verification Pills */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      
                      {/* Driver Card */}
                      <div className="p-3 rounded-xl bg-white/90 border border-slate-200/70 flex items-center gap-2.5">
                        <img
                          src={vehicle.assignedDriver.avatar}
                          alt={vehicle.assignedDriver.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0 shadow-2xs"
                        />
                        <div className="truncate">
                          <div className="font-extrabold text-slate-900 truncate">{vehicle.assignedDriver.name}</div>
                          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-emerald-600" />
                            <span>{vehicle.assignedDriver.rating} ★ Rating</span>
                          </div>
                        </div>
                      </div>

                      {/* RTO Permit Badge */}
                      <div className="p-3 rounded-xl bg-white/90 border border-slate-200/70 space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">RTO Commercial Permit</div>
                        <div className="font-black text-slate-900 truncate text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>AITP Certified</span>
                        </div>
                      </div>

                    </div>

                    {/* Action Controls */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200/80">
                      <div className="text-xs">
                        <span className="text-slate-400 font-medium">Outstation Rate: </span>
                        <strong className="text-slate-950 font-black">₹{vehicle.ratePerKm} / KM</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVehicleStatus(vehicle.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          Change Status
                        </button>
                        <a
                          href={`tel:${vehicle.assignedDriver.phone}`}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Driver</span>
                        </a>
                      </div>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          </section>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* ➕ Add Commercial Vehicle & Live RTO Verification Modal */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-100 text-brand-800">
                  Virtual Garage Setup
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-2">
                  Add Commercial Vehicle to Garage
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select your commercial vehicle model and verify its RTO commercial number plate in real-time.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsAddVehicleOpen(false);
                  setVerificationResult(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Select Indian Commercial Model */}
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                1. Select Indian Commercial Vehicle Model
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INDIAN_COMMERCIAL_CATALOG.slice(0, 6).map((model) => (
                  <div
                    key={model.modelId}
                    onClick={() => {
                      setSelectedModel(model);
                      setRatePerKmInput(model.defaultRatePerKm);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      selectedModel.modelId === model.modelId
                        ? 'border-slate-950 bg-slate-50 shadow-md ring-2 ring-slate-950/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="h-20 w-full overflow-hidden rounded-xl bg-slate-100">
                      <img src={model.image} alt={model.modelName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 truncate">{model.modelName}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{model.seating} • {model.fuel}</div>
                      <div className="text-[11px] font-black text-brand-600 pt-1">₹{model.defaultRatePerKm}/KM</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Commercial Number Plate Input & Live RTO Verification */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                2. Commercial Number Plate & Live RTO Verification
              </label>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  
                  {/* Yellow Plate Preview & Input */}
                  <div className="flex-1 flex items-center rounded-xl bg-amber-400 border-2 border-amber-500 shadow-sm px-3 py-2">
                    <span className="text-xs font-black text-slate-950 border-r border-slate-950/30 pr-2 mr-2">
                      IND
                    </span>
                    <input
                      type="text"
                      value={plateInput}
                      onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                      placeholder="MH 12 AB 1234"
                      className="w-full bg-transparent text-sm font-black text-slate-950 tracking-wider placeholder:text-slate-800/60 focus:outline-none uppercase"
                    />
                  </div>

                  {/* Verification Button */}
                  <button
                    type="button"
                    onClick={handleVerifyNumberPlate}
                    disabled={isVerifyingPlate || !plateInput.trim()}
                    className="py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 disabled:opacity-60 transition-all cursor-pointer"
                  >
                    {isVerifyingPlate ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying with VAHAN...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verify Number Plate</span>
                      </>
                    )}
                  </button>

                </div>

                {/* Live RTO Verification Output Result */}
                {verificationResult && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>VAHAN Commercial Registry: Active & Valid</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase">
                        100% Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-slate-700">
                      <div>
                        <span className="font-bold text-slate-500">Commercial Registration:</span>
                        <div className="font-black text-slate-900 font-mono">{verificationResult.plateNumber || verificationResult.plate}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">RTO Jurisdiction & State:</span>
                        <div className="font-black text-slate-900">{verificationResult.rtoOffice}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Vehicle Maker & Class:</span>
                        <div className="font-black text-slate-900">{verificationResult.maker} • {verificationResult.model}</div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Permit & Fitness Expiry:</span>
                        <div className="font-black text-emerald-700">{verificationResult.permitType} (Valid: {verificationResult.fitnessValidTill})</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Step 3: Assigned Chauffeur & Dispatch Rate */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                3. Assigned Chauffeur & Per-KM Rate
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Assigned Driver Name</label>
                  <input
                    type="text"
                    value={driverNameInput}
                    onChange={(e) => setDriverNameInput(e.target.value)}
                    placeholder="e.g. Sunil Jadhav"
                    className="w-full text-xs font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Driver Phone Number</label>
                  <input
                    type="tel"
                    value={driverPhoneInput}
                    onChange={(e) => setDriverPhoneInput(e.target.value)}
                    placeholder="+91 98220 77665"
                    className="w-full text-xs font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Outstation Rate (₹/KM)</label>
                  <input
                    type="number"
                    value={ratePerKmInput}
                    onChange={(e) => setRatePerKmInput(e.target.value)}
                    className="w-full text-xs font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddVehicleToGarage}
                className="flex-1 py-3.5 px-6 rounded-xl bg-slate-950 hover:bg-slate-850 active:scale-[0.98] text-white text-xs font-black shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-brand-400" />
                <span>Add {selectedModel.modelName} to Virtual Garage</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAddVehicleOpen(false);
                  setVerificationResult(null);
                }}
                className="py-3.5 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
