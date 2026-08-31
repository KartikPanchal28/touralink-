import React, { useState, useEffect } from 'react';
import AuthModal from './components/Auth/AuthModal';
import TravelerHome from './pages/TravelerHome';
import DriverPartnerHome from './pages/DriverPartnerHome';
import FleetPartnerHome from './pages/FleetPartnerHome';
import FleetPage from './pages/FleetPage';
import DriversPage from './pages/DriversPage';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Derive initial view from URL Hash
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (['fleet', 'drivers', 'home'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentView, setCurrentView] = useState(getInitialView);

  // Sync state with browser native Back & Forward buttons (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (['fleet', 'drivers', 'home'].includes(hash)) {
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
    navigateTo('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.hash = '';
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
          <AuthModal onLoginSuccess={handleLoginSuccess} />
        </main>
      ) : currentView === 'drivers' ? (
        <DriversPage 
          user={currentUser} 
          onLogout={handleLogout} 
          onBackToHome={() => navigateTo('home')} 
          onNavigateToFleet={() => navigateTo('fleet')}
        />
      ) : currentView === 'fleet' ? (
        <FleetPage 
          user={currentUser} 
          onLogout={handleLogout} 
          onBackToHome={() => navigateTo('home')} 
          onNavigateToDrivers={() => navigateTo('drivers')}
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
          onNavigateToFleet={() => navigateTo('fleet')}
          onNavigateToDrivers={() => navigateTo('drivers')}
        />
      ) : (
        <TravelerHome 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigateToFleet={() => navigateTo('fleet')}
          onNavigateToDrivers={() => navigateTo('drivers')}
        />
      )}
    </div>
  );
}
