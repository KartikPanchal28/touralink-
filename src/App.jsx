import React, { useState, useEffect } from 'react';
import AuthModal from './components/Auth/AuthModal';
import TravelerHome from './pages/TravelerHome';
import TripEstimationPage from './pages/TripEstimationPage';
import HireChauffeurPage from './pages/HireChauffeurPage';
import DriverPartnerHome from './pages/DriverPartnerHome';
import FleetPartnerHome from './pages/FleetPartnerHome';
import FleetPage from './pages/FleetPage';
import DriversPage from './pages/DriversPage';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('touralink_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const DEFAULT_TRIP_DETAILS = {
    serviceMode: 'car_driver',
    tripType: 'one_way',
    pickupLocation: 'Mumbai Airport (BOM)',
    additionalStops: [],
    dropoffLocation: 'North Goa (Baga / Calangute)',
    pickupDate: 'Tomorrow, 07:00 AM',
    pickupTimeSlot: '07:00 AM',
    returnDate: '3 Days Later',
    passengers: 4,
    largeBags: 2,
    smallBags: 2,
    vehicleCategory: 'all',
    estimatedDistance: 585,
    estimatedDuration: '10 hr 35 min',
    estimatedFare: {
      min: 7020,
      max: 8480,
      label: '₹7,020 - ₹8,480',
      unit: 'Transparent 585 KM Direct Fleet Estimate'
    },
    vehicleRecommendation: {
      type: 'muv',
      title: 'Toyota Innova Crysta / Maruti Ertiga (7-Seater)',
      reason: 'Recommended for 4 passengers + 2 large bags for spacious luggage boot and dual-AC comfort.'
    }
  };

  const DEFAULT_CHAUFFEUR_DETAILS = {
    serviceMode: 'driver_only',
    pickupLocation: 'Pune - Baner / Hinjewadi',
    dropoffLocation: 'Mahabaleshwar & Panchgani Ghats',
    carBrandModel: 'Toyota Fortuner 4x4',
    carType: 'suv',
    transmission: 'automatic',
    selectedSpecialty: 'ghats',
    pickupDate: 'Tomorrow Morning, 06:30 AM',
    tripDurationDays: 2,
    isOutstationNightStay: true,
    preferredLanguage: 'Marathi & Hindi',
    estimatedDistance: 260,
    estimatedDuration: '3 hr 30 min',
    estimatedFare: {
      label: '₹2,350',
      min: 2200,
      max: 2500,
      unit: '2 Days Outstation Chauffeur Duty'
    }
  };

  // Active Car & Cab Rental Configuration (Outstation commercial vehicles)
  const [tripDetails, setTripDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('touralink_trip_details');
      return saved ? JSON.parse(saved) : DEFAULT_TRIP_DETAILS;
    } catch {
      return DEFAULT_TRIP_DETAILS;
    }
  });

  // Active Personal Chauffeur Configuration (Hire driver for traveler's own car)
  const [chauffeurDetails, setChauffeurDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('touralink_chauffeur_details');
      return saved ? JSON.parse(saved) : DEFAULT_CHAUFFEUR_DETAILS;
    } catch {
      return DEFAULT_CHAUFFEUR_DETAILS;
    }
  });

  // Persist selections across views & browser refreshes
  useEffect(() => {
    try {
      localStorage.setItem('touralink_trip_details', JSON.stringify(tripDetails));
    } catch (_) {}
  }, [tripDetails]);

  useEffect(() => {
    try {
      localStorage.setItem('touralink_chauffeur_details', JSON.stringify(chauffeurDetails));
    } catch (_) {}
  }, [chauffeurDetails]);

  // Derive initial view from URL Hash
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (['fleet', 'drivers', 'estimate', 'hire_driver', 'home'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Sync state with browser native Back & Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (['fleet', 'drivers', 'estimate', 'hire_driver', 'home'].includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Safe navigation function that pushes to browser history
  const navigateTo = (view) => {
    setCurrentView(view);
    if (window.location.hash !== `#${view}`) {
      window.location.hash = view;
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('touralink_user', JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed to save touralink_user to localStorage', e);
    }
    navigateTo('home');
  };

  const [lastRoleBeforeLogout, setLastRoleBeforeLogout] = useState(() => {
    try {
      const saved = localStorage.getItem('touralink_user');
      if (saved) {
        return JSON.parse(saved)?.role;
      }
    } catch (_) {}
    return null;
  });

  const [initialAuthStep, setInitialAuthStep] = useState(null);

  const handleLogout = (explicitRole = null, explicitStep = null) => {
    const isDriverContext = currentView === 'drivers' || currentUser?.role === 'driver_partner';
    const roleToSet = explicitRole || (isDriverContext ? 'driver_partner' : (currentUser?.role || 'traveler'));
    const stepToSet = explicitStep || (isDriverContext ? 'partner_type_selection' : 'credentials');

    setLastRoleBeforeLogout(roleToSet);
    setInitialAuthStep(stepToSet);
    setCurrentUser(null);
    try {
      localStorage.removeItem('touralink_user');
    } catch (e) {
      console.warn('Failed to remove touralink_user from localStorage', e);
    }
    window.location.hash = '';
  };

  // Flow 1: Car & Cab Rental (Commercial Car + Driver)
  const handleNavigateToEstimate = (arg1, arg2) => {
    const customTrip = (arg2 && typeof arg2 === 'object') ? arg2 : (arg1 && typeof arg1 === 'object') ? arg1 : null;
    if (customTrip) {
      setTripDetails((prev) => ({
        ...prev,
        ...customTrip,
        // Ensure fare is computed or displayed
        estimatedFare: customTrip.estimatedFare || prev.estimatedFare
      }));
    }
    navigateTo('estimate');
  };

  // Flow 2: Personal Chauffeur (Hire driver for own car)
  const handleNavigateToHireDriver = (customChauffeur = null) => {
    if (customChauffeur && typeof customChauffeur === 'object') {
      setChauffeurDetails((prev) => ({
        ...prev,
        ...customChauffeur,
        estimatedFare: customChauffeur.estimatedFare || prev.estimatedFare
      }));
    }
    navigateTo('hire_driver');
  };

  const handleNavigateToDrivers = () => {
    navigateTo('drivers');
  };

  const handleNavigateToFleet = () => {
    navigateTo('fleet');
  };

  const handleSelectVehicle = (vehicle) => {
    if (!vehicle) return;
    setTripDetails((prev) => ({
      ...prev,
      selectedVehicle: vehicle,
      vehicleRecommendation: {
        type: vehicle.category || prev.vehicleRecommendation?.type || 'muv',
        title: vehicle.name,
        reason: `${vehicle.seating} • ${vehicle.luggage} • ${vehicle.ratePerKm}`,
        image: vehicle.image,
        dailyRate: vehicle.dailyRate,
        ratePerKm: vehicle.ratePerKm,
        rating: vehicle.rating
      }
    }));
  };

  const handleSelectDriver = (driver) => {
    if (!driver) return;
    setChauffeurDetails((prev) => ({
      ...prev,
      selectedDriver: driver,
      assignedDriverName: driver.name,
      assignedDriverPhone: driver.phone || '+91 98220 12345',
      assignedDriverBadge: driver.badge,
      assignedDriverImage: driver.image,
      assignedDriverRating: driver.rating,
      assignedDriverSpecialty: driver.specialty || driver.categoryLabel,
      assignedDriverRate: driver.dailyRate
    }));
  };

  const handleProceedFromEstimate = (configuredTrip, targetView = 'fleet') => {
    setTripDetails(configuredTrip);
    navigateTo(targetView);
  };

  const handleProceedFromChauffeur = (configuredChauffeur, targetView = 'drivers') => {
    setChauffeurDetails(configuredChauffeur);
    navigateTo(targetView);
  };

  return (
    <div className="min-h-screen text-slate-900 relative font-sans selection:bg-brand-500 selection:text-white">
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

      {/* Main Views */}
      {!currentUser ? (
        <main className="relative z-10 py-6 sm:py-12 flex items-center justify-center min-h-screen">
          <AuthModal 
            onLoginSuccess={handleLoginSuccess} 
            initialRole={lastRoleBeforeLogout === 'driver_partner' ? 'driver_partner' : 'traveler'}
            initialStep={initialAuthStep || (lastRoleBeforeLogout === 'driver_partner' ? 'partner_type_selection' : 'credentials')}
          />
        </main>
      ) : currentView === 'estimate' ? (
        <TripEstimationPage
          user={currentUser}
          existingTripDetails={tripDetails}
          onProceed={handleProceedFromEstimate}
          onBackToHome={() => navigateTo('home')}
          onDirectBrowseFleet={handleNavigateToFleet}
          onSwitchToHireDriver={handleNavigateToHireDriver}
        />
      ) : currentView === 'hire_driver' ? (
        <HireChauffeurPage
          user={currentUser}
          existingChauffeurDetails={chauffeurDetails}
          onProceed={handleProceedFromChauffeur}
          onBackToHome={() => navigateTo('home')}
          onDirectBrowseDrivers={handleNavigateToDrivers}
          onSwitchToCarRental={handleNavigateToEstimate}
        />
      ) : currentView === 'drivers' ? (
        <DriversPage 
          user={currentUser} 
          onLogout={handleLogout} 
          onBackToHome={() => navigateTo('home')} 
          onNavigateToFleet={handleNavigateToEstimate}
          tripDetails={chauffeurDetails}
          onEditTrip={handleNavigateToHireDriver}
          onSelectDriver={handleSelectDriver}
        />
      ) : currentView === 'fleet' ? (
        <FleetPage 
          user={currentUser} 
          onLogout={handleLogout} 
          onBackToHome={() => navigateTo('home')} 
          onNavigateToDrivers={handleNavigateToHireDriver}
          tripDetails={tripDetails}
          onEditTrip={handleNavigateToEstimate}
          onSelectVehicle={handleSelectVehicle}
        />
      ) : currentUser?.role === 'driver_partner' && currentUser?.partnerType === 'fleet_partner' ? (
        <FleetPartnerHome
          user={currentUser}
          onLogout={handleLogout}
        />
      ) : currentUser?.role === 'driver_partner' ? (
        <DriverPartnerHome
          user={currentUser}
          onLogout={handleLogout}
          onNavigateToFleet={handleNavigateToFleet}
          onNavigateToDrivers={handleNavigateToDrivers}
        />
      ) : (
        <TravelerHome 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigateToEstimate={handleNavigateToEstimate}
          onNavigateToHireDriver={handleNavigateToHireDriver}
          onNavigateToFleet={handleNavigateToFleet}
          onNavigateToDrivers={handleNavigateToDrivers}
          tripDetails={tripDetails}
          chauffeurDetails={chauffeurDetails}
          onProceedFromEstimate={handleProceedFromEstimate}
          onProceedFromChauffeur={handleProceedFromChauffeur}
          onSelectVehicle={handleSelectVehicle}
          onSelectDriver={handleSelectDriver}
          onUpdateTripDetails={(updated) => setTripDetails((prev) => ({ ...prev, ...updated }))}
          onUpdateChauffeurDetails={(updated) => setChauffeurDetails((prev) => ({ ...prev, ...updated }))}
        />
      )}
    </div>
  );
}
