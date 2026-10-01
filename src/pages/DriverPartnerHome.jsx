import React, { useState, useEffect } from 'react';
import Logo from '../components/Common/Logo';
import Footer from '../components/Footer/Footer';
import { subscribeToOpenTrips, acceptTripRequest } from '../services/tripService';
import { toggleDriverDuty, registerOrUpdateDriver } from '../services/driverService';
import {
  UserCheck,
  ShieldCheck,
  Star,
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
  IndianRupee,
  Calendar,
  Filter,
  Users,
  Briefcase,
  TrendingUp,
  Radio,
  Check,
  X,
  MessageSquare,
  Zap,
  Sliders,
  ArrowLeft,
  FileText,
  Navigation,
  Eye,
  Camera,
  Upload
} from 'lucide-react';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

const LIVE_TRIP_BROADCASTS = [
  {
    id: 'broadcast_1',
    customerName: 'Vikram Singhania',
    customerPhone: '+91 98201 44820',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    from: 'Mumbai (Bandra West)',
    to: 'Goa (Panaji / Candolim)',
    category: 'outstation',
    serviceType: 'Driver Only (Personal Car Chauffeur)',
    vehicleRequested: 'Customer’s Innova Crysta (Manual Diesel)',
    passengers: '4 Adults + 1 Child',
    luggage: '4 Large Bags',
    dates: '05 Sep 2026 - 08 Sep 2026 (4 Days)',
    distanceEstimate: '620 KM One-Way / 1,350 KM Round Trip',
    directPayout: '₹5,000',
    pricingDetail: '₹1,250/Day Duty (4 Days) • 0% Commission • Customer provides car, fuel & tolls',
    specialNotes: 'Family holiday trip. Requires experienced highway chauffeur for our personal Innova. Non-smoker, smooth driving style.',
    urgencyBadge: '⚡ Urgent Highway Duty',
    postedTime: '8 mins ago',
    routeHighlights: ['Mumbai-Pune Expressway', 'Amboli Ghat / Kankavli Route', 'Direct Resort Drop']
  },
  {
    id: 'broadcast_2',
    customerName: 'Dr. Ananya & Rohit Joshi',
    customerPhone: '+91 94220 89120',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    from: 'Pune (Kothrud / Baner)',
    to: 'Mahabaleshwar & Panchgani Ghats',
    category: 'ghats',
    serviceType: 'Driver Only (Personal Car Chauffeur)',
    vehicleRequested: 'Customer’s Toyota Fortuner (Automatic 4x4)',
    passengers: '3 Adults',
    luggage: '2 Medium Bags',
    dates: 'Tomorrow Morning 6:30 AM (2 Days)',
    distanceEstimate: '260 KM Hill Circuit',
    directPayout: '₹2,600',
    pricingDetail: '₹1,200/Day Duty + ₹200 Night Stay Allowance + Food Included',
    specialNotes: 'Heavy rain expected on Pasarni Ghat. Need veteran chauffeur skilled with automatic 4x4 hill assist for our Fortuner.',
    urgencyBadge: '⛰️ Ghats Specialist Needed',
    postedTime: '15 mins ago',
    routeHighlights: ['Pasarni Ghat Hairpin Bends', 'Venna Lake & Arthur Seat', 'Pune Return Drop']
  },
  {
    id: 'broadcast_3',
    customerName: 'Mehul Patel (Family)',
    customerPhone: '+91 98980 12345',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    from: 'Ahmedabad (SG Highway)',
    to: 'Statue of Unity & Somnath Temple',
    category: 'outstation',
    serviceType: 'Driver Only (Personal Car Chauffeur)',
    vehicleRequested: 'Customer’s Maruti Ertiga Smart Hybrid (Automatic)',
    passengers: '5 Adults',
    luggage: '3 Trolley Bags',
    dates: '10 Sep 2026 - 12 Sep 2026 (3 Days)',
    distanceEstimate: '980 KM Circuit Trip',
    directPayout: '₹3,750',
    pricingDetail: '₹1,250/Day Outstation Duty (3 Days) • Direct UPI Settlement',
    specialNotes: 'Senior citizens on board. Punctual morning departure, smooth expressway cruising in our Ertiga. Hotel stay provided.',
    urgencyBadge: '🛕 Heritage Circuit Duty',
    postedTime: '32 mins ago',
    routeHighlights: ['Vadodara Expressway', 'Statue of Unity Tour', 'Somnath Temple Circuit']
  },
  {
    id: 'broadcast_4',
    customerName: 'Kavita Menon',
    customerPhone: '+91 97400 55123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    from: 'Bengaluru (Indiranagar / Whitefield)',
    to: 'Coorg Coffee Estates & Mysuru Palace',
    category: 'ghats',
    serviceType: 'Driver Only (Personal Car Chauffeur)',
    vehicleRequested: 'Customer’s Innova Hycross (Automatic)',
    passengers: '4 Passengers',
    luggage: '3 Bags',
    dates: 'This Weekend (Sat - Sun 2 Days)',
    distanceEstimate: '540 KM Outstation',
    directPayout: '₹2,500',
    pricingDetail: '₹1,000/Day + ₹500 Night Stay Allowance + Meals Provided',
    specialNotes: 'Coffee plantation narrow roads. Chauffeur fluent in Kannada / English preferred for our car.',
    urgencyBadge: '☕ Weekend Ghats Escapade',
    postedTime: '1 hour ago',
    routeHighlights: ['Mysuru Expressway', 'Madikeri Hills', 'Estate Pickup & Drop']
  },
  {
    id: 'broadcast_5',
    customerName: 'Siddharth Deshmukh',
    customerPhone: '+91 98223 99182',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    from: 'South Mumbai (Nariman Point / BKC)',
    to: 'City Corporate & Airport Runs',
    category: 'city',
    serviceType: 'Driver Only (Personal Car Chauffeur)',
    vehicleRequested: 'Customer’s Mercedes C-Class (Automatic)',
    passengers: '1 Executive',
    luggage: '1 Laptop Bag + 1 Briefcase',
    dates: 'Today 9:00 AM - 7:00 PM (10 Hours Duty)',
    distanceEstimate: '85 KM City Circuit',
    directPayout: '₹1,150',
    pricingDetail: '₹950 Day Shift + ₹200 Overtime • Direct UPI Settlement',
    specialNotes: 'Corporate meetings in BKC and Colaba. Needs polite, verified chauffeur experienced with luxury automatic cars.',
    urgencyBadge: '💼 City Executive Duty',
    postedTime: '5 mins ago',
    routeHighlights: ['BKC Business District', 'Eastern Freeway', 'T2 Airport Drop']
  }
];

