/**
 * Touralink WhatsApp Notification Service
 * Dispatches automated WhatsApp booking confirmations to Traveler, Driver, and Fleet Owner.
 */

/**
 * Format phone number to international E.164 without '+' or spaces for WhatsApp wa.me API
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '919876543210';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  // Default to India (+91) if 10-digit number
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Generate direct WhatsApp Web / App deep-link
 */
export function getWhatsAppChatUrl(phone, message) {
  const cleanNumber = formatWhatsAppNumber(phone);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build rich WhatsApp message template for Traveler
 */
export function buildTravelerWhatsAppMessage({ bookingId, tripData, traveler, driver, fleetOwner, vehicle }) {
  const pickup = tripData?.pickupLocation || 'Pickup Point';
  const dropoff = tripData?.dropoffLocation || 'Destination';
  const date = tripData?.pickupDate || 'Scheduled Date';
  const time = tripData?.pickupTimeSlot || '07:00 AM';
  const distance = tripData?.estimatedDistance ? `${tripData.estimatedDistance} KM` : '585 KM';
  const fare = tripData?.estimatedFare?.label || '₹7,020 - ₹8,480';
  const vehicleName = vehicle?.name || tripData?.vehicleRecommendation?.title || 'Commercial MUV / Sedan';
  const driverName = driver?.name || 'Verified Touralink Chauffeur';
  const driverPhone = driver?.phone || '+91 98220 12345';
  const agencyName = fleetOwner?.agencyName || 'Touralink Partner Fleet Network';

  return `🚗 *Touralink Booking Confirmed!*
━━━━━━━━━━━━━━━━━━━━━━
Booking Ref: *#${bookingId}*
Status: *Confirmed & Dispatched*

👤 *Traveler:* ${traveler?.name || 'Valued Traveler'}
📱 *WhatsApp:* ${traveler?.phone || '+91 98765 43210'}

📍 *Pickup:* ${pickup}
🏁 *Dropoff:* ${dropoff}
📅 *Date & Time:* ${date}, ${time}
🛣️ *Est. Distance:* ${distance}

🚘 *Vehicle:* ${vehicleName}
🚖 *Assigned Chauffeur:* ${driverName} (${driverPhone})
🏢 *Fleet Partner:* ${agencyName}

💰 *Est. Trip Fare:* ${fare}
*(0% Platform Commission • Direct Driver Settlement)*

🛰️ *Live Route & Station Map:*
https://touralink.com/#estimate

━━━━━━━━━━━━━━━━━━━━━━
*Touralink* • Direct Cab & Fleet Connect
Clean Cars • Verified Drivers • Zero Markup`;
}

/**
 * Build rich WhatsApp message template for Chauffeur / Driver
 */
export function buildDriverWhatsAppMessage({ bookingId, tripData, traveler, vehicle }) {
  const pickup = tripData?.pickupLocation || 'Pickup Point';
  const dropoff = tripData?.dropoffLocation || 'Destination';
  const date = tripData?.pickupDate || 'Scheduled Date';
  const time = tripData?.pickupTimeSlot || '07:00 AM';
  const distance = tripData?.estimatedDistance ? `${tripData.estimatedDistance} KM` : '585 KM';
  const passengers = tripData?.passengers || 4;
  const luggage = tripData?.largeBags ? `${tripData.largeBags} Bags` : 'Standard luggage';
  const vehicleName = vehicle?.name || 'Assigned Fleet Cab';

  return `🚖 *Touralink New Duty Assignment*
━━━━━━━━━━━━━━━━━━━━━━
Booking Ref: *#${bookingId}*
Duty: *Outstation Highway Trip*

👤 *Passenger:* ${traveler?.name || 'Touralink Traveler'}
📱 *WhatsApp / Call:* ${traveler?.phone || '+91 98765 43210'}
👥 *Party:* ${passengers} Passengers • ${luggage}

📍 *Reporting Location:* ${pickup}
🏁 *Trip Dropoff:* ${dropoff}
⏰ *Reporting Time:* ${date} (${time})
🛣️ *Distance:* ${distance}

🚘 *Vehicle:* ${vehicleName}
💰 *Fare Settlement:* Direct from Client at Journey End

*Action Required:*
Please send a WhatsApp greeting to the traveler confirming reporting time and vehicle readiness.
━━━━━━━━━━━━━━━━━━━━━━
*Touralink Driver Partner Command*`;
}

/**
 * Build rich WhatsApp message template for Fleet Owner / Agency
 */
export function buildFleetOwnerWhatsAppMessage({ bookingId, tripData, traveler, driver, vehicle, fleetOwner }) {
  const pickup = tripData?.pickupLocation || 'Pickup Point';
  const dropoff = tripData?.dropoffLocation || 'Destination';
  const date = tripData?.pickupDate || 'Scheduled Date';
  const vehicleName = vehicle?.name || 'Innova Crysta / Commercial Fleet';
  const driverName = driver?.name || 'Assigned Fleet Chauffeur';
  const fare = tripData?.estimatedFare?.label || 'Direct Fleet Tariff';

  return `🏢 *Touralink Fleet Dispatch Alert*
━━━━━━━━━━━━━━━━━━━━━━
Booking Ref: *#${bookingId}*
Agency: *${fleetOwner?.agencyName || 'Fleet Operations'}*

🚘 *Vehicle:* ${vehicleName}
🚖 *Assigned Chauffeur:* ${driverName}
👤 *Client:* ${traveler?.name || 'Client'} (${traveler?.phone || 'Mobile'})

📍 *Circuit:* ${pickup} → ${dropoff}
📅 *Schedule:* ${date}
💰 *Fleet Revenue:* ${fare} (100% Direct Payout)

Vehicle status has been automatically updated in your Touralink Virtual Garage.
━━━━━━━━━━━━━━━━━━━━━━
*Touralink Fleet Partner Network*`;
}

/**
 * Dispatch booking notifications across all three parties on WhatsApp
 */
export function dispatchBookingWhatsAppAlerts({ tripData, traveler, driver, fleetOwner, vehicle }) {
  const bookingId = `TLK-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultDriver = driver || {
    name: 'Ramesh Patil',
    phone: '+91 98220 12345',
    badge: 'Senior Ghats & Express Chauffeur'
  };

  const defaultFleetOwner = fleetOwner || {
    agencyName: 'Sahyadri Travels & Cabs Fleet',
    phone: '+91 94220 99881',
    city: 'Pune / Mumbai'
  };

  const travelerMsg = buildTravelerWhatsAppMessage({
    bookingId,
    tripData,
    traveler,
    driver: defaultDriver,
    fleetOwner: defaultFleetOwner,
    vehicle
  });

  const driverMsg = buildDriverWhatsAppMessage({
    bookingId,
    tripData,
    traveler,
    vehicle
  });

  const fleetMsg = buildFleetOwnerWhatsAppMessage({
    bookingId,
    tripData,
    traveler,
    driver: defaultDriver,
    vehicle,
    fleetOwner: defaultFleetOwner
  });

  const travelerUrl = getWhatsAppChatUrl(traveler?.phone, travelerMsg);
  const driverUrl = getWhatsAppChatUrl(defaultDriver.phone, driverMsg);
  const fleetOwnerUrl = getWhatsAppChatUrl(defaultFleetOwner.phone, fleetMsg);

  const dispatchRecord = {
    bookingId,
    timestamp: new Date().toISOString(),
    status: 'dispatched',
    traveler: {
      name: traveler?.name,
      phone: traveler?.phone,
      whatsappUrl: travelerUrl,
      message: travelerMsg
    },
    driver: {
      name: defaultDriver.name,
      phone: defaultDriver.phone,
      whatsappUrl: driverUrl,
      message: driverMsg
    },
    fleetOwner: {
      agencyName: defaultFleetOwner.agencyName,
      phone: defaultFleetOwner.phone,
      whatsappUrl: fleetOwnerUrl,
      message: fleetMsg
    }
  };

  try {
    const existing = JSON.parse(localStorage.getItem('touralink_whatsapp_dispatches') || '[]');
    existing.unshift(dispatchRecord);
    localStorage.setItem('touralink_whatsapp_dispatches', JSON.stringify(existing.slice(0, 20)));
  } catch (e) {
    console.error('Failed to log WhatsApp dispatch to localStorage:', e);
  }

  // Trigger custom global event for listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('touralink:whatsapp-dispatched', {
        detail: dispatchRecord
      })
    );
  }

  return dispatchRecord;
}
