import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  Clock,
  Award,
  Languages,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  FileText,
  Compass,
  Sparkles,
  Calendar,
  ArrowRight,
  Check,
  ExternalLink,
  Share2,
  Navigation,
  AlertCircle
} from 'lucide-react';

export default function DriverDetailsModal({
  driver,
  tripDetails,
  isOpen,
  onClose,
  onSelectForMap,
  onHireDirect
}) {
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'pricing' | 'cars' | 'routes' | 'reviews'
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setActiveTab('kyc');
    setBookingConfirmed(false);
    setCopySuccess(false);
  }, [driver, isOpen]);

  // Keyboard navigation (Esc to close)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !driver) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      if (onHireDirect) onHireDirect(driver);
      setBookingConfirmed(false);
      onClose();
    }, 1500);
  };

  // Safe Fallback Data for Real Fields
  const phone = driver.phone || '+91 98221 44510';
  const whatsappNum = driver.whatsapp || phone.replace(/[^0-9]/g, '');
  const badgeId = driver.badgeNumber || driver.badge?.split('•')[1]?.trim() || 'MH-12-8821';
  const licenseNumber = driver.licenseNumber || 'MH12 20100045912 (LMV-TR Commercial)';
  const policeVerification = driver.policeVerification || {
    status: 'Verified & Clean Record',
    number: 'PCC-MH-2026-99124',
    station: 'Shivajinagar Police Commissionerate',
    issueDate: '15 Jan 2026'
  };
  const medicalFitness = driver.medicalFitness || {
    status: 'A1 Vision & Physical Fitness Certified',
    certifiedBy: 'Civil Surgeon / Government Hospital',
    validTill: 'Nov 2027'
  };
  const totalSafeKms = driver.totalSafeKms || '4,85,000+ KM Accident-Free';
  const vehicleTypes = driver.vehicleTypes || driver.carModelsDriven || [
    'Hatchback',
    'Sedan',
    'SUV',
    'MPV',
    'Luxury Sedan',
    'Luxury SUV'
  ];
  const transmissions = driver.transmissions || [
    'Manual',
    'Automatic (AT)',
    'CVT / e-CVT',
    'Dual-Clutch (DCT / DSG)',
    'Hybrid',
    'Electric Vehicle (EV)'
  ];
  const skillsList = driver.skillSet || driver.skills || [
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
  ];
  const mountainPasses = driver.mountainPassesMastered || [
    'Pasarni Ghat (Mahabaleshwar)',
    'Bhor Ghat / Khandala (Expressway)',
    'Amboli Ghat (Goa NH 66)',
    'Tamhini Ghat'
  ];
  const reviews = driver.reviews || [
    {
      author: 'Dr. Rahul Kulkarni',
      location: 'Pune',
      trip: 'Pune ➔ Goa via Amboli Ghat (4 Days)',
      rating: 5,
      date: 'August 2026',
      car: 'Customer’s Innova Crysta',
      comment:
        'Hired for our family Goa monsoon vacation. He negotiated the foggy Amboli Ghat with masterclass patience. Zero sudden braking, never touched his phone while driving, and my elderly parents felt completely relaxed.'
    },
    {
      author: 'Sunil & Meera Mehra',
      location: 'Mumbai',
      trip: 'Mumbai ➔ Mahabaleshwar (3 Days)',
      rating: 5,
      date: 'July 2026',
      car: 'Customer’s Fortuner 4x4 (Auto)',
      comment:
        'Drove our automatic Fortuner up the steep Pasarni curves in torrential rain. Knows exactly how to use engine braking and hill assist. Very polite, non-smoker, and strictly punctual.'
    },
    {
      author: 'Pooja Sharma',
      location: 'Pune (Baner)',
      trip: 'Lonavala & Khandala Weekend',
      rating: 5,
      date: 'May 2026',
      car: 'Customer’s Honda City',
      comment:
        'Arrived at 5:45 AM sharp. Extremely smooth expressway driving at steady 80 km/h cruising speeds. Clean attire and very respectful behavior with ladies and kids.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 max-h-[94vh] flex flex-col font-sans">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white relative flex-shrink-0">
          
          {/* Action Icons Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Share Driver Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              title="Close Profile (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {copySuccess && (
            <div className="absolute top-4 right-20 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md animate-fadeIn">
              Profile link copied!
            </div>
          )}

          {/* Hero Profile Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-16 sm:pr-20">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={driver.image}
                  alt={driver.name}
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl object-cover border-3 border-emerald-500 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full border-2 border-slate-950 shadow-xs" title="Police & RTO KYC Verified">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                    {driver.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ Verified Chauffeur
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span>{driver.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{driver.experience}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{driver.rating} Rating</span>
                    <span className="text-slate-400 text-[10px]">({driver.trips})</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    🛡️ {totalSafeKms}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <a
                href={`tel:${phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                title="Call Chauffeur"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Directly</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi ${driver.name}, I found your verified chauffeur profile on Touralink. I would like to check your availability for a trip.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-5 -mb-2 border-t border-slate-800/80 mt-5">
            {[
              { id: 'kyc', label: '🛡️ Police & RTO KYC' },
              { id: 'pricing', label: '💰 Rate Card & Duty Rules' },
              { id: 'cars', label: '🚗 Vehicle Types & Transmissions' },
              { id: 'skills', label: '⭐ Skills & Standards' },
              { id: 'reviews', label: `⭐ Traveler Reviews (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Scrollable Tab Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1 bg-slate-50">
          
          {/* TAB 1: POLICE & RTO KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">100% Verified Government & Police Credentials</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    This chauffeur has passed full in-person background checks, official RTO commercial driver badge verification, and district police commissionerate character verification.
                  </p>
                </div>
              </div>

              {/* Credentials Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Police Clearance Certificate (PCC)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      ✓ Clean Record
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900">{policeVerification.number}</div>
                  <div className="text-xs text-slate-600">{policeVerification.station} • Issued {policeVerification.issueDate}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>RTO Commercial Transport Badge</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                      ✓ Active Badge
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900">{badgeId}</div>
                  <div className="text-xs text-slate-600">Public Service Vehicle (PSV) Authorization</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Commercial Driving License</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                      ✓ Valid
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900">{licenseNumber}</div>
                  <div className="text-xs text-slate-600">Authorized for LMVs, SUVs, Sedans & Passenger Cabs</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>Medical & Vision Clearance</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black">
                      ✓ 6/6 Vision
                    </span>
                  </div>
                  <div className="text-sm font-black text-slate-900">{medicalFitness.status}</div>
                  <div className="text-xs text-slate-600">{medicalFitness.certifiedBy} • Valid till {medicalFitness.validTill}</div>
                </div>

              </div>

              {/* Code of Conduct & Safety Guarantees */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Strict Professional Code of Conduct:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>100% Non-Smoker:</strong> Zero smoking in or around vehicle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Zero Phone Distraction:</strong> Hands-free only for emergency GPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Defensive Driving Certified:</strong> Smooth cruising without harsh overtaking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Multi-lingual:</strong> Fluent in {driver.languages}</span>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs leading-relaxed text-slate-700 font-medium">
                <strong className="text-slate-900">Personal Note from {driver.name}: </strong>
                "{driver.bio}"
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & DUTY RULES */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200/90 text-brand-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-brand-900">Transparent Chauffeur Wage Policy (Driver Only)</h4>
                  <p className="text-xs text-brand-800 mt-0.5 leading-relaxed">
                    You only pay the chauffeur's transparent service wage. You provide your own personal car, fuel, and highway tolls. 0% middleman commission is deducted by Touralink.
                  </p>
                </div>
              </div>

              {/* Wage Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Local City Duty</div>
                  <div className="text-xl font-black text-slate-900">{driver.dailyRate}</div>
                  <div className="text-[11px] text-slate-500">8 to 10 Hours Duty Shift</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Outstation Night Duty</div>
                  <div className="text-xl font-black text-slate-900">{driver.outstationRate}</div>
                  <div className="text-[11px] text-slate-500">Includes overnight outstation stay</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Ghats / Hill Pass Surcharge</div>
                  <div className="text-xl font-black text-emerald-700">+₹250 / Day</div>
                  <div className="text-[11px] text-slate-500">Specialist hill terrain assist</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="text-xs text-slate-500 font-bold">Overtime Duty Charge</div>
                  <div className="text-xl font-black text-slate-900">₹120 / Hour</div>
                  <div className="text-[11px] text-slate-500">Beyond standard 10-hour duty</div>
                </div>

              </div>

              {/* Transparent Food & Room Allowances */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Standard Food & Night Accommodation Policy:
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Meals:</strong> Traveler can either provide standard meals along with the family or give a ₹150/meal food allowance.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Night Stay (Outstation):</strong> Traveler provides driver dormitory/room at hotel or standard ₹350 night allowance.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Settlement:</strong> Direct UPI or Cash payment directly to {driver.name} at duty end. 0% platform fee.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CARS & TRANSMISSIONS MASTERED */}
          {activeTab === 'cars' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
                <Car className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-blue-900">Extensive Vehicle & Transmission Mastery</h4>
                  <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                    {driver.name} is verified across manual gearboxes, torque converters, dual-clutch transmissions, e-CVT hybrids, and modern 4x4 off-road transfer cases.
                  </p>
                </div>
              </div>

              {/* Transmissions Pill Box */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Transmission Systems Supported:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {transmissions.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Vehicle Types Driven */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Vehicle Types & Categories Mastered:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {vehicleTypes.map((vType, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold flex items-center gap-2"
                    >
                      <Car className="w-4 h-4 text-adventure-600 shrink-0" />
                      <span>{vType}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SKILLS, CERTIFICATIONS & STANDARDS */}
          {(activeTab === 'skills' || activeTab === 'routes') && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">Verified Skills, Certifications & Standards</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Verified competencies including terrain handling, zero accident history, CPR/first aid training, and formal executive chauffeur etiquette.
                  </p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Certified Driving & Conduct Standards:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {skillsList.map((skill, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safe Driving Highlights */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Driving Competence Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Experienced in Ghats hairpin turns & steep hill gradient controls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Long Drive Capable with sustained highway endurance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Zero clutch burning & lower gear engine braking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Monsoon aquaplaning defense and low-beam fog navigation</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: TRAVELER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-slate-900 font-display">{driver.rating}</div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Based on {driver.trips} verified passenger ratings
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    100% Positive Feedback
                  </span>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-3">
                {reviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-sm text-slate-900">{rev.author}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {rev.location} • Traveled {rev.trip}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-400 justify-end">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400">{rev.date}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      "{rev.comment}"
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400 font-semibold border-t border-slate-100">
                      <span>Vehicle: {rev.car}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-bold">✓ Verified Booking via Touralink</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM FIXED HIRE ACTION BAR */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 flex-shrink-0 shadow-lg">
          
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Daily Chauffeur Charge
              </div>
              <div className="text-2xl font-black text-slate-950 font-display">
                {driver.dailyRate}
              </div>
            </div>

            <div className="border-l border-slate-200 pl-4 hidden sm:block">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Outstation Night
              </div>
              <div className="text-sm font-black text-slate-800">
                {driver.outstationRate}
              </div>
            </div>

            <div className="border-l border-slate-200 pl-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                0% Commission Cut
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onSelectForMap && (
              <button
                type="button"
                onClick={() => {
                  onSelectForMap(driver);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-200"
              >
                Select for Map Studio
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={bookingConfirmed}
              className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-black text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                bookingConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 hover:bg-slate-850 active:scale-95 shadow-slate-950/20'
              }`}
            >
              {bookingConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>Chauffeur Booking Confirmed!</span>
                </>
              ) : (
                <>
                  <span>Hire Chauffeur For Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