export default function DriverPartnerHome({ 
  user, 
  onLogout, 
  onNavigateToFleet,
  onNavigateToDrivers 
}) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'outstation' | 'ghats' | 'driver_only'
  const [activeBroadcastModal, setActiveBroadcastModal] = useState(null);
  const [acceptedBroadcasts, setAcceptedBroadcasts] = useState({});
  const [showRateSettings, setShowRateSettings] = useState(false);
  const [broadcasts, setBroadcasts] = useState(LIVE_TRIP_BROADCASTS);

  // Subscribe to real-time open trips
  useEffect(() => {
    const unsub = subscribeToOpenTrips((liveTrips) => {
      if (liveTrips && liveTrips.length > 0) {
        const formatted = liveTrips.map((t, idx) => ({
          id: t.id || `live_trip_${idx}`,
          customerName: t.travelerName || t.customerName || 'Verified Traveler',
          customerPhone: t.travelerPhone || t.customerPhone || '+91 98201 44820',
          avatar: t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          from: t.pickupLocation || t.from || 'Mumbai',
          to: t.dropoffLocation || t.to || 'Goa',
          category: t.category || (t.routeType === 'ghats' ? 'ghats' : (t.tripType === 'city' ? 'city' : 'outstation')),
          serviceType: 'Driver Only (Personal Car Chauffeur)',
          vehicleRequested: t.ownCarType
            ? `Customer’s Own ${t.ownCarType.toUpperCase()} (${t.transmission || 'Automatic'})`
            : (t.vehicleRequested || 'Customer’s Personal Vehicle'),
          passengers: typeof t.passengers === 'number' ? `${t.passengers} Passengers` : (t.passengers || '4 Passengers'),
          luggage: `${t.largeBags || 2} Large + ${t.smallBags || 2} Small`,
          dates: t.pickupDate || 'Tomorrow',
          distanceEstimate: typeof t.estimatedDistance === 'number' ? `${t.estimatedDistance} KM Distance` : (t.distanceEstimate || '200 KM'),
          directPayout: t.estimatedFare?.label || t.directPayout || '₹3,500',
          pricingDetail: 'Direct UPI Settlement • 0% Platform Commission',
          specialNotes: t.urgency || 'Live Traveler Broadcast from Touralink',
          urgencyBadge: '⚡ Live Trip Broadcast',
          postedTime: 'Live Feed',
          routeHighlights: t.additionalStops && t.additionalStops.length > 0
            ? t.additionalStops
            : (t.routeHighlights || ['Direct Outstation Highway Route'])
        }));
        setBroadcasts(formatted);
      }
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Custom driver rates state (Driver Only Chauffeur Duties)
  const [rateCard, setRateCard] = useState({
    dailyRate: 950,
    outstationRate: 1250,
    ghatsSurcharge: 250,
    overtimeHourlyRate: 120
  });

  const [showDriverDetailsModal, setShowDriverDetailsModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [driverProfileData, setDriverProfileData] = useState(() => {
    const base = user?.driverDetails || {};
    return {
      image: base.image || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      licenseNumber: base.licenseNumber || 'MH12 20120045912 (LMV-TR Transport Commercial)',
      badgeNumber: 'MH-12-8821',
      pccNumber: 'PCC-MH-2026-99124',
      policeStation: 'Shivajinagar Police Commissionerate, Pune',
      medicalFitness: 'A1 Vision & Physical Fitness Certified',
      experienceYears: '12 Years Driving Experience',
      totalSafeKms: '4,50,000+ KM Accident-Free',
      operatingCity: 'Pune / Mumbai (Maharashtra)',
      dailyRate: '₹950 / Day',
      outstationRate: '₹1,250 / Night Outstation',
      vehicleTypes: [
        'Hatchback',
        'Sedan',
        'SUV',
        'MPV',
        'Luxury Sedan',
        'Luxury SUV'
      ],
      carModels: [
        'Hatchback',
        'Sedan',
        'SUV',
        'MPV',
        'Luxury Sedan',
        'Luxury SUV'
      ],
      transmissions: [
        'Manual',
        'Automatic (AT)',
        'CVT / e-CVT',
        'Dual-Clutch (DCT / DSG)',
        'Hybrid',
        'Electric Vehicle (EV)'
      ],
      skillSet: [
        'Experienced in Ghats',
        'Long Drive Capable',
        'Defensive Driving Certified',
        'First Aid / CPR Trained',
        'Clean Driving Record / Zero Accidents',
        'Outstation / Long-Distance Driving (Night driving, highway expertise)',
        'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
        'Strictly Non-Smoker / No Tobacco Products',
        'Zero Alcohol / Substance Policy Compliant',
        'Maintains High Personal Cleanliness & Hygiene',
        'Proper Uniform / Formal Dress Code Compliant'
      ],
      languages: 'Marathi, Hindi, English',
      bio: 'Professional chauffeur skilled across luxury sedans, SUVs, and automatics. Zero accident record with strict non-smoker, defensive driving, and corporate etiquette standards.'
    };
  });

  const toggleDriverVehicleType = (vType) => {
    setDriverProfileData((prev) => {
      const current = prev.vehicleTypes || prev.carModels || [];
      const exists = current.includes(vType);
      const next = exists ? current.filter(t => t !== vType) : [...current, vType];
      const valid = next.length > 0 ? next : [vType];
      return { ...prev, vehicleTypes: valid, carModels: valid };
    });
  };

  const toggleDriverTransmission = (trans) => {
    setDriverProfileData((prev) => {
      const current = prev.transmissions || [];
      const exists = current.includes(trans);
      const next = exists ? current.filter(t => t !== trans) : [...current, trans];
      return { ...prev, transmissions: next.length > 0 ? next : [trans] };
    });
  };

  const toggleDriverSkill = (skill) => {
    setDriverProfileData((prev) => {
      const current = prev.skillSet || [];
      const exists = current.includes(skill);
      const next = exists ? current.filter(s => s !== skill) : [...current, skill];
      return { ...prev, skillSet: next.length > 0 ? next : [skill] };
    });
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target.result;
        setDriverProfileData((prev) => ({
          ...prev,
          image: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDriverProfile = () => {
    registerOrUpdateDriver({
      id: user?.id || 'ramesh_shinde',
      name: user?.name || 'Ramesh Shinde',
      location: driverProfileData.operatingCity,
      phone: user?.phone || '+91 98221 44510',
      whatsapp: (user?.phone || '919822144510').replace(/[^0-9]/g, ''),
      category: 'ghats',
      categoryLabel: 'Verified Personal Chauffeur',
      image: driverProfileData.image || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: driverProfileData.experienceYears,
      badge: `Police Verified • ${driverProfileData.badgeNumber}`,
      badgeNumber: driverProfileData.badgeNumber,
      licenseNumber: driverProfileData.licenseNumber,
      policeVerification: {
        status: 'Verified & Clean Record',
        number: driverProfileData.pccNumber,
        station: driverProfileData.policeStation,
        issueDate: '15 Jan 2026'
      },
      medicalFitness: {
        status: driverProfileData.medicalFitness,
        certifiedBy: 'Civil Hospital / Sassoon General Hospital',
        validTill: 'Nov 2028'
      },
      totalSafeKms: driverProfileData.totalSafeKms,
      specialty: (driverProfileData.skillSet || []).slice(0, 3).join(' • '),
      carExpertise: (driverProfileData.vehicleTypes || driverProfileData.carModels || []).join(', '),
      carModelsDriven: driverProfileData.vehicleTypes || driverProfileData.carModels || [],
      vehicleTypes: driverProfileData.vehicleTypes || driverProfileData.carModels || [],
      transmissions: driverProfileData.transmissions || [],
      skills: driverProfileData.skillSet || [],
      skillSet: driverProfileData.skillSet || [],
      mountainPassesMastered: (driverProfileData.skillSet || []).filter(s => s.toLowerCase().includes('ghat')),
      languages: driverProfileData.languages,
      dailyRate: driverProfileData.dailyRate,
      outstationRate: driverProfileData.outstationRate,
      rating: '5.0',
      trips: 'Active Chauffeur Duty',
      bio: driverProfileData.bio,
      isOnline: isAvailable
    });
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setShowDriverDetailsModal(false);
    }, 1200);
  };

  const filteredBroadcasts = selectedFilter === 'all'
    ? broadcasts
    : broadcasts.filter((item) => {
        if (selectedFilter === 'ghats') return item.category === 'ghats';
        if (selectedFilter === 'outstation') return item.category === 'outstation';
        if (selectedFilter === 'city') return item.category === 'city';
        return true;
      });

  const handleAcceptDuty = async (broadcastId) => {
    setAcceptedBroadcasts((prev) => ({
      ...prev,
      [broadcastId]: true
    }));
    try {
      await acceptTripRequest(broadcastId, {
        id: user?.id || 'ramesh_shinde',
        name: user?.name || 'Ramesh Shinde',
        phone: user?.phone || '+91 98221 44510',
        badge: 'MH-12-8821'
      });
    } catch (err) {
      console.error('Error accepting trip in backend:', err);
    }
  };

  const handleToggleDuty = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    toggleDriverDuty(user?.id || 'ramesh_shinde', nextState);
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
            
            {/* Left: Logo & Partner Badge */}
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Partner Portal</span>
              </div>
            </div>

            {/* Right: Availability Toggle + Role Switcher + User Profile */}
            {/* Right: Availability Toggle + Driver Details KYC + Role Switcher + User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* My Driver Details & KYC Button */}
              <button
                type="button"
                onClick={() => setShowDriverDetailsModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-black text-slate-850 hover:bg-white transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">My Driver Details & KYC</span>
                <span className="sm:hidden">KYC Data</span>
              </button>

              {/* Live Duty Availability Button */}
              <button
                onClick={handleToggleDuty}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl border text-xs font-black transition-all cursor-pointer shadow-xs ${
                  isAvailable 
                    ? 'bg-emerald-500/90 text-white border-emerald-400 shadow-emerald-500/25 hover:bg-emerald-600' 
                    : 'bg-white/70 text-slate-700 border-white/60 hover:bg-white'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                <span>{isAvailable ? 'Online • Ready for Duties' : 'On Break • Offline'}</span>
              </button>

              {/* Partner Profile Badge */}
              <div 
                onClick={() => setShowDriverDetailsModal(true)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/50 backdrop-blur-xl border border-white/60 shadow-xs hover:bg-white/70 transition-all cursor-pointer"
                title="Click to view & edit your driver KYC details"
              >
                <img
                  src={driverProfileData.image || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                  alt="Partner Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-500 shadow-xs"
                />
                <div className="text-left hidden sm:block pr-1">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    {user?.name || 'Ramesh Shinde'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{driverProfileData.badgeNumber || 'MH-12-8821 • Verified'}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-full hover:bg-white/80 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </header>

        {/* Main Partner Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 flex-1 w-full">
          
          {/* Apple Music Style Frosted Welcome Banner */}
          <section className="relative rounded-3xl overflow-hidden border border-white/40 bg-white/35 backdrop-blur-2xl saturate-[190%] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-6 sm:p-10 space-y-6 transition-all">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 text-xs font-bold text-slate-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Direct Chauffeur Network • 0% Platform Commission • 100% Direct UPI</span>
              </div>

              <button
                type="button"
                onClick={() => setShowDriverDetailsModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-black hover:bg-emerald-500/25 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Police Clearance PCC & Badge Verified (View/Edit)</span>
              </button>
            </div>

            {/* Heading Content */}
            <div className="max-w-3xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
                Namaste, <span className="text-brand-600">{user?.name ? user.name.split(' ')[0] : 'Captain'}</span>!
                <br />Your Direct Trip Command Center.
              </h1>

              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Connect directly with premium travelers looking for outstation cab rentals and personal car chauffeurs across Maharashtra, Goa, Gujarat & Karnataka. 
                <strong className="text-slate-950 font-bold"> No middleman fees. Direct customer settlement.</strong>
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="pt-4 border-t border-white/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-brand-600 shrink-0 shadow-xs">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">₹0 Cut</div>
                  <div className="text-xs text-slate-600 font-semibold">0% Commission</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">₹34,800</div>
                  <div className="text-xs text-slate-600 font-semibold">Monthly Direct Payout</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-adventure-600 shrink-0 shadow-xs">
                  <Star className="w-5 h-5 fill-adventure-600" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">4.98 ★</div>
                  <div className="text-xs text-slate-600 font-semibold">1,420+ Safe Trips</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/50 shadow-xs hover:bg-white/65 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900">100% KYC</div>
                  <div className="text-xs text-slate-600 font-semibold">Badge MH-12-8821</div>
                </div>
              </div>

            </div>

          </section>

          {/* 🚗 Live Trip Broadcasts Section */}
          <section className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                    Live Traveler Booking Broadcasts
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                  Travelers hiring verified chauffeurs for their personal or outstation cars. Review itinerary and accept driving duties with 0% platform deductions.
                </p>
              </div>

              {/* Filter Tabs & Rate Settings Button */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xs">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedFilter === 'all'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    All Duties ({broadcasts.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('ghats')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedFilter === 'ghats'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    ⛰️ Ghats & Hills Specialist
                  </button>
                  <button
                    onClick={() => setSelectedFilter('outstation')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedFilter === 'outstation'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    🛣️ Outstation Highway
                  </button>
                  <button
                    onClick={() => setSelectedFilter('city')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedFilter === 'city'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    🏙️ City & Local Shifts
                  </button>
                </div>

                <button
                  onClick={() => setShowRateSettings(!showRateSettings)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 text-xs font-extrabold text-slate-800 shadow-xs hover:bg-white transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-brand-600" />
                  <span>{showRateSettings ? 'Hide Rate Card' : 'My Rate Card'}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Rate Card & Preferences Settings */}
            {showRateSettings && (
              <div className="rounded-3xl border border-white/50 bg-white/70 backdrop-blur-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 font-display">
                      Custom Chauffeur Rate Card & Duty Settings
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Set your transparent daily duty, night stay, and overtime wages visible to travelers hiring you.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    Active on Profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-600">Driver Only (Local Day Shift)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">₹</span>
                      <input
                        type="number"
                        value={rateCard.dailyRate}
                        onChange={(e) => setRateCard({ ...rateCard, dailyRate: Number(e.target.value) })}
                        className="w-full text-base font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">/ Day</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-600">Outstation Night Stay Duty</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">₹</span>
                      <input
                        type="number"
                        value={rateCard.outstationRate}
                        onChange={(e) => setRateCard({ ...rateCard, outstationRate: Number(e.target.value) })}
                        className="w-full text-base font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">/ Night</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-600">Ghats / Hill Specialist Surcharge</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">+₹</span>
                      <input
                        type="number"
                        value={rateCard.ghatsSurcharge}
                        onChange={(e) => setRateCard({ ...rateCard, ghatsSurcharge: Number(e.target.value) })}
                        className="w-full text-base font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">/ Day</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-600">Overtime / Extra Hour Duty</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-slate-900">₹</span>
                      <input
                        type="number"
                        value={rateCard.overtimeHourlyRate}
                        onChange={(e) => setRateCard({ ...rateCard, overtimeHourlyRate: Number(e.target.value) })}
                        className="w-full text-base font-extrabold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">/ Hour</span>
                    </div>
                  </div>

                </div>

                {/* Fleet Portal Link Notice if Driver Owns a Car */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-brand-50/80 border border-brand-200 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold shrink-0">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Own a commercial car or cab too?</div>
                      <div className="text-slate-600 text-[11px]">
                        List your vehicle under the <strong>Fleet Partner Portal</strong> to receive full Car + Driver rental bookings at per-km rates.
                      </div>
                    </div>
                  </div>
                  {onNavigateToFleet && (
                    <button
                      type="button"
                      onClick={onNavigateToFleet}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-all shadow-xs"
                    >
                      Switch to Fleet Portal →
                    </button>
                  )}
                </div>

                <div className="text-right">
                  <button
                    onClick={() => setShowRateSettings(false)}
                    className="px-5 py-2 rounded-xl bg-slate-950 text-white text-xs font-black shadow-md hover:bg-slate-850 cursor-pointer"
                  >
                    Save & Update Live Rates
                  </button>
                </div>
              </div>
            )}

            {/* Broadcast Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              
              {filteredBroadcasts.map((broadcast) => {
                const isAccepted = acceptedBroadcasts[broadcast.id];

                return (
                  <div
                    key={broadcast.id}
                    className="relative rounded-3xl overflow-hidden border border-white/50 bg-white/80 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group"
                  >
                    {/* Top Header: Urgency & Direct Payout */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs">
                          {broadcast.urgencyBadge}
                        </span>

                        <div className="text-right">
                          <div className="text-xl font-black font-display text-slate-950">
                            {broadcast.directPayout}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold">
                            Direct Payout • 0% Cut
                          </div>
                        </div>
                      </div>

                      {/* Route Header */}
                      <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                            <div className="w-3 h-3 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                            <div className="w-0.5 h-6 bg-slate-300" />
                            <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                          </div>
                          
                          <div className="flex-1 space-y-2 text-xs">
                            <div>
                              <span className="font-bold text-slate-400 uppercase text-[10px]">Pickup Origin</span>
                              <div className="font-black text-sm text-slate-900">{broadcast.from}</div>
                            </div>
                            <div>
                              <span className="font-bold text-slate-400 uppercase text-[10px]">Destination</span>
                              <div className="font-black text-sm text-slate-900">{broadcast.to}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details Matrix */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white/60 border border-slate-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-brand-600" />
                            <span>Travel Dates</span>
                          </div>
                          <div className="font-extrabold text-slate-900">{broadcast.dates}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/60 border border-slate-100 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                            <Car className="w-3.5 h-3.5 text-adventure-600" />
                            <span>Customer’s Car to Drive</span>
                          </div>
                          <div className="font-extrabold text-slate-900 truncate">{broadcast.vehicleRequested}</div>
                        </div>
                      </div>

                      {/* Route Highlights Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {broadcast.routeHighlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-[11px] font-bold border border-slate-200/60"
                          >
                            ✓ {highlight}
                          </span>
                        ))}
                      </div>

                      {/* Traveler Quote / Special Request */}
                      <p className="text-xs text-slate-700 bg-amber-50/70 border border-amber-200/70 p-3 rounded-xl leading-relaxed">
                        <strong className="text-slate-900 font-bold">Note from Traveler: </strong>
                        {broadcast.specialNotes}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                      
                      {/* Customer Info */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={broadcast.avatar}
                          alt={broadcast.customerName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-300 shadow-2xs"
                        />
                        <div>
                          <div className="text-xs font-black text-slate-900">{broadcast.customerName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{broadcast.postedTime}</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveBroadcastModal(broadcast)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                        >
                          Details
                        </button>

                        {isAccepted ? (
                          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md">
                            <Check className="w-4 h-4" />
                            <span>Accepted</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAcceptDuty(broadcast.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 active:scale-[0.98] text-white text-xs font-black shadow-md transition-all cursor-pointer"
                          >
                            <span>Accept Duty</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

          {/* 🛡️ Partner Benefits & KYC Verification Hub */}
          <section className="rounded-3xl border border-white/40 bg-white/35 backdrop-blur-2xl p-6 sm:p-10 space-y-6">
            
            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                Touralink Partner Guarantees
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Built by drivers, for drivers. The only transparent platform empowering professional chauffeurs with direct customer connect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-black">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Zero Middleman Commissions</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Traditional cab aggregators take 25% to 30% of your hard-earned ride fares. Touralink takes 0% commission. You keep 100% of every rupee paid.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Direct Traveler Settlements</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  No waiting for weekly payout cycles or payout deductions. Travelers pay you directly through UPI or Cash upon duty completion.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/80 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-adventure-100 text-adventure-600 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Verified Professional Badge</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Your police clearance and hill experience badges are prominently featured to premium families and business travelers booking outstations.
                </p>
              </div>

            </div>

          </section>

        </main>

        {/* Global Touralink Footer */}
        <Footer />

      </div>

      {/* 📋 Interactive Trip Details & Contact Modal */}
      {activeBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-white/95 border border-white/60 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-100 text-brand-800">
                  {activeBroadcastModal.urgencyBadge}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 font-display mt-2">
                  Trip Details & Direct Traveler Connect
                </h3>
              </div>
              <button
                onClick={() => setActiveBroadcastModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Route Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Trip Service Type:</span>
                <span className="font-black text-slate-900">{activeBroadcastModal.serviceType}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Customer’s Vehicle to Drive:</span>
                <span className="font-black text-slate-900">{activeBroadcastModal.vehicleRequested}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Travel Route:</span>
                <span className="font-black text-slate-900">{activeBroadcastModal.from} → {activeBroadcastModal.to}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Estimated Distance:</span>
                <span className="font-black text-slate-900">{activeBroadcastModal.distanceEstimate}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Travel Dates:</span>
                <span className="font-black text-slate-900">{activeBroadcastModal.dates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Direct Driver Payout:</span>
                <span className="text-base font-black text-emerald-600">{activeBroadcastModal.directPayout}</span>
              </div>
            </div>

            {/* Direct Traveler Phone & Contact */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                <PhoneCall className="w-4 h-4" />
                <span>Direct Traveler Contact</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="font-black text-sm text-slate-900">{activeBroadcastModal.customerName}</div>
                  <div className="text-xs text-slate-600 font-bold">{activeBroadcastModal.customerPhone}</div>
                </div>
                <a
                  href={`tel:${activeBroadcastModal.customerPhone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleAcceptDuty(activeBroadcastModal.id);
                  setActiveBroadcastModal(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-black text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Confirm & Accept Duty
              </button>
              <button
                onClick={() => setActiveBroadcastModal(null)}
                className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Real Driver Details & KYC Profile Modal */}
      {showDriverDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    My Verified Chauffeur KYC & Rates
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    RTO Badge, Commercial Permit, Police Verification & Rate Card
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDriverDetailsModal(false)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              
              {saveSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Driver details and KYC successfully updated across Touralink!</span>
                </div>
              )}

              {/* Chauffeur Photo Upload */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="relative shrink-0 w-16 h-16">
                  <img
                    src={driverProfileData.image || user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt="Driver Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full border-2 border-white shadow-xs" title="Verified Badge Photo">
                    <Check className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-brand-600" />
                    <span>Chauffeur Profile & Badge Photo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload official portrait directly from your device (JPG, PNG, WebP)
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <label className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Photo from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 1: Government & Police Verification */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>1. Government Licenses & Police Clearance (PCC)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Commercial DL Number</label>
                    <input
                      type="text"
                      value={driverProfileData.licenseNumber}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, licenseNumber: e.target.value })}
                      placeholder="e.g. MH12 20120045912 (LMV-TR)"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">RTO Transport Badge ID</label>
                    <input
                      type="text"
                      value={driverProfileData.badgeNumber}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, badgeNumber: e.target.value })}
                      placeholder="e.g. MH-12-8821"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Police Clearance (PCC) Number</label>
                    <input
                      type="text"
                      value={driverProfileData.pccNumber}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, pccNumber: e.target.value })}
                      placeholder="e.g. PCC-MH-2026-99124"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Issuing Police Station</label>
                    <input
                      type="text"
                      value={driverProfileData.policeStation}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, policeStation: e.target.value })}
                      placeholder="e.g. Shivajinagar Police Commissionerate, Pune"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="font-bold text-slate-700 text-xs">Medical & Vision Fitness Status</label>
                  <input
                    type="text"
                    value={driverProfileData.medicalFitness}
                    onChange={(e) => setDriverProfileData({ ...driverProfileData, medicalFitness: e.target.value })}
                    placeholder="e.g. A1 Vision & Physical Fitness Certified"
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>

              {/* Section 2: Experience & Operating Hub */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-adventure-600" />
                  <span>2. Experience & Primary City</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Experience (Years)</label>
                    <input
                      type="text"
                      value={driverProfileData.experienceYears}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, experienceYears: e.target.value })}
                      placeholder="e.g. 12 Years Driving Experience"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Accident-Free Distance</label>
                    <input
                      type="text"
                      value={driverProfileData.totalSafeKms}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, totalSafeKms: e.target.value })}
                      placeholder="e.g. 4,50,000+ KM Accident-Free"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Operating City / Region</label>
                    <input
                      type="text"
                      value={driverProfileData.operatingCity}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, operatingCity: e.target.value })}
                      placeholder="e.g. Pune / Mumbai (Maharashtra)"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Daily Rate Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span>3. Chauffeur Daily Duty Wage & Outstation Allowance</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    0% Commission
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Daily Shift Rate (8-10 Hours)</label>
                    <input
                      type="text"
                      value={driverProfileData.dailyRate}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, dailyRate: e.target.value })}
                      placeholder="e.g. ₹950 / Day"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Outstation Night Stay Allowance</label>
                    <input
                      type="text"
                      value={driverProfileData.outstationRate}
                      onChange={(e) => setDriverProfileData({ ...driverProfileData, outstationRate: e.target.value })}
                      placeholder="e.g. ₹1,250 / Night Outstation"
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Vehicle Types & Transmissions Handled */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-brand-600" />
                  <span>4. Vehicle Types & Transmissions Handled</span>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600">Select Vehicle Types Driven:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Hatchback',
                      'Sedan',
                      'SUV',
                      'MPV',
                      'Luxury Sedan',
                      'Luxury SUV'
                    ].map((vType) => {
                      const active = (driverProfileData.vehicleTypes || driverProfileData.carModels || []).includes(vType);
                      return (
                        <button
                          key={vType}
                          type="button"
                          onClick={() => toggleDriverVehicleType(vType)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            active
                              ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {active ? `✓ ${vType}` : `+ ${vType}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-600">Select Transmissions Handled:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Manual',
                      'Automatic (AT)',
                      'CVT / e-CVT',
                      'Dual-Clutch (DCT / DSG)',
                      'Hybrid',
                      'Electric Vehicle (EV)'
                    ].map((trans) => {
                      const active = (driverProfileData.transmissions || []).includes(trans);
                      return (
                        <button
                          key={trans}
                          type="button"
                          onClick={() => toggleDriverTransmission(trans)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            active
                              ? 'bg-adventure-600 text-white border-adventure-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {active ? `✓ ${trans}` : `+ ${trans}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 5: Skill Set, Certifications & Standards */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>5. Skill Set, Certifications & Professional Standards</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Experienced in Ghats',
                    'Long Drive Capable',
                    'Defensive Driving Certified',
                    'First Aid / CPR Trained',
                    'Clean Driving Record / Zero Accidents',
                    'Outstation / Long-Distance Driving (Night driving, highway expertise)',
                    'Executive / Corporate Chauffeur (Punctual, formal attire, client handling)',
                    'Strictly Non-Smoker / No Tobacco Products',
                    'Zero Alcohol / Substance Policy Compliant',
                    'Maintains High Personal Cleanliness & Hygiene',
                    'Proper Uniform / Formal Dress Code Compliant'
                  ].map((skill) => {
                    const active = (driverProfileData.skillSet || []).includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleDriverSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {active ? `✓ ${skill}` : `+ ${skill}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 6: Bio & Languages */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Languages</label>
                  <input
                    type="text"
                    value={driverProfileData.languages}
                    onChange={(e) => setDriverProfileData({ ...driverProfileData, languages: e.target.value })}
                    placeholder="e.g. Marathi, Hindi, English"
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Driver Experience & Safety Summary</label>
                  <textarea
                    rows={2}
                    value={driverProfileData.bio}
                    onChange={(e) => setDriverProfileData({ ...driverProfileData, bio: e.target.value })}
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-950 resize-none"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowDriverDetailsModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDriverProfile}
                className="py-2.5 px-5 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Save & Update Driver Profile</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
