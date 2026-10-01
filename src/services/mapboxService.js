/**
 * OpenStreetMap (OSM) Service Adapter
 * 
 * Replaces Mapbox with OpenStreetMap (https://www.openstreetmap.org)
 * Uses OSRM for routing, Photon & Nominatim for geocoding, and OpenStreetMap tiles.
 * 100% Free, zero tokens or credit cards required.
 */

export * from './osmService';
export { MAPBOX_TOKEN } from './osmService';

// Legacy compatibility export
export const MAPBOX_TOKEN_FALLBACK = '';
export const MAPBOX_TOKEN = '';
