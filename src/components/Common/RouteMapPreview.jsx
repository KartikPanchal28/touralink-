import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, MapPin } from 'lucide-react';

/**
 * RouteMapPreview - Real OpenStreetMap mini preview for trip route cards
 */
export default function RouteMapPreview({
  startCoords,
  endCoords,
  routeGeometry,
  onClick,
  className = 'h-32 w-full'
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

function isValidCoords(c) {
  return Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1]);
}

  useEffect(() => {
    if (!containerRef.current || !isValidCoords(startCoords) || !isValidCoords(endCoords)) return;

    // Clean up existing map instance if any
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (_) {}
      mapRef.current = null;
    }

    // Clear Leaflet container cache ID
    if (containerRef.current && containerRef.current._leaflet_id) {
      delete containerRef.current._leaflet_id;
    }

    const centerLat = (startCoords[1] + endCoords[1]) / 2;
    const centerLng = (startCoords[0] + endCoords[0]) / 2;

    let map = null;
    try {
      map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false
      });

      // Google Maps style bright, clean OpenStreetMap / Esri World Street Map Tiles
      const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Street Map'
      }).addTo(map);

      tileLayer.on('tileerror', () => {
        if (!map._hasOsmFallback) {
          map._hasOsmFallback = true;
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);
        }
      });

      const boundsLatLngs = [];

      // Marker A (Pickup)
      const iconA = L.divIcon({
        html: `
          <div style="background: #1a73e8; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">
            A
          </div>
        `,
        className: 'osm-preview-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([startCoords[1], startCoords[0]], { icon: iconA }).addTo(map);
      boundsLatLngs.push([startCoords[1], startCoords[0]]);

      // Marker B (Dropoff)
      const iconB = L.divIcon({
        html: `
          <div style="background: #0f9d58; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; border: 2.5px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.4);">
            B
          </div>
        `,
        className: 'osm-preview-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([endCoords[1], endCoords[0]], { icon: iconB }).addTo(map);
      boundsLatLngs.push([endCoords[1], endCoords[0]]);

      // Polyline route
      if (routeGeometry?.coordinates && Array.isArray(routeGeometry.coordinates) && routeGeometry.coordinates.length > 0) {
        const validCoords = routeGeometry.coordinates.filter(isValidCoords);
        if (validCoords.length > 0) {
          const latLngs = validCoords.map((c) => [c[1], c[0]]);

          // Outer glow
          L.polyline(latLngs, {
            color: '#1a56db',
            weight: 6,
            opacity: 0.6,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // Main line
          L.polyline(latLngs, {
            color: '#3b82f6',
            weight: 3.5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          latLngs.forEach((pt) => boundsLatLngs.push(pt));
        }
      }

      if (boundsLatLngs.length > 0) {
        try {
          map.fitBounds(boundsLatLngs, {
            padding: [25, 25],
            maxZoom: 13
          });
        } catch (_) {}
      }

      mapRef.current = map;

      // Robust multi-tier invalidation to guarantee visible tiles on load
      const t1 = setTimeout(() => {
        try {
          map.invalidateSize({ animate: false });
        } catch (_) {}
      }, 50);

      const t2 = setTimeout(() => {
        try {
          map.invalidateSize({ animate: false });
        } catch (_) {}
      }, 200);

      // Listen for parent container resizes via ResizeObserver
      let resizeObserver = null;
      if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          if (mapRef.current) {
            try {
              mapRef.current.invalidateSize({ animate: false });
            } catch (_) {}
          }
        });
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        if (resizeObserver) {
          try { resizeObserver.disconnect(); } catch (_) {}
        }
        if (mapRef.current) {
          try {
            mapRef.current.remove();
          } catch (_) {}
          mapRef.current = null;
        }
        if (containerRef.current && containerRef.current._leaflet_id) {
          delete containerRef.current._leaflet_id;
        }
      };
    } catch (err) {
      console.error('Error creating route preview map:', err);
    }
  }, [startCoords, endCoords, routeGeometry]);

  if (!isValidCoords(startCoords) || !isValidCoords(endCoords)) {
    return (
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
        }}
        className={`relative rounded-xl overflow-hidden border border-white/15 bg-slate-900 shadow-inner group cursor-pointer hover:border-brand-400/60 flex items-center justify-center ${className}`}
        title="Click to view interactive OpenStreetMap route"
      >
        <div className="text-center p-3 text-white pointer-events-none">
          <MapPin className="w-6 h-6 mx-auto text-brand-400 animate-pulse mb-1.5" />
          <div className="text-xs font-black">OpenStreetMap Route</div>
          <div className="text-[10px] text-slate-400">Click to inspect highway stops</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      className={`relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group cursor-pointer hover:border-brand-500 hover:shadow-brand-500/10 hover:shadow-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-brand-400 ${className}`}
    >
      <div ref={containerRef} className="w-full h-full pointer-events-none" />

      {/* Hover Center Callout */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-slate-900/15 transition-colors flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-100 scale-95 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-xl">
          <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Click to Zoom & Inspect Route</span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="absolute top-2 left-2 pointer-events-none flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/90 backdrop-blur-md text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Google Maps Style Route</span>
        </span>
      </div>

      <div className="absolute bottom-2 right-2 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-white/80 backdrop-blur-sm text-slate-600 border border-slate-200">
          © OpenStreetMap / CARTO
        </span>
      </div>
    </div>
  );
}
