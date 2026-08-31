import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import Input from '../Common/Input';
import Logo from '../Common/Logo';
import SocialButtons from './SocialButtons';
import ShowcasePanel from './ShowcasePanel';

export default function AuthModal({ onLoginSuccess }) {
  const [authStep, setAuthStep] = useState('credentials'); // 'credentials' | 'partner_type_selection' | 'fleet_details'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot-password'
  const [role, setRole] = useState('traveler'); // 'traveler' | 'driver_partner'
  const [partnerType, setPartnerType] = useState('individual_driver'); // 'individual_driver' | 'fleet_partner'
  const [pendingAuthUser, setPendingAuthUser] = useState(null);
  
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

      const user = {
        name: formData.fullName || (role === 'driver_partner' ? 'Ramesh Shinde' : formData.email.split('@')[0]),
        email: formData.email,
        phone: formData.phone || '+91 98220 12345',
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
      const user = {
        name: role === 'driver_partner' ? `${provider} Partner` : `${provider} Explorer`,
        email: `${role === 'driver_partner' ? 'partner' : 'traveler'}@${provider.toLowerCase()}.com`,
        phone: '+91 98220 54321',
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

  const handleStep2Continue = () => {
    if (partnerType === 'fleet_partner') {
      // Move to Step 3: Fleet location and vehicle count
      setAuthStep('fleet_details');
    } else {
      // Individual Driver: Complete immediately
      const finalUser = {
        ...(pendingAuthUser || {
          name: 'Ramesh Shinde',
          email: 'driver@touralink.in',
          role: 'driver_partner',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        }),
        partnerType: 'individual_driver'
      };
      if (onLoginSuccess) {
        onLoginSuccess(finalUser);
      }
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
                        onClick={() => setRole('traveler')}
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
                        onClick={() => setRole('driver_partner')}
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
                        Or continue with email
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

                  {/* Phone (Optional for Sign Up) */}
                  {authMode === 'signup' && (
                    <Input
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      icon={Phone}
                    />
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
                      {partnerType === 'individual_driver' ? 'Continue as Individual Driver' : 'Next: Setup Fleet Location & Size'}
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

          </div>
        </div>
      </div>
    </div>
  );
}
