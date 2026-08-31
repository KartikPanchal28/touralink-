import React, { useState } from 'react';
import AuthModal from './components/Auth/AuthModal';
import TravelerHome from './pages/TravelerHome';
import DriverPartnerHome from './pages/DriverPartnerHome';
import FleetPartnerHome from './pages/FleetPartnerHome';
import FleetPage from './pages/FleetPage';
import DriversPage from './pages/DriversPage';

const BACKGROUND_VIDEO = '/videos/cape-goa-goa-indien-naturfotografie-verbl-ffende-natur.mp4';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'fleet' | 'drivers'

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
          onBackToHome={() => setCurrentView('home')} 
          onNavigateToFleet={() => setCurrentView('fleet')}
        />
      ) : currentView === 'fleet' ? (
        <FleetPage 
          user={currentUser} 
          onLogout={handleLogout} 
          onBackToHome={() => setCurrentView('home')} 
          onNavigateToDrivers={() => setCurrentView('drivers')}
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
          onNavigateToFleet={() => setCurrentView('fleet')}
          onNavigateToDrivers={() => setCurrentView('drivers')}
        />
      ) : (
        <TravelerHome 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigateToFleet={() => setCurrentView('fleet')}
          onNavigateToDrivers={() => setCurrentView('drivers')}
        />
      )}
    </div>
  );
}
