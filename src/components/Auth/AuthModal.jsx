import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Check, 
  Car,
  UserCheck,
  Users,
  ShieldCheck,
  MapPin,
  FileText,
  Award,
  Navigation,
  Eye,
  IndianRupee,
  Camera,
  Upload
} from 'lucide-react';
import Input from '../Common/Input';
import Logo from '../Common/Logo';
import SocialButtons from './SocialButtons';
import ShowcasePanel from './ShowcasePanel';
import { registerOrUpdateDriver } from '../../services/driverService';

export default function AuthModal({ onLoginSuccess, initialRole, initialStep }) {
  const [authStep, setAuthStep] = useState(
    initialStep || (initialRole === 'driver_partner' ? 'partner_type_selection' : 'credentials')
  ); // 'credentials' | 'partner_type_selection' | 'driver_details' | 'fleet_details'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot-password'
  const [role, setRole] = useState(initialRole || 'traveler'); // 'traveler' | 'driver_partner'
  const [partnerType, setPartnerType] = useState('individual_driver'); // 'individual_driver' | 'fleet_partner'
  const [pendingAuthUser, setPendingAuthUser] = useState(null);
  
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
      if (initialRole === 'driver_partner' && !initialStep) {
        setAuthStep('partner_type_selection');
      }
    }
  }, [initialRole]);

  useEffect(() => {
    if (initialStep) {
      setAuthStep(initialStep);
      if (initialStep === 'partner_type_selection' || initialStep === 'driver_details' || initialStep === 'fleet_details') {
        setRole('driver_partner');
      }
    }
  }, [initialStep]);
  
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Individual Chauffeur Step 3 Real KYC & Profile State
  const [driverDetails, setDriverDetails] = useState({
    fullName: 'Ramesh Shinde',
    phone: '+91 98221 44510',
    email: 'ramesh.shinde@touralink.in',
    avatarImage: '',
    licenseNumber: 'MH12 20120045912 (LMV-TR Transport Commercial)',
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
  });

  // Fleet Partner Step 3 State
  const [fleetDetails, setFleetDetails] = useState({
    agencyName: '',
    state: 'Maharashtra',
    city: 'Mumbai / Pune',
    vehicleCount: '4 - 10 Commercial Vehicles',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (authMode !== 'forgot-password') {
      if (!formData.phone || !formData.phone.trim()) {
        newErrors.phone = 'Phone number is required (preferably WhatsApp number)';
      } else {
        const digits = formData.phone.replace(/[^0-9]/g, '');
        if (digits.length < 10) {
          newErrors.phone = 'Please enter a valid 10-digit mobile number';
        }
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!agreeTerms) {
        newErrors.terms = 'You must agree to the Terms & Privacy Policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'forgot-password') {
        setStatusMessage({
          type: 'success',
          text: `A recovery link has been dispatched to ${formData.email}. Please check your inbox.`,
        });
        return;
      }

      const formattedPhone = formData.phone.trim().startsWith('+')
        ? formData.phone.trim()
        : `+91 ${formData.phone.trim()}`;

      const user = {
        name: formData.fullName || (role === 'driver_partner' ? 'Ramesh Shinde' : formData.email.split('@')[0]),
        email: formData.email,
        phone: formattedPhone,
        whatsappPhone: formattedPhone,
        role: role,
        avatar: role === 'driver_partner'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };

      if (role === 'driver_partner') {
        // Transition to partner question step: Individual Driver vs Fleet Partner
        setPendingAuthUser(user);
        setAuthStep('partner_type_selection');
      } else {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    }, 900);
  };

  const handleSocialAuth = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const formattedPhone = formData.phone?.trim()
        ? (formData.phone.trim().startsWith('+') ? formData.phone.trim() : `+91 ${formData.phone.trim()}`)
        : '+91 98220 54321';

      const user = {
        name: role === 'driver_partner' ? `${provider} Partner` : `${provider} Explorer`,
        email: `${role === 'driver_partner' ? 'partner' : 'traveler'}@${provider.toLowerCase()}.com`,
        phone: formattedPhone,
        whatsappPhone: formattedPhone,
        role: role,
        avatar: role === 'driver_partner'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      };

      if (role === 'driver_partner') {
        // Transition to partner question step: Individual Driver vs Fleet Partner
        setPendingAuthUser(user);
        setAuthStep('partner_type_selection');
      } else {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }
    }, 700);
  };

  const toggleDriverVehicleType = (vType) => {
    setDriverDetails((prev) => {
      const current = prev.vehicleTypes || [];
      const exists = current.includes(vType);
      const next = exists ? current.filter(t => t !== vType) : [...current, vType];
      return { ...prev, vehicleTypes: next.length > 0 ? next : [vType] };
    });
  };

  const toggleDriverTransmission = (trans) => {
    setDriverDetails((prev) => {
      const current = prev.transmissions || [];
      const exists = current.includes(trans);
      const next = exists ? current.filter(t => t !== trans) : [...current, trans];
      return { ...prev, transmissions: next.length > 0 ? next : [trans] };
    });
  };

  const toggleDriverSkill = (skill) => {
    setDriverDetails((prev) => {
      const current = prev.skillSet || [];
      const exists = current.includes(skill);
      const next = exists ? current.filter(s => s !== skill) : [...current, skill];
      return { ...prev, skillSet: next.length > 0 ? next : [skill] };
    });
  };

  const handleDriverPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const dataUrl = loadEvt.target.result;
        setDriverDetails((prev) => ({
          ...prev,
          avatarImage: dataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStep2Continue = () => {
    if (partnerType === 'fleet_partner') {
      // Move to Step 3: Fleet location and vehicle count
      setAuthStep('fleet_details');
    } else {
      // Move to Step 3: Put Driver Details & Real KYC Data
      setAuthStep('driver_details');
    }
  };

  const handleCompleteDriverOnboarding = () => {
    const driverId = `driver_${Date.now()}`;
    const driverName = driverDetails.fullName?.trim() || formData.fullName?.trim() || pendingAuthUser?.name || 'Ramesh Shinde';
    const rawPhone = driverDetails.phone?.trim() || formData.phone?.trim() || '+91 98221 44510';
    const driverPhone = rawPhone.startsWith('+') ? rawPhone : `+91 ${rawPhone}`;
    const driverEmail = driverDetails.email?.trim() || formData.email?.trim() || 'driver@touralink.in';

    const newDriverProfile = {
      id: driverId,
      name: driverName,
      location: driverDetails.operatingCity,
      phone: driverPhone,
      whatsapp: driverPhone.replace(/[^0-9]/g, ''),
      email: driverEmail,
      category: 'ghats',
      categoryLabel: 'Verified Personal Chauffeur',
      image: driverDetails.avatarImage || pendingAuthUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: driverDetails.experienceYears,
      badge: `Police Verified • ${driverDetails.badgeNumber}`,
      badgeNumber: driverDetails.badgeNumber,
      licenseNumber: driverDetails.licenseNumber,
      policeVerification: {
        status: 'Verified & Clean Record',
        number: driverDetails.pccNumber,
        station: driverDetails.policeStation,
        issueDate: '15 Jan 2026'
      },
      medicalFitness: {
        status: driverDetails.medicalFitness,
        certifiedBy: 'Civil Hospital / Sassoon General Hospital',
        validTill: 'Nov 2028'
      },
      totalSafeKms: driverDetails.totalSafeKms,
      specialty: (driverDetails.skillSet || []).slice(0, 3).join(' • '),
      carExpertise: (driverDetails.vehicleTypes || []).join(', '),
      carModelsDriven: driverDetails.vehicleTypes || [],
      vehicleTypes: driverDetails.vehicleTypes || [],
      transmissions: driverDetails.transmissions || [],
      skills: driverDetails.skillSet || [],
      skillSet: driverDetails.skillSet || [],
      mountainPassesMastered: (driverDetails.skillSet || []).filter(s => s.toLowerCase().includes('ghat')),
      languages: driverDetails.languages,
      dailyRate: driverDetails.dailyRate,
      outstationRate: driverDetails.outstationRate,
      rating: '5.0',
      trips: 'New Verified Chauffeur',
      bio: driverDetails.bio,
      isOnline: true
    };

    // Save into central verified drivers pool
    registerOrUpdateDriver(newDriverProfile);

    const finalUser = {
      ...(pendingAuthUser || {
        name: driverName,
        email: driverEmail,
        phone: driverPhone,
        role: 'driver_partner',
        avatar: newDriverProfile.image,
      }),
      id: driverId,
      partnerType: 'individual_driver',
      driverDetails: {
        ...driverDetails,
        fullName: driverName,
        phone: driverPhone,
        email: driverEmail
      }
    };

    if (onLoginSuccess) {
      onLoginSuccess(finalUser);
    }
  };

  const handleCompleteFleetOnboarding = () => {
    const finalUser = {
      ...(pendingAuthUser || {
        name: 'Sahyadri Fleet Partner',
        email: 'fleet@touralink.in',
        role: 'driver_partner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      }),
      partnerType: 'fleet_partner',
      fleetDetails: {
        agencyName: fleetDetails.agencyName || 'Sahyadri Travels & Commercial Fleet',
        state: fleetDetails.state,
        city: fleetDetails.city,
        vehicleCount: fleetDetails.vehicleCount
      }
    };

    if (onLoginSuccess) {
      onLoginSuccess(finalUser);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Outer Card Container */}
      <div className="relative rounded-3xl bg-white p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
        
        {/* Background Ambient Pastel Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 aurora-glow-1 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 aurora-glow-2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Dynamic Travel Showcase */}
          <div className="lg:col-span-6 hidden lg:block">
            <ShowcasePanel />
          </div>

          {/* Right: Auth Form / Partner Onboarding Panel */}
          <div className="lg:col-span-6 flex flex-col justify-center py-2 sm:py-4">
            
            {/* STEP 1: AUTHENTICATION (Login / Sign Up) */}
            {authStep === 'credentials' && (
              <>
                {/* Brand Logo & Role Toggle Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <Logo size="md" />

                  {/* Traveler vs Driver / Partner Toggle */}
                  {authMode !== 'forgot-password' && (
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setRole('traveler');
                          setAuthStep('credentials');
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          role === 'traveler'
                            ? 'bg-slate-950 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Traveler</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRole('driver_partner');
                          setAuthStep('partner_type_selection');
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          role === 'driver_partner'
                            ? 'bg-slate-950 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Driver / Partner</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
                {authMode !== 'forgot-password' && (
                  <div className="flex border-b border-slate-200 mb-6">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrors({}); }}
                      className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                        authMode === 'login'
                          ? 'text-slate-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Sign In to Account
                      {authMode === 'login' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrors({}); }}
                      className={`ml-8 pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                        authMode === 'signup'
                          ? 'text-slate-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Create New Account
                      {authMode === 'signup' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
                      )}
                    </button>
                  </div>
                )}

                {/* Chauffeur Partner Active Callout */}
                {role === 'driver_partner' && (
                  <div className="mb-6 p-4 rounded-2xl bg-adventure-50/90 border border-adventure-200 text-adventure-900 text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold flex items-center gap-1.5 text-adventure-900">
                        <ShieldCheck className="w-4 h-4 text-adventure-700" />
                        <span>Chauffeur & Fleet Partner Portal</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        0% Commission
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px] font-medium leading-relaxed">
                      Register as a personal car chauffeur (₹850 - ₹1,200/day direct wages) or commercial fleet partner across Maharashtra, Goa, Gujarat & Karnataka.
                    </p>
                    <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Step 1: Sign In/Up ➔ Step 2: Driver Type ➔ Step 3: Enter Real KYC & License
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setRole('driver_partner');
                          setAuthStep('partner_type_selection');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 text-white text-[11px] font-black hover:bg-slate-850 transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-400" />
                        <span>Select Profile: Driver vs Fleet →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Header */}
                {authMode === 'forgot-password' && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrors({}); }}
                      className="text-xs text-brand-600 hover:text-brand-700 font-bold mb-3 flex items-center gap-1 cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-display">Reset Password</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter your registered email address and we'll send you recovery instructions.
                    </p>
                  </div>
                )}

                {/* Status Message */}
                {statusMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-600 mt-0.5" />
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                {/* Social Logins */}
                {authMode !== 'forgot-password' && (
                  <div className="space-y-4 mb-6">
                    <SocialButtons onSocialAuth={handleSocialAuth} />
                    
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-slate-200 w-full" />
                      <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
                        Or continue with email & phone
                      </span>
                    </div>
                  </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name (Sign Up only) */}
                  {authMode === 'signup' && (
                    <Input
                      label="Full Name"
                      id="fullName"
                      placeholder="e.g. Rahul Sharma / Ramesh Shinde"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      icon={User}
                      error={errors.fullName}
                      required
                    />
                  )}

                  {/* Email Address */}
                  <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    icon={Mail}
                    error={errors.email}
                    required
                    autoComplete="email"
                  />

                  {/* Phone Number (Both Login & Sign Up) */}
                  {authMode !== 'forgot-password' && (
                    <div className="space-y-1.5">
                      <Input
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        placeholder="e.g. 98765 43210 or +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        icon={Phone}
                        error={errors.phone}
                        required
                        helperText="preferably WhatsApp number"
                        autoComplete="tel"
                      />
                      <div className="flex items-center gap-1.5 px-1 text-[11px] text-emerald-700 font-medium">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>preferably WhatsApp number (for instant booking, driver & fleet alerts)</span>
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  {authMode !== 'forgot-password' && (
                    <Input
                      label="Password"
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      icon={Lock}
                      error={errors.password}
                      required
                      autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                    />
                  )}

                  {/* Confirm Password (Sign Up only) */}
                  {authMode === 'signup' && (
                    <Input
                      label="Confirm Password"
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      icon={Lock}
                      error={errors.confirmPassword}
                      required
                      autoComplete="new-password"
                    />
                  )}

                  {/* Remember Me & Forgot Password (Login only) */}
                  {authMode === 'login' && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20"
                        />
                        <span>Remember me on this device</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot-password'); setErrors({}); }}
                        className="text-brand-600 hover:text-brand-700 font-bold transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Terms Agreement (Sign Up only) */}
                  {authMode === 'signup' && (
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20"
                        />
                        <span>
                          I agree to Touralink's{' '}
                          <a href="#terms" className="text-brand-600 font-semibold hover:underline">Terms of Service</a> and{' '}
                          <a href="#privacy" className="text-brand-600 font-semibold hover:underline">Privacy Policy</a>.
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{errors.terms}</p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.99] shadow-xl shadow-slate-950/20 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Processing {authMode === 'signup' ? 'Registration' : 'Access'}...</span>
                      </div>
                    ) : (
                      <>
                        <span>
                          {authMode === 'login' && (role === 'driver_partner' ? 'Sign In as Driver / Partner' : 'Sign In to Touralink')}
                          {authMode === 'signup' && `Register as ${role === 'driver_partner' ? 'Driver Partner' : 'Traveler'}`}
                          {authMode === 'forgot-password' && 'Send Recovery Instructions'}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom Footer Note */}
                <div className="mt-8 text-center text-xs font-medium text-slate-400">
                  Direct Driver & Cab Rentals • Maharashtra • Goa • Gujarat • Karnataka
                </div>
              </>
            )}

            {/* STEP 2: PARTNER TYPE SELECTION QUESTION */}
            {authStep === 'partner_type_selection' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Back Button & Step Badge Header */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthStep('credentials')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>

                  <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black">
                    Step 2 of 3 • Partner Type
                  </span>
                </div>

                {/* Question Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                    Are you an <span className="text-brand-600">Individual Driver</span> or a <span className="text-adventure-600">Fleet Partner</span>?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Select your partner profile so we can configure your live broadcasts, rate settings, and vehicle dispatch tools.
                  </p>
                </div>

                {/* Two Selectable Cards */}
                <div className="space-y-4 pt-2">
                  
                  {/* Option 1: Individual Driver / Chauffeur */}
                  <div
                    onClick={() => setPartnerType('individual_driver')}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      partnerType === 'individual_driver'
                        ? 'border-slate-950 bg-slate-50/90 shadow-md ring-2 ring-slate-950/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      partnerType === 'individual_driver'
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <UserCheck className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-sm text-slate-900">
                          Individual Driver / Chauffeur
                        </div>
                        {partnerType === 'individual_driver' && (
                          <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-semibold">
                        Solo Commercial Badge Chauffeur • Own Car or Customer Car
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pt-1">
                        I am an individual driver. I drive my own single vehicle or provide professional chauffeur driving services for customers' personal vehicles.
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ Outstation & Ghats Duty
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ Direct 1-on-1 Bookings
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ 100% Direct UPI Settlement
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Fleet Partner / Cab Operator */}
                  <div
                    onClick={() => setPartnerType('fleet_partner')}
                    className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      partnerType === 'fleet_partner'
                        ? 'border-slate-950 bg-slate-50/90 shadow-md ring-2 ring-slate-950/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      partnerType === 'fleet_partner'
                        ? 'bg-slate-950 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-sm text-slate-900">
                          Fleet Partner / Cab Operator
                        </div>
                        {partnerType === 'fleet_partner' && (
                          <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 font-semibold">
                        Multi-Vehicle Fleet • Fleet Agency & Cab Network
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pt-1">
                        I own or operate a commercial fleet with multiple cabs (Innova Crysta, Ertiga, SUVs, Tempo Travelers) and employ/manage assigned drivers.
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ Multi-Cab Broadcast Dispatch
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ Virtual Garage & Vehicle Inventory
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                          ✓ 0% Platform Commission
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Continue CTA Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleStep2Continue}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.99] shadow-xl shadow-slate-950/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>
                      {partnerType === 'individual_driver' ? 'Next: Enter Driver Details & Real KYC' : 'Next: Setup Fleet Location & Size'}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="text-center text-xs text-slate-400 font-medium">
                    You can manage rate cards and verified documents anytime in your dashboard.
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: FLEET PARTNER LOCATION & VEHICLE COUNT QUESTION */}
            {authStep === 'fleet_details' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Back Button & Step Badge Header */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setAuthStep('partner_type_selection')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <span className="px-3 py-1 rounded-full bg-adventure-50 border border-adventure-200 text-adventure-700 text-xs font-black">
                    Step 3 of 3 • Fleet Location & Scale
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                    Fleet Agency <span className="text-brand-600">Location</span> & <span className="text-adventure-600">Fleet Size</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Tell us where your fleet operates and your current vehicle capacity to configure your Virtual Garage.
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 pt-1">
                  
                  {/* Agency Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Fleet Agency / Business Name
                    </label>
                    <input
                      type="text"
                      value={fleetDetails.agencyName}
                      onChange={(e) => setFleetDetails({ ...fleetDetails, agencyName: e.target.value })}
                      placeholder="e.g. Sahyadri Travels & Cabs / Goa Beachway Fleet"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  {/* Operational State */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Primary Operating State
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Maharashtra', 'Goa', 'Gujarat', 'Karnataka'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFleetDetails({ ...fleetDetails, state: st })}
                          className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                            fleetDetails.state === st
                              ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operating Hub / City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Base Operating Hub (City / District)
                    </label>
                    <input
                      type="text"
                      value={fleetDetails.city}
                      onChange={(e) => setFleetDetails({ ...fleetDetails, city: e.target.value })}
                      placeholder="e.g. Mumbai / Pune / Panaji / Ahmedabad / Bengaluru"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    />
                  </div>

                  {/* Fleet Size (Vehicle Count) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-800">
                      How many commercial vehicles do you own/manage?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['1 - 3 Vehicles', '4 - 10 Vehicles', '11 - 25 Vehicles', '25+ Commercial Fleet'].map((countOption) => (
                        <button
                          key={countOption}
                          type="button"
                          onClick={() => setFleetDetails({ ...fleetDetails, vehicleCount: countOption })}
                          className={`p-3 rounded-xl text-xs font-extrabold border text-left flex items-center justify-between transition-all cursor-pointer ${
                            fleetDetails.vehicleCount === countOption
                              ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{countOption}</span>
                          {fleetDetails.vehicleCount === countOption && (
                            <Check className="w-3.5 h-3.5 text-brand-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Complete CTA Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleCompleteFleetOnboarding}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.99] shadow-xl shadow-slate-950/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Launch Virtual Garage & Fleet Command</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="text-center text-xs text-slate-400 font-medium">
                    You can add commercial vehicles and verify RTO number plates in the garage.
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: INDIVIDUAL DRIVER VERIFICATION & REAL KYC DETAILS */}
            {authStep === 'driver_details' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Back Button & Step Badge Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAuthStep('partner_type_selection')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors cursor-pointer px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Partner Selection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRole('traveler');
                        setAuthStep('credentials');
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer hover:underline"
                    >
                      Switch to Traveler
                    </button>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Driver KYC & Real Data Form</span>
                  </span>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                    Enter <span className="text-brand-600">Verified Chauffeur</span> & <span className="text-adventure-600">KYC Details</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Provide your commercial driving permit, police clearance certificate, and car mastery. Your listing will immediately go live on Touralink with 0% platform commission.
                  </p>
                </div>

                {/* Form Sections */}
                <div className="space-y-5 pt-1 max-h-[60vh] overflow-y-auto pr-1">
                  
                  {/* Section 0: Chauffeur Name, Phone, Email & Device Photo Upload */}
                  <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/90 space-y-4">
                    <div className="text-xs font-black text-brand-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-600" />
                      <span>0. Chauffeur Personal & Contact Identity</span>
                    </div>

                    {/* Photo Uploader from Device */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-brand-200/80 shadow-xs">
                      <div className="relative shrink-0 w-16 h-16">
                        <img
                          src={driverDetails.avatarImage || pendingAuthUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                          alt="Chauffeur Preview"
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
                          Upload your authentic portrait directly from your device (JPG, PNG, WebP)
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <label className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Choose Photo from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleDriverPhotoUpload}
                            />
                          </label>

                          {driverDetails.avatarImage && (
                            <button
                              type="button"
                              onClick={() => setDriverDetails({ ...driverDetails, avatarImage: '' })}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Driver Full Name</label>
                        <input
                          type="text"
                          value={driverDetails.fullName}
                          onChange={(e) => setDriverDetails({ ...driverDetails, fullName: e.target.value })}
                          placeholder="e.g. Ramesh Shinde"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">WhatsApp / Mobile Phone</label>
                        <input
                          type="text"
                          value={driverDetails.phone}
                          onChange={(e) => setDriverDetails({ ...driverDetails, phone: e.target.value })}
                          placeholder="e.g. +91 98221 44510"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          value={driverDetails.email}
                          onChange={(e) => setDriverDetails({ ...driverDetails, email: e.target.value })}
                          placeholder="e.g. ramesh.shinde@touralink.in"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 1: RTO & Police KYC */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>1. Government Licenses & Police Verification</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Commercial DL Number</label>
                        <input
                          type="text"
                          value={driverDetails.licenseNumber}
                          onChange={(e) => setDriverDetails({ ...driverDetails, licenseNumber: e.target.value })}
                          placeholder="e.g. MH12 20120045912 (LMV-TR)"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">RTO Transport Badge ID</label>
                        <input
                          type="text"
                          value={driverDetails.badgeNumber}
                          onChange={(e) => setDriverDetails({ ...driverDetails, badgeNumber: e.target.value })}
                          placeholder="e.g. MH-12-8821"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Police Clearance (PCC) No.</label>
                        <input
                          type="text"
                          value={driverDetails.pccNumber}
                          onChange={(e) => setDriverDetails({ ...driverDetails, pccNumber: e.target.value })}
                          placeholder="e.g. PCC-MH-2026-99124"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Police Commissionerate / Station</label>
                        <input
                          type="text"
                          value={driverDetails.policeStation}
                          onChange={(e) => setDriverDetails({ ...driverDetails, policeStation: e.target.value })}
                          placeholder="e.g. Shivajinagar Commissionerate, Pune"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="font-bold text-slate-700 text-xs">Medical & Vision Fitness</label>
                      <input
                        type="text"
                        value={driverDetails.medicalFitness}
                        onChange={(e) => setDriverDetails({ ...driverDetails, medicalFitness: e.target.value })}
                        placeholder="e.g. A1 Vision & Physical Fitness Certified"
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                      />
                    </div>
                  </div>

                  {/* Section 2: Experience & Operating Base */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-adventure-600" />
                      <span>2. Driving Experience & Operating Base</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Experience (Years)</label>
                        <input
                          type="text"
                          value={driverDetails.experienceYears}
                          onChange={(e) => setDriverDetails({ ...driverDetails, experienceYears: e.target.value })}
                          placeholder="e.g. 12 Years Driving Experience"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Accident-Free Distance</label>
                        <input
                          type="text"
                          value={driverDetails.totalSafeKms}
                          onChange={(e) => setDriverDetails({ ...driverDetails, totalSafeKms: e.target.value })}
                          placeholder="e.g. 4,50,000+ KM Accident-Free"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Primary Hub / City</label>
                        <input
                          type="text"
                          value={driverDetails.operatingCity}
                          onChange={(e) => setDriverDetails({ ...driverDetails, operatingCity: e.target.value })}
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
                        <span>3. Transparent Chauffeur Wage (100% Direct Payout)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        0% Middleman Cut
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Daily Shift Rate (8-10 Hours)</label>
                        <input
                          type="text"
                          value={driverDetails.dailyRate}
                          onChange={(e) => setDriverDetails({ ...driverDetails, dailyRate: e.target.value })}
                          placeholder="e.g. ₹950 / Day"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Outstation Night Stay Duty</label>
                        <input
                          type="text"
                          value={driverDetails.outstationRate}
                          onChange={(e) => setDriverDetails({ ...driverDetails, outstationRate: e.target.value })}
                          placeholder="e.g. ₹1,250 / Night Outstation"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Vehicles & Transmissions Handled */}
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
                          const active = (driverDetails.vehicleTypes || []).includes(vType);
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
                          const active = (driverDetails.transmissions || []).includes(trans);
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
                        const active = (driverDetails.skillSet || []).includes(skill);
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
                      <label className="font-bold text-slate-700">Languages Spoken</label>
                      <input
                        type="text"
                        value={driverDetails.languages}
                        onChange={(e) => setDriverDetails({ ...driverDetails, languages: e.target.value })}
                        placeholder="e.g. Marathi, Hindi, English"
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-950"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Chauffeur Bio & Experience Summary</label>
                      <textarea
                        rows={2}
                        value={driverDetails.bio}
                        onChange={(e) => setDriverDetails({ ...driverDetails, bio: e.target.value })}
                        placeholder="Brief summary of your driving experience, etiquette, and special skills..."
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-950 resize-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Complete CTA Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleCompleteDriverOnboarding}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-slate-950 hover:bg-slate-850 active:scale-[0.99] shadow-xl shadow-slate-950/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Complete Verification & Activate Driver Profile</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="text-center text-xs text-slate-400 font-medium">
                    Your verified badge and real KYC will be listed on Touralink for direct traveler bookings.
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
