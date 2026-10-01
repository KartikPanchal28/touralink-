import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const TRIPS_COLLECTION = 'trips';
const LOCAL_STORAGE_TRIPS_KEY = 'touralink_live_trips';

// Initial mock fallback trips so UI is always vibrant
const DEFAULT_BROADCAST_TRIPS = [
  {
    id: 'trip_demo_1',
    travelerName: 'Priya & Rahul Deshmukh',
    pickupLocation: 'Mumbai Airport (Terminal 2 - BOM)',
    dropoffLocation: 'North Goa (Baga Beach)',
    additionalStops: ['Lonavala Express Toll'],
    passengers: 4,
    largeBags: 2,
    smallBags: 2,
    serviceMode: 'car_driver',
    pickupDate: 'Tomorrow, 06:00 AM',
    estimatedDistance: 585,
    estimatedDuration: '10 hr 30 min',
    estimatedFare: { label: '₹7,020 - ₹8,480' },
    status: 'broadcasted',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    urgency: 'Early Morning Ghat Drive'
  },
  {
    id: 'trip_demo_2',
    travelerName: 'Vikram Merchant',
    pickupLocation: 'Pune (Hinjewadi Phase 1)',
    dropoffLocation: 'Mahabaleshwar (Club Mahindra Resort)',
    additionalStops: [],
    passengers: 3,
    largeBags: 2,
    smallBags: 1,
    serviceMode: 'driver_only',
    ownCarType: 'Toyota Fortuner 4x4 (Automatic)',
    pickupDate: 'Today, 04:30 PM',
    estimatedDistance: 125,
    estimatedDuration: '3 hr 15 min',
    estimatedFare: { label: '₹1,250 / Day' },
    status: 'broadcasted',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    urgency: 'Immediate Weekend Trip'
  }
];

function getLocalTrips() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_BROADCAST_TRIPS;
  } catch {
    return DEFAULT_BROADCAST_TRIPS;
  }
}

function saveLocalTrips(trips) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error('Error saving local trips:', e);
  }
}

/**
 * Traveler creates a new trip broadcast request (Uber-style)
 */
export async function createTripRequest(tripData) {
  const payload = {
    ...tripData,
    status: 'broadcasted',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, TRIPS_COLLECTION), {
        ...payload,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firebase error creating trip, falling back to local:', err);
    }
  }

  // Local fallback
  const localList = getLocalTrips();
  const newTrip = { id: `local_trip_${Date.now()}`, ...payload };
  saveLocalTrips([newTrip, ...localList]);
  window.dispatchEvent(new CustomEvent('touralink:trip_created', { detail: newTrip }));
  return newTrip;
}

/**
 * Driver subscribes to real-time incoming open trip broadcasts (Uber-style feed)
 */
export function subscribeToOpenTrips(callback) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, TRIPS_COLLECTION),
        where('status', '==', 'broadcasted')
      );

      return onSnapshot(
        q,
        (snapshot) => {
          const trips = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          callback(trips.length > 0 ? trips : getLocalTrips());
        },
        (err) => {
          console.error('Firestore trips listener error:', err);
          callback(getLocalTrips());
        }
      );
    } catch (err) {
      console.error('Failed to setup Firestore trips listener:', err);
    }
  }

  // Fallback local subscription
  callback(getLocalTrips());
  const handler = () => callback(getLocalTrips());
  window.addEventListener('touralink:trip_created', handler);
  window.addEventListener('touralink:trip_accepted', handler);
  return () => {
    window.removeEventListener('touralink:trip_created', handler);
    window.removeEventListener('touralink:trip_accepted', handler);
  };
}

/**
 * Driver accepts a trip request
 */
export async function acceptTripRequest(tripId, driverInfo) {
  const updateData = {
    status: 'accepted',
    assignedDriver: driverInfo,
    acceptedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db && !tripId.startsWith('local_')) {
    try {
      const docRef = doc(db, TRIPS_COLLECTION, tripId);
      await updateDoc(docRef, updateData);
      return { id: tripId, ...updateData };
    } catch (err) {
      console.error('Error accepting trip in Firestore:', err);
    }
  }

  // Local fallback update
  const localList = getLocalTrips();
  const updated = localList.map((t) =>
    t.id === tripId ? { ...t, ...updateData } : t
  );
  saveLocalTrips(updated);
  window.dispatchEvent(new CustomEvent('touralink:trip_accepted', { detail: { tripId, driverInfo } }));
  return { id: tripId, ...updateData };
}

/**
 * Traveler listens to real-time status of their specific booked trip
 */
export function subscribeToTripById(tripId, callback) {
  if (isFirebaseConfigured && db && !tripId.startsWith('local_')) {
    try {
      const docRef = doc(db, TRIPS_COLLECTION, tripId);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        }
      });
    } catch (err) {
      console.error('Error subscribing to trip by ID:', err);
    }
  }

  // Fallback
  const current = getLocalTrips().find((t) => t.id === tripId);
  callback(current || null);
  const handler = () => {
    const updated = getLocalTrips().find((t) => t.id === tripId);
    callback(updated || null);
  };
  window.addEventListener('touralink:trip_accepted', handler);
  return () => window.removeEventListener('touralink:trip_accepted', handler);
}
