import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { DRIVERS_DATA } from '../data/driversData';

const DRIVERS_COLLECTION = 'drivers';
const LOCAL_STORAGE_DRIVERS_KEY = 'touralink_verified_drivers';

export const INITIAL_DRIVERS = DRIVERS_DATA;

function getLocalDrivers() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DRIVERS_KEY);
    if (!raw) return INITIAL_DRIVERS;
    const stored = JSON.parse(raw);
    if (Array.isArray(stored)) {
      const merged = INITIAL_DRIVERS.map((init) => {
        const match = stored.find((s) => s.id === init.id);
        return match ? { ...init, ...match } : init;
      });
      const customDrivers = stored.filter(s => !INITIAL_DRIVERS.some(init => init.id === s.id));
      return [...customDrivers, ...merged];
    }
    return INITIAL_DRIVERS;
  } catch {
    return INITIAL_DRIVERS;
  }
}

function saveLocalDrivers(drivers) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DRIVERS_KEY, JSON.stringify(drivers));
  } catch (e) {
    console.error('Error saving local drivers:', e);
  }
}

/**
 * Register or update a verified driver's profile & real KYC data
 */
export function registerOrUpdateDriver(driverData) {
  const list = getLocalDrivers();
  const existingIdx = list.findIndex(d => d.id === driverData.id || (driverData.name && d.name?.toLowerCase() === driverData.name.toLowerCase()));
  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...list];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...driverData };
  } else {
    updatedList = [driverData, ...list];
  }
  saveLocalDrivers(updatedList);
  window.dispatchEvent(new CustomEvent('touralink:driver_duty_changed', { detail: { driverId: driverData.id } }));
  return updatedList;
}

/**
 * Real-time listener for verified drivers
 */
export function subscribeToDrivers(callback) {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, DRIVERS_COLLECTION));
      return onSnapshot(
        q,
        (snapshot) => {
          const drivers = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          callback(drivers.length > 0 ? drivers : getLocalDrivers());
        },
        (err) => {
          console.error('Firestore drivers listener error:', err);
          callback(getLocalDrivers());
        }
      );
    } catch (err) {
      console.error('Failed to setup Firestore drivers listener:', err);
    }
  }

  // Fallback local subscription
  callback(getLocalDrivers());
  const handler = () => callback(getLocalDrivers());
  window.addEventListener('touralink:driver_duty_changed', handler);
  return () => window.removeEventListener('touralink:driver_duty_changed', handler);
}

/**
 * Toggle driver duty status ("On Duty" vs "Resting")
 */
export async function toggleDriverDuty(driverId, isOnline) {
  if (isFirebaseConfigured && db && !driverId.startsWith('local_')) {
    try {
      const docRef = doc(db, DRIVERS_COLLECTION, driverId);
      await updateDoc(docRef, { isOnline });
    } catch (err) {
      console.error('Error updating driver duty in Firestore:', err);
    }
  }

  // Local fallback
  const list = getLocalDrivers();
  const updated = list.map((d) =>
    d.id === driverId ? { ...d, isOnline } : d
  );
  saveLocalDrivers(updated);
  window.dispatchEvent(new CustomEvent('touralink:driver_duty_changed', { detail: { driverId, isOnline } }));
  return updated;
}
