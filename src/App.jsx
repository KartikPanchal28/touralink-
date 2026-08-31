import React, { useState } from 'react';
import AuthModal from './components/Auth/AuthModal';
import TravelerHome from './pages/TravelerHome';
import DriverPartnerHome from './pages/DriverPartnerHome';
import FleetPartnerHome from './pages/FleetPartnerHome';
import FleetPage from './pages/FleetPage';
import DriversPage from './pages/DriversPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Traveler',
    email: 'traveler@touralink.in',
    role: 'traveler', // 'traveler' | 'driver_partner'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
  });

  const [currentView, setCurrentView] = useState('home'); // 'home' | 'fleet' | 'drivers'

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen text-slate-900 relative">
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
