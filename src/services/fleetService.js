import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const FLEET_COLLECTION = 'fleet_vehicles';
const LOCAL_STORAGE_FLEET_KEY = 'touralink_fleet_vehicles';

export const INITIAL_FLEET = [
  {
    id: 'crysta_pune_1',
    name: 'Toyota Innova Crysta 2.4 GX (Captain Seats)',
    category: 'muv',
    plateNumber: 'MH 12 RN 8821',
    ratePerKm: '₹15 / KM',
    location: 'Baner / Shivaji Nagar (Pune)',
    capacity: '6+1 Luxury Captain Seats',
    luggage: '3 Large + 2 Small Bags',
    acType: 'Dual-Zone Roof AC (Rear Controls)',
    features: ['Fastag Equipped', 'All-India Permit', 'Speed Governor (80 km/h)', 'Sanitized Cabin'],
    assignedDriver: {
      name: 'Ramesh Shinde',
      experience: '14 Years Exp',
      badge: 'MH-12-8821',
      rating: '4.98',
      phone: '+91 98221 44510'
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true
  },
  {
    id: 'ertiga_mumbai_1',
    name: 'Maruti Suzuki Ertiga ZXi+ (CNG / Petrol)',
    category: 'muv',
    plateNumber: 'MH 01 DK 5532',
    ratePerKm: '₹12 / KM',
    location: 'Andheri / Airport T2 (Mumbai)',
    capacity: '6+1 Seater Flexible Fold',
    luggage: '2 Large + 2 Small Bags',
    acType: 'Roof Blower Smart Hybrid AC',
    features: ['High Mileage Economy', 'Clean Beige Interiors', 'Music System USB', 'Fastag Clear'],
    assignedDriver: {
      name: 'Vinod Kamat',
      experience: '9 Years Exp',
      badge: 'MH-01-9921',
      rating: '4.92',
      phone: '+91 98202 33411'
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true
  },
  {
    id: 'urbania_goa_1',
    name: 'Force Urbania Luxury Van (Executive Pushback)',
    category: 'van',
    plateNumber: 'GA 01 T 4419',
    ratePerKm: '₹26 / KM',
    location: 'Panaji / Mopa Airport (Goa)',
    capacity: '13+1 Executive Recliner Pushback',
    luggage: '8 Large + 6 Small Bags Boot',
    acType: 'Individual AC Vents Every Seat',
    features: ['Panoramic Windows', 'Air Suspension Ride', 'Mood Lighting', 'Individual Mobile USB Charging'],
    assignedDriver: {
      name: 'Sameer Sawant',
      experience: '10 Years Exp',
      badge: 'GA-01-4419',
      rating: '4.96',
      phone: '+91 98224 88312'
    },
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
    ],
    isAvailable: true
  }
];

function getLocalFleet() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FLEET_KEY);
    return raw ? JSON.parse(raw) : INITIAL_FLEET;
  } catch {
    return INITIAL_FLEET;
  }
}

function saveLocalFleet(fleet) {
  try {
    localStorage.setItem(LOCAL_STORAGE_FLEET_KEY, JSON.stringify(fleet));
  } catch (e) {
    console.error('Error saving local fleet:', e);
  }
}

/**
 * Fleet partner adds a new vehicle (from FleetPartnerHome wizard)
 */
export async function addFleetVehicle(vehicleData) {
  const payload = {
    ...vehicleData,
    isAvailable: true,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, FLEET_COLLECTION), {
        ...payload,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.error('Error adding vehicle to Firestore:', err);
    }
  }

  // Local fallback
  const current = getLocalFleet();
  const newVehicle = { id: `local_veh_${Date.now()}`, ...payload };
  saveLocalFleet([newVehicle, ...current]);
  window.dispatchEvent(new CustomEvent('touralink:vehicle_added', { detail: newVehicle }));
  return newVehicle;
}

/**
 * Real-time listener for available fleet vehicles (for FleetPage)
 */
export function subscribeToFleetVehicles(callback) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, FLEET_COLLECTION),
        where('isAvailable', '==', true)
      );

      return onSnapshot(
        q,
        (snapshot) => {
          const vehicles = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          callback(vehicles.length > 0 ? vehicles : getLocalFleet());
        },
        (err) => {
          console.error('Firestore fleet listener error:', err);
          callback(getLocalFleet());
        }
      );
    } catch (err) {
      console.error('Failed to setup Firestore fleet listener:', err);
    }
  }

  // Fallback local subscription
  callback(getLocalFleet());
  const handler = () => callback(getLocalFleet());
  window.addEventListener('touralink:vehicle_added', handler);
  return () => window.removeEventListener('touralink:vehicle_added', handler);
}
