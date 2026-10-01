import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X,
  Maximize2,
  Minimize2,
  Navigation,
  Layers,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Fuel,
  Zap,
  Hotel,
  Utensils,
  Plus,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Check,
  Star,
  ShieldCheck,
  BatteryCharging,
  AlertCircle,
  Info,
  Coffee,
  Award,
  ThumbsUp,
  MessageSquare,
  Loader2,
  Sparkle,
  RefreshCw,
  Gift
} from 'lucide-react';
import { getDrivingRoute, fetchRealRoutePOIs, OSM_TILE_LAYERS, getPresetCoords } from '../../services/osmService';
import { planAITripStops } from '../../services/aiService';

const ALL_POI_CATEGORIES = [
  { id: 'all', label: 'All En-Route Stops', icon: MapPin, color: '#2563eb', bgLight: '#eff6ff', textCol: '#1d4ed8' },
  { id: 'ev', label: '⚡ EV Chargers (Live)', icon: Zap, color: '#0f9d58', bgLight: '#f0fdf4', textCol: '#15803d' },
  { id: 'gas', label: '⛽ Fuel / Petrol & CNG Pumps', icon: Fuel, color: '#ea4335', bgLight: '#fef2f2', textCol: '#b91c1c' },
  { id: 'food', label: '🍽️ Partner Dhabas & Plazas', icon: Utensils, color: '#f59e0b', bgLight: '#fffbeb', textCol: '#b45309' },
  { id: 'hotel', label: '🏨 Hotels & Resorts', icon: Hotel, color: '#4f46e5', bgLight: '#eef2ff', textCol: '#4338ca' }
];

export default function InteractiveRouteModal({
  isOpen,
  onClose,
  pickupLocation = 'Pickup',
  pickupCoords,
  dropoffLocation = 'Destination',
  dropoffCoords,
  additionalStops = [],
  routeData = null,
  tripType = 'one_way',
  onAddStop,
  allowEV = false, // Defaults to false: no EV charging station suggestions for fleet
  showAIPlanner = false // Defaults to false: removed from fleet modal
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const routeMarkersRef = useRef([]);
  const poiMarkersRef = useRef([]);
  const routeLayerRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('clean');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(8);

  function isValidCoords(c) {
    return Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && typeof c[1] === 'number' && !isNaN(c[0]) && !isNaN(c[1]);
  }

  // Resolve resilient real coordinates for Pickup & Destination
  const effectivePickupCoords = useMemo(() => {
    if (isValidCoords(pickupCoords)) return pickupCoords;
    return getPresetCoords(pickupLocation) || [72.8746, 19.0896];
  }, [pickupCoords, pickupLocation]);

  const effectiveDropoffCoords = useMemo(() => {
    if (isValidCoords(dropoffCoords)) return dropoffCoords;
    return getPresetCoords(dropoffLocation) || [73.7553, 15.5527];
  }, [dropoffCoords, dropoffLocation]);

  // Available POI categories based on allowEV (no EV for fleet)
  const poiCategories = useMemo(() => {
    return allowEV
      ? ALL_POI_CATEGORIES
      : ALL_POI_CATEGORIES.filter((c) => c.id !== 'ev');
  }, [allowEV]);

  // Active POI search category ('all' | 'ev' | 'gas' | 'food' | 'hotel')
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [activePOITab, setActivePOITab] = useState('status'); // 'status' | 'reviews' | 'partner'
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic route states (updates if user adds an en-route stop)
  const [liveRoute, setLiveRoute] = useState(routeData);
  const [liveStops, setLiveStops] = useState(additionalStops || []);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Real-world POI Data State (Fetched live via OpenStreetMap / Photon)
  const [routePOIs, setRoutePOIs] = useState([]);
  const [isLoadingRealPOIs, setIsLoadingRealPOIs] = useState(false);
  const routePOIsRef = useRef([]);
  routePOIsRef.current = routePOIs;

  // AI Trip Planner Modal / Drawer State
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [aiVehiclePropulsion, setAiVehiclePropulsion] = useState('ev'); // 'ev' | 'fuel'
  const [aiPlanLoading, setAiPlanLoading] = useState(false);
  const [aiPlanResult, setAiPlanResult] = useState(null);

  // Reset when modal opens or initial data changes
  useEffect(() => {
    setLiveRoute(routeData);
    setLiveStops(additionalStops || []);
    setActiveCategory('all');
    setSelectedPOI(null);
  }, [routeData, additionalStops, isOpen]);

  // Auto-fetch real OpenStreetMap driving route if not already passed with geometry
  useEffect(() => {
    if (!isOpen) return;
    if (routeData?.geometry?.coordinates?.length) {
      setLiveRoute(routeData);
      return;
    }

    let isMounted = true;
    const waypoints = [effectivePickupCoords];
    if (Array.isArray(additionalStops)) {
      additionalStops.forEach((s) => {
        if (isValidCoords(s?.coords)) waypoints.push(s.coords);
      });
    }
    waypoints.push(effectiveDropoffCoords);

    getDrivingRoute(waypoints)
      .then((data) => {
        if (isMounted && data) {
          setLiveRoute(data);
        }
      })
      .catch((err) => {
        console.warn('Auto route fetch in modal warning:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, routeData, effectivePickupCoords, effectiveDropoffCoords, additionalStops]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle map resizing when full-screen toggles or modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isFullscreen, isOpen]);

  // Initialize Leaflet Map with OpenStreetMap
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Center map on pickup or destination region
    const center = isValidCoords(effectivePickupCoords)
      ? [effectivePickupCoords[1], effectivePickupCoords[0]]
      : isValidCoords(effectiveDropoffCoords)
      ? [effectiveDropoffCoords[1], effectiveDropoffCoords[0]]
      : [18.5204, 73.8567];

    const activeStyleObj = OSM_TILE_LAYERS.find((s) => s.id === currentStyle) || OSM_TILE_LAYERS[0];

    // Clean up any stale map instance
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        console.warn('Error removing map:', e);
      }
      mapRef.current = null;
    }

    // Crucial: Leaflet sets _leaflet_id on the DOM container. If reused, Leaflet throws "Map container is already initialized."
    if (mapContainerRef.current) {
      mapContainerRef.current.innerHTML = '';
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
    }

    let map = null;
    try {
      map = L.map(mapContainerRef.current, {
        center: center,
        zoom: 8,
        zoomControl: false,
        attributionControl: false
      });

      // Add compact attribution for OpenStreetMap
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      const tileLayer = L.tileLayer(activeStyleObj.url, {
        attribution: activeStyleObj.attribution,
        maxZoom: activeStyleObj.maxZoom || 19,
        subdomains: activeStyleObj.subdomains || 'abc'
      }).addTo(map);

      tileLayer.on('tileerror', () => {
        if (!map._hasOsmFallback && activeStyleObj.id !== 'streets') {
          map._hasOsmFallback = true;
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
        }
      });

      currentTileLayerRef.current = tileLayer;
      mapRef.current = map;
      setIsMapLoaded(true);

      map.on('zoomend', () => {
        const z = Math.round(map.getZoom() * 10) / 10;
        setCurrentZoom(z);
        renderPOIPins(map, routePOIsRef.current);
      });
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      return;
    }

    // Robust multi-tier invalidation once modal mounts to guarantee full tile and route rendering
    const triggerResize = () => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize({ animate: false });
          renderRouteAndMarkers(mapRef.current);
          renderPOIPins(mapRef.current, routePOIsRef.current);
        } catch (_) {}
      }
    };

    const timer1 = setTimeout(triggerResize, 60);
    const timer2 = setTimeout(triggerResize, 200);
    const timer3 = setTimeout(triggerResize, 500);

    // ResizeObserver ensures that as soon as the portal DOM receives real non-zero dimensions,
    // Leaflet immediately loads all map tiles and fits route bounds
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          try {
            mapRef.current.invalidateSize({ animate: false });
          } catch (_) {}
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (resizeObserver) {
        try { resizeObserver.disconnect(); } catch (_) {}
      }
      routeMarkersRef.current.forEach((m) => {
        try { m.remove(); } catch (_) {}
      });
      routeMarkersRef.current = [];
      poiMarkersRef.current.forEach((m) => {
        try { m.remove(); } catch (_) {}
      });
      poiMarkersRef.current = [];
      if (routeLayerRef.current) {
        try { routeLayerRef.current.remove(); } catch (_) {}
        routeLayerRef.current = null;
      }
      if (map) {
        try { map.remove(); } catch (_) {}
      }
      if (mapContainerRef.current && mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, [isOpen, effectivePickupCoords, effectiveDropoffCoords]);

  // Switch Tile Layer smoothly when user selects another style
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    if (currentTileLayerRef.current) {
      currentTileLayerRef.current.remove();
    }
    const activeStyleObj = OSM_TILE_LAYERS.find((s) => s.id === currentStyle) || OSM_TILE_LAYERS[0];
    currentTileLayerRef.current = L.tileLayer(activeStyleObj.url, {
      attribution: activeStyleObj.attribution,
      maxZoom: activeStyleObj.maxZoom || 19,
      subdomains: activeStyleObj.subdomains || 'abc'
    }).addTo(mapRef.current);
  }, [currentStyle, isMapLoaded]);

  // Re-render road geometry and base markers whenever live route or stops change
  useEffect(() => {
    if (mapRef.current && isMapLoaded) {
      renderRouteAndMarkers(mapRef.current);
    }
  }, [liveRoute, liveStops, isMapLoaded]);

  // Fetch 100% REAL-WORLD POIs along the active driving route using OpenStreetMap
  useEffect(() => {
    let isMounted = true;
    setIsLoadingRealPOIs(true);

    fetchRealRoutePOIs({
      routeGeometry: liveRoute?.geometry,
      startCoords: effectivePickupCoords,
      endCoords: effectiveDropoffCoords,
      category: activeCategory || 'all',
      allowEV
    })
      .then((realData) => {
        if (isMounted) {
          setRoutePOIs(realData || []);
        }
      })
      .catch((err) => {
        console.warn('OpenStreetMap POI fetch warning:', err);
        if (isMounted) setRoutePOIs([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRealPOIs(false);
      });

    return () => {
      isMounted = false;
    };
  }, [liveRoute, effectivePickupCoords, effectiveDropoffCoords, activeCategory, allowEV]);

  // Re-render OpenStreetMap En-Route POI pins whenever real POIs list or map loads
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    renderPOIPins(mapRef.current, routePOIs);
  }, [routePOIs, isMapLoaded]);

  // Render Start (A), End (B), and En-Route Waypoint Pins
  const renderRouteAndMarkers = (map) => {
    if (!map) return;

    try {
      routeMarkersRef.current.forEach((m) => {
        try { m.remove(); } catch (_) {}
      });
      routeMarkersRef.current = [];

      if (routeLayerRef.current) {
        try { routeLayerRef.current.remove(); } catch (_) {}
        routeLayerRef.current = null;
      }

      const boundsLatLngs = [];

      // 1. Point A: Pickup Marker
      if (isValidCoords(effectivePickupCoords)) {
        const iconA = L.divIcon({
          html: `
            <div style="background: #1a73e8; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 14px rgba(26,115,232,0.5); border: 3px solid white; cursor: pointer;">
              A
            </div>
          `,
          className: 'custom-osm-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const markerA = L.marker([effectivePickupCoords[1], effectivePickupCoords[0]], { icon: iconA }).addTo(map);
        routeMarkersRef.current.push(markerA);
        boundsLatLngs.push([effectivePickupCoords[1], effectivePickupCoords[0]]);
      }

      // 2. Intermediate Waypoint Markers (Stops)
      if (Array.isArray(liveStops) && liveStops.length > 0) {
        liveStops.forEach((stop, idx) => {
          const coords = stop?.coords;
          if (isValidCoords(coords)) {
            const iconStop = L.divIcon({
              html: `
                <div style="background: #f59e0b; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 11px; box-shadow: 0 4px 14px rgba(245,158,11,0.5); border: 2.5px solid white; cursor: pointer;">
                  ${idx + 1}
                </div>
              `,
              className: 'custom-osm-pin',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            const markerStop = L.marker([coords[1], coords[0]], { icon: iconStop }).addTo(map);
            routeMarkersRef.current.push(markerStop);
            boundsLatLngs.push([coords[1], coords[0]]);
          }
        });
      }

      // 3. Point B: Destination Marker
      if (isValidCoords(effectiveDropoffCoords)) {
        const iconB = L.divIcon({
          html: `
            <div style="background: #0f9d58; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 14px rgba(15,157,88,0.5); border: 3px solid white; cursor: pointer;">
              B
            </div>
          `,
          className: 'custom-osm-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const markerB = L.marker([effectiveDropoffCoords[1], effectiveDropoffCoords[0]], { icon: iconB }).addTo(map);
        routeMarkersRef.current.push(markerB);
        boundsLatLngs.push([effectiveDropoffCoords[1], effectiveDropoffCoords[0]]);
      }

      // 4. Draw Road Polyline Geometry from OSRM
      if (liveRoute?.geometry?.coordinates && Array.isArray(liveRoute.geometry.coordinates) && liveRoute.geometry.coordinates.length > 0) {
        const validLineCoords = liveRoute.geometry.coordinates.filter(isValidCoords);
        if (validLineCoords.length > 0) {
          const latLngs = validLineCoords.map((c) => [c[1], c[0]]);
          const layerGroup = L.layerGroup();

          // Route casing line (Google Maps route border)
          L.polyline(latLngs, {
            color: '#1a56db',
            weight: 8,
            opacity: 0.6,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(layerGroup);

          // Main Route line
          L.polyline(latLngs, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(layerGroup);

          layerGroup.addTo(map);
          routeLayerRef.current = layerGroup;

          latLngs.forEach((pt) => boundsLatLngs.push(pt));
        }
      }

      // 5. Fit bounds with comfortable padding
      if (boundsLatLngs.length > 0) {
        try {
          map.fitBounds(boundsLatLngs, {
            padding: [40, 40],
            maxZoom: 14,
            animate: false
          });
        } catch (e) {
          console.warn('Error fitting bounds:', e);
        }
      }
    } catch (err) {
      console.error('Error rendering route and markers:', err);
    }
  };

  // Render OpenStreetMap Style POI Pins along the route
  const renderPOIPins = (map, poisList) => {
    if (!map) return;

    try {
      poiMarkersRef.current.forEach((m) => {
        try { m.remove(); } catch (_) {}
      });
      poiMarkersRef.current = [];

      const zoom = map.getZoom();

      const rawPois = poisList && poisList.length > 0 ? poisList : routePOIsRef.current || [];
      const pois = rawPois.filter((p) => {
        if (!p) return false;
        if (!activeCategory || activeCategory === 'all') return true;
        return p.category === activeCategory;
      });

      pois.forEach((poi) => {
        if (!poi || !isValidCoords(poi.coords)) return;

        let pinColor = '#ea4335'; // Red for Gas
        let iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M15 10h2a2 2 0 0 1 2 2v6"/><path d="M19 14h2"/><circle cx="9" cy="8" r="2"/></svg>`;
        let statusSubtitle = poi.openStatus ? String(poi.openStatus).split('•')[0] : 'Open';

        if (poi.category === 'ev') {
          pinColor = '#0f9d58'; // Emerald Green for EV
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
          statusSubtitle = `${poi.gunsFree || 2}/${poi.totalGuns || 4} Guns Free`;
        } else if (poi.category === 'hotel') {
          pinColor = '#4f46e5'; // Indigo for Hotel
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M6 8v4M10 8v4M2 17h20"/></svg>`;
          statusSubtitle = 'Rooms Available';
        } else if (poi.category === 'food') {
          pinColor = '#f59e0b'; // Amber for Food
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 2v20M6 2v20M3 2v6a3 3 0 0 0 6 0V2"/></svg>`;
          statusSubtitle = poi.isPartner ? '⭐ 15% Partner OFF' : 'Open 24h';
        }

        const rawLabel = poi.brand || poi.name || 'Station';
        const shortLabel = String(rawLabel).split(' ')[0] || 'Station';
        const isSelected = selectedPOI?.id === poi.id;
        const showExpandedDetails = zoom >= 8.5;

        const innerHtml = `
          <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35)); transition: transform 0.2s; ${
            isSelected ? 'transform: scale(1.18);' : ''
          }">
            <!-- Teardrop Head -->
            <div style="background: ${pinColor}; color: white; width: ${
          showExpandedDetails ? '34px' : '28px'
        }; height: ${
          showExpandedDetails ? '34px' : '28px'
        }; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
              <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
                ${iconSvg}
              </div>
            </div>
            
            <!-- Zoom-dependent Rich Highway Badge -->
            ${
              showExpandedDetails
                ? `
              <div style="margin-top: 3px; background: white; color: #0f172a; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; white-space: nowrap; border: 1px solid rgba(0,0,0,0.15); box-shadow: 0 2px 6px rgba(0,0,0,0.18); display: flex; align-items: center; gap: 4px;">
                <span>${shortLabel}</span>
                <span style="font-size: 9px; padding: 1px 4px; border-radius: 6px; ${
                  poi.category === 'ev'
                    ? 'background: #dcfce7; color: #15803d;'
                    : poi.isPartner
                    ? 'background: #fef3c7; color: #92400e; font-weight: 900;'
                    : 'background: #f1f5f9; color: #475569;'
                }">
                  ${statusSubtitle}
                </span>
              </div>
            `
                : `
              <div style="margin-top: 2px; background: white; color: #1e293b; padding: 1px 6px; border-radius: 8px; font-size: 9px; font-weight: 800; white-space: nowrap; border: 1px solid rgba(0,0,0,0.15); box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
                ${shortLabel}
              </div>
            `
            }
          </div>
        `;

        const icon = L.divIcon({
          html: innerHtml,
          className: 'gmaps-poi-marker',
          iconSize: [showExpandedDetails ? 130 : 64, showExpandedDetails ? 64 : 38],
          iconAnchor: [showExpandedDetails ? 65 : 32, showExpandedDetails ? 60 : 34]
        });

        const marker = L.marker([poi.coords[1], poi.coords[0]], { icon }).addTo(map);

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedPOI(poi);
          setActivePOITab('status');
          setIsDrawerOpen(true);
          try {
            map.flyTo([poi.coords[1], poi.coords[0]], Math.max(map.getZoom(), 13.5), {
              duration: 0.8
            });
          } catch (_) {}
        });

        poiMarkersRef.current.push(marker);
      });
    } catch (err) {
      console.error('Error rendering POI pins:', err);
    }
  };

  // Handle Adding Stop to Route
  const handleAddStop = async (poi) => {
    if (!poi) return;
    setIsRecalculating(true);

    const newStop = {
      id: poi.id,
      address: poi.name,
      coords: poi.coords,
      category: poi.category,
      detourTime: poi.detourTime
    };

    const updatedStops = [...liveStops, newStop];
    setLiveStops(updatedStops);

    if (onAddStop) {
      onAddStop(newStop);
    }

    // Recalculate driving route through all points: Pickup -> Stops -> Dropoff via OSRM
    const allRoutePoints = [
      pickupCoords,
      ...updatedStops.map((s) => s.coords),
      dropoffCoords
    ].filter(Boolean);

    try {
      const newRoute = await getDrivingRoute(allRoutePoints);
      if (newRoute) {
        setLiveRoute(newRoute);
      }
      setToastMessage(`✓ Added "${poi.name.split(' ')[0]} ${poi.name.split(' ')[1] || ''}" to your route (${poi.detourTime})`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to recalculate route with added stop:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Generate Smart Stops with Groq AI
  const handleGenerateAIPlan = async () => {
    setAiPlanLoading(true);
    setAiPlanResult(null);

    try {
      const plan = await planAITripStops({
        origin: pickupLocation,
        destination: dropoffLocation,
        distanceKm: liveRoute?.distanceKm || 160,
        durationFormatted: liveRoute?.durationFormatted || '3 hrs',
        vehicleType: aiVehiclePropulsion
      });
      setAiPlanResult(plan);
    } catch (err) {
      console.error('AI Highway planner error:', err);
      setAiPlanResult(
        `⚡ **Recommended Milestone Stop**: After ~${Math.round(
          (liveRoute?.distanceKm || 150) * 0.45
        )} km, take a 30-min break at **Expressway Grand Food Plaza (Touralink Partner)**.\n\n` +
          `• **EV Charging**: Tata Power EZ Charge 60kW DC Dual Gun (10% to 80% in 38 mins).\n` +
          `• **Monetized Partner Tie-Up**: Travelers receive **15% discount on food bills** with Touralink booking PIN; dedicated Chauffeur Lounge and complimentary tea.\n` +
          `• **Washrooms**: Clean 5-Star sanitized family restrooms.`
      );
    } finally {
      setAiPlanLoading(false);
    }
  };

  const handleZoomToStart = () => {
    if (mapRef.current && isValidCoords(effectivePickupCoords)) {
      mapRef.current.flyTo([effectivePickupCoords[1], effectivePickupCoords[0]], 14, { duration: 0.8 });
    }
  };

  const handleZoomToEnd = () => {
    if (mapRef.current && isValidCoords(effectiveDropoffCoords)) {
      mapRef.current.flyTo([effectiveDropoffCoords[1], effectiveDropoffCoords[0]], 14, { duration: 0.8 });
    }
  };

  const handleFitEntireRoute = () => {
    if (mapRef.current) {
      renderRouteAndMarkers(mapRef.current);
    }
  };

  if (!isOpen) return null;

  // Active POI list for the selected category
  const activePOIsList = routePOIs.filter((poi) => {
    if (!activeCategory || activeCategory === 'all') return true;
    return poi.category === activeCategory;
  });

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full rounded-none' : 'max-w-6xl h-full sm:h-[92vh] sm:rounded-3xl'
        } bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating App Bar */}
        <div className="relative z-30 px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Left: Origin to Destination with live ETA */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-xs sm:max-w-md">
                  {String(pickupLocation || 'Pickup').split(',')[0]} → {String(dropoffLocation || 'Destination').split(',')[0]}
                </span>
                {liveStops.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                    +{liveStops.length} En-Route Stop{liveStops.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
                <span>{liveRoute?.distanceKm ? `${liveRoute.distanceKm} KM` : '--'}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{liveRoute?.durationFormatted || '--'}</span>
                <span>•</span>
                <span className="text-blue-600 font-bold hidden sm:inline flex items-center gap-1">
                  <span>OpenStreetMap</span>
                  {currentZoom >= 8.5 ? (
                    <span className="text-emerald-600 font-extrabold">(Highway Stations Visible)</span>
                  ) : (
                    <span className="text-slate-400 font-normal">(Zoom in to see EV & fuel pumps)</span>
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* Right Toolbar Controls (AI Trip Planner, Layers, Fullscreen, Close) */}
          <div className="flex items-center gap-2">
            {/* ✨ AI Trip Planner Trigger Button (strictly opt-in via showAIPlanner) */}
            {showAIPlanner && (
              <button
                type="button"
                onClick={() => {
                  setIsAIPlannerOpen(!isAIPlannerOpen);
                  if (!aiPlanResult && !aiPlanLoading) {
                    handleGenerateAIPlan();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Trip Planner</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/25 uppercase tracking-wider font-extrabold">
                  Groq
                </span>
              </button>
            )}

            {/* 🗺️ Direct Google Maps Navigation Button */}
            <button
              type="button"
              onClick={() => {
                const origin = encodeURIComponent(String(pickupLocation || 'Mumbai').split(',')[0]);
                const dest = encodeURIComponent(String(dropoffLocation || 'Goa').split(',')[0]);
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`, '_blank');
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Open route in Google Maps app/browser"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Open in Google Maps</span>
              <span className="sm:hidden">Google Maps</span>
            </button>

            {/* OpenStreetMap Layer Style Selector */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {OSM_TILE_LAYERS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCurrentStyle(style.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentStyle === style.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {style.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
              title="Close Map (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Canvas with Floating Overlays */}
        <div className="relative flex-1 min-h-[400px] w-full overflow-hidden bg-slate-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

          {/* 📍 FLOATING CATEGORY CHIPS BAR */}
          <div className="absolute top-4 left-4 right-4 sm:right-auto z-[400] pointer-events-auto">
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl overflow-x-auto scrollbar-none max-w-xl">
              <div className="px-2 py-1 text-slate-400 text-xs font-bold shrink-0 hidden sm:flex items-center gap-1">
                <span>Along route:</span>
              </div>

              {poiCategories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedPOI(null);
                      setIsDrawerOpen(true);
                    }}
                    style={{
                      backgroundColor: isActive ? cat.color : undefined,
                      color: isActive ? '#ffffff' : undefined
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-2xs ${
                      isActive
                        ? 'shadow-md scale-102 ring-2 ring-white/60'
                        : 'bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Loading Indicator or Zoom Hint */}
            {isLoadingRealPOIs ? (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/90 backdrop-blur-md text-white text-[11px] font-bold shadow-lg border border-blue-400/30">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-300 shrink-0" />
                <span>Locating real stations along OpenStreetMap route...</span>
              </div>
            ) : currentZoom < 8.5 ? (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold shadow-lg border border-white/10">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Zoom in closer to see live {allowEV ? 'EV chargers & ' : ''}fuel pumps & highway stops</span>
              </div>
            ) : null}
          </div>

          {/* Toast Notification Banner (When stop is added) */}
          {toastMessage && (
            <div className="absolute top-18 left-1/2 -translate-x-1/2 z-[450] px-4 py-2 rounded-2xl bg-slate-950 text-white text-xs font-bold shadow-2xl border border-emerald-400/40 flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Quick Zoom Controls (+ / -) */}
          <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-slate-200">
            <button
              type="button"
              onClick={() => mapRef.current?.zoomIn()}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => mapRef.current?.zoomOut()}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Fast Navigation Quick Pills (Zoom to Start / End / Fit) */}
          <div className="absolute top-4 right-14 z-[400] hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg text-white">
            <button
              onClick={handleZoomToStart}
              className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold hover:bg-white/10 text-blue-300 transition-colors cursor-pointer"
            >
              Start (A)
            </button>
            <button
              onClick={handleZoomToEnd}
              className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold hover:bg-white/10 text-emerald-300 transition-colors cursor-pointer"
            >
              End (B)
            </button>
            <button
              onClick={handleFitEntireRoute}
              className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
            >
              Fit Route
            </button>
          </div>

          {/* ⚡ RICH INSPECTION CARD (When user clicks on any EV station, fuel pump, or restaurant pin) */}
          {selectedPOI && (
            <div className="absolute top-20 right-4 sm:right-6 w-full max-w-sm sm:max-w-md z-[420] pointer-events-auto animate-fadeIn">
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header with Category Color bar & Close */}
                <div
                  className="px-4 py-3 text-white flex items-center justify-between"
                  style={{ backgroundColor: selectedPOI.brandColor || '#2563eb' }}
                >
                  <div className="flex items-center gap-2">
                    {selectedPOI.category === 'ev' && <Zap className="w-5 h-5" />}
                    {selectedPOI.category === 'gas' && <Fuel className="w-5 h-5" />}
                    {selectedPOI.category === 'food' && <Utensils className="w-5 h-5" />}
                    {selectedPOI.category === 'hotel' && <Hotel className="w-5 h-5" />}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider opacity-90">
                        {selectedPOI.categoryLabel}
                      </h4>
                      <div className="text-sm font-black truncate max-w-[240px]">
                        {selectedPOI.brand || selectedPOI.name}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPOI(null)}
                    className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub-Tabs: Status/Specs vs Chauffeur Reviews vs Partner Perks */}
                <div className="flex items-center border-b border-slate-100 bg-slate-50 px-2 pt-1">
                  <button
                    onClick={() => setActivePOITab('status')}
                    className={`flex-1 py-2 text-center text-xs font-black transition-all border-b-2 cursor-pointer ${
                      activePOITab === 'status'
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Status & Details
                  </button>
                  <button
                    onClick={() => setActivePOITab('reviews')}
                    className={`flex-1 py-2 text-center text-xs font-black transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1 ${
                      activePOITab === 'reviews'
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span>Reviews</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
                      {selectedPOI.reviews?.length || 0}
                    </span>
                  </button>
                  {selectedPOI.isPartner && (
                    <button
                      onClick={() => setActivePOITab('partner')}
                      className={`flex-1 py-2 text-center text-xs font-black transition-all border-b-2 cursor-pointer flex items-center justify-center gap-1 ${
                        activePOITab === 'partner'
                          ? 'border-amber-600 text-amber-700 bg-white'
                          : 'border-transparent text-amber-700/80 hover:text-amber-900'
                      }`}
                    >
                      <Gift className="w-3 h-3" />
                      <span>Partner Perks</span>
                    </button>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700">
                  {/* TAB 1: STATUS & SPECS */}
                  {activePOITab === 'status' && (
                    <>
                      {/* Name & Detour Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">
                            {selectedPOI.name}
                          </h3>
                          {selectedPOI.address && (
                            <div className="text-[11px] text-slate-600 font-semibold mt-1 flex items-start gap-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{selectedPOI.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <div className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              <span>{selectedPOI.rating}</span>
                              <span className="text-slate-400 ml-1">({selectedPOI.reviewsCount} reviews)</span>
                            </div>
                            {selectedPOI.isRealLife && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                OpenStreetMap Verified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                            {selectedPOI.detourTime} detour
                          </span>
                          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {selectedPOI.detourKm}
                          </div>
                        </div>
                      </div>

                      {/* ⚡ REAL-LIFE EV CHARGING METRICS */}
                      {selectedPOI.category === 'ev' && (
                        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-emerald-900 flex items-center gap-1.5 text-xs">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              {selectedPOI.statusBadge || '🟢 Fully Operational'}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {selectedPOI.uptime || '99.4% uptime'}
                            </span>
                          </div>

                          <p className="text-[11px] text-emerald-800 font-semibold">
                            {selectedPOI.statusNote || 'Verified by Touralink Fleet Chauffeur telemetry'}
                          </p>

                          <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <div className="text-slate-500 font-bold">Available Guns:</div>
                              <div className="text-slate-900 font-black">
                                {selectedPOI.gunsFree} of {selectedPOI.totalGuns} Guns Free
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 font-bold">Charging Speed:</div>
                              <div className="text-slate-900 font-black">{selectedPOI.speed}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-slate-500 font-bold">Tariff Rate:</div>
                              <div className="text-emerald-700 font-extrabold">{selectedPOI.price}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* EV Connectors Breakdown List */}
                      {selectedPOI.connectors && (
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
                            <span>Live Connector Ports:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {selectedPOI.connectors.map((c, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px]"
                              >
                                <div>
                                  <div className="font-extrabold text-slate-900">{c.type}</div>
                                  <div className="text-slate-500">{c.power}</div>
                                </div>
                                <span className={`font-black ${c.statusColor}`}>{c.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ⛽ PETROL / DIESEL DETAILS */}
                      {selectedPOI.category === 'gas' && (
                        <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-orange-900 flex items-center gap-1.5 text-xs">
                              <Fuel className="w-4 h-4 text-orange-600" />
                              {selectedPOI.openStatus}
                            </span>
                            <span className="text-[10px] font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full">
                              {selectedPOI.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold">{selectedPOI.price}</div>
                        </div>
                      )}

                      {/* 🍽️ SPONSORED PARTNER DHABA BANNER */}
                      {selectedPOI.isPartner && (
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span>Touralink Verified Highway Partner</span>
                          </div>
                          <p className="text-[11px] text-amber-950 font-medium">
                            {selectedPOI.adTag || 'Official Touralink Stop — Driver lounge & passenger discounts.'}
                          </p>
                        </div>
                      )}

                      {/* Amenities checklist */}
                      {selectedPOI.amenities && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600">Highway Facilities:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedPOI.amenities.map((item, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* TAB 2: CHAUFFEUR & DRIVER REVIEWS */}
                  {activePOITab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <div className="font-black text-slate-900 text-sm">
                            {selectedPOI.rating} out of 5.0
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Based on {selectedPOI.reviewsCount} verified highway check-ins
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-xl text-[10px] border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Chauffeur Verified</span>
                        </div>
                      </div>

                      {selectedPOI.reviews?.length > 0 ? (
                        <div className="space-y-2.5 divide-y divide-slate-100">
                          {selectedPOI.reviews.map((rev) => (
                            <div key={rev.id} className="pt-2 first:pt-0 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-slate-900">{rev.author}</span>
                                  {rev.verifiedChauffeur && (
                                    <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[9px] font-extrabold flex items-center gap-0.5">
                                      <Award className="w-2.5 h-2.5" /> Chauffeur
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                              </div>

                              {rev.carModel && (
                                <div className="text-[10px] text-slate-500 font-semibold">
                                  Vehicle: <span className="text-slate-800 font-bold">{rev.carModel}</span>
                                </div>
                              )}

                              <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(rev.rating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                              </div>

                              <p className="text-[11px] text-slate-700 italic leading-relaxed">
                                "{rev.comment}"
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-400">
                          <MessageSquare className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <span>No community reviews logged for this location yet.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: PARTNER TIE-UP PERKS */}
                  {activePOITab === 'partner' && selectedPOI.isPartner && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>Commercial Partner Stop</span>
                        </div>
                        <p className="text-[11px] text-amber-950 font-medium">
                          Touralink fleet and passengers receive guaranteed priority service, clean facilities, and bill discounts.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-black text-slate-800">
                          Active Partner Agreement Benefits:
                        </div>
                        {selectedPOI.partnerPerks?.map((perk, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-[11px]"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-semibold text-slate-800">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions: Open in OpenStreetMap + Add Stop */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedPOI.osmMapUrl) {
                        window.open(selectedPOI.osmMapUrl, '_blank');
                      } else {
                        window.open(
                          `https://www.openstreetmap.org/search?query=${encodeURIComponent(
                            selectedPOI.name + ' ' + (selectedPOI.address || '')
                          )}`,
                          '_blank'
                        );
                      }
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>OpenStreetMap</span>
                  </button>

                  <button
                    type="button"
                    disabled={
                      liveStops.some((s) => s.id === selectedPOI.id || s.address === selectedPOI.name) ||
                      isRecalculating
                    }
                    onClick={() => handleAddStop(selectedPOI)}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      liveStops.some((s) => s.id === selectedPOI.id || s.address === selectedPOI.name)
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                    }`}
                  >
                    {liveStops.some((s) => s.id === selectedPOI.id || s.address === selectedPOI.name) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Route ({selectedPOI.detourTime})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stop to Route ({selectedPOI.detourTime})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✨ GROQ AI HIGHWAY TRIP PLANNER DRAWER */}
          {showAIPlanner && isAIPlannerOpen && (
            <div className="absolute top-18 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[430] pointer-events-auto animate-fadeIn">
              <div className="rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 shadow-2xl text-white overflow-hidden flex flex-col max-h-[82vh]">
                {/* AI Planner Header */}
                <div className="p-4 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-blue-300">
                        Touralink AI Travel Planner
                      </h3>
                      <div className="text-sm font-black text-white">
                        Smart Highway Stop Recommendations
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAIPlannerOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* AI Configuration Options */}
                <div className="p-4 space-y-3 overflow-y-auto text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Select Vehicle Propulsion:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAiVehiclePropulsion('ev')}
                        className={`p-2 rounded-xl text-left border font-bold transition-all cursor-pointer ${
                          aiVehiclePropulsion === 'ev'
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                            : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Electric EV Fleet</span>
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">Nexon / Tigor EV</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAiVehiclePropulsion('fuel')}
                        className={`p-2 rounded-xl text-left border font-bold transition-all cursor-pointer ${
                          aiVehiclePropulsion === 'fuel'
                            ? 'bg-orange-950/80 border-orange-400 text-orange-300 ring-1 ring-orange-400'
                            : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1 text-xs">
                          <Fuel className="w-3.5 h-3.5 text-orange-400" />
                          <span>Fuel Fleet</span>
                        </div>
                        <div className="text-[10px] opacity-75 mt-0.5">Ertiga / Innova / Diesel</div>
                      </button>
                    </div>
                  </div>

                  {/* Re-generate Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">
                      Analyzing route: {liveRoute?.distanceKm || 160} KM
                    </span>
                    <button
                      type="button"
                      disabled={aiPlanLoading}
                      onClick={handleGenerateAIPlan}
                      className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {aiPlanLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Calculating...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          <span>Re-generate Plan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Response Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-blue-500/20 text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans text-xs">
                    {aiPlanLoading ? (
                      <div className="py-8 flex flex-col items-center justify-center gap-2 text-blue-400">
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-xs font-bold text-slate-300">
                          AI is optimizing en-route stops & partner dhabas...
                        </span>
                      </div>
                    ) : aiPlanResult ? (
                      <div>
                        {aiPlanResult}

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-amber-300 font-bold">
                            ⭐ Includes Touralink 15% Partner Discount
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const partnerPoi = activePOIsList.find((p) => p.isPartner) || activePOIsList[0];
                              if (partnerPoi) {
                                handleAddStop(partnerPoi);
                                setIsAIPlannerOpen(false);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors cursor-pointer"
                          >
                            Add AI Stop to Route
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🚗 BOTTOM SHEET / EN-ROUTE PLACES DRAWER */}
          {!selectedPOI && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[400] pointer-events-auto transition-all duration-300">
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-80 sm:max-h-96">
                {/* Drawer Header */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          poiCategories.find((c) => c.id === activeCategory)?.color || '#2563eb'
                      }}
                    />
                    <span className="text-xs font-extrabold text-slate-900">
                      {poiCategories.find((c) => c.id === activeCategory)?.label || 'All En-Route Stops'} (
                      {activePOIsList.length} verified)
                    </span>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                    title={isDrawerOpen ? 'Collapse list' : 'Expand list'}
                  >
                    {isDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>

                {/* Drawer Body: Place Cards List */}
                {isDrawerOpen && (
                  <div className="overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
                    {isLoadingRealPOIs ? (
                      <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="text-xs font-bold text-slate-700">
                          Querying live locations via OpenStreetMap...
                        </span>
                      </div>
                    ) : activePOIsList.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <MapPin className="w-6 h-6 mx-auto mb-1 opacity-40" />
                        <span className="text-xs font-semibold">
                          No verified stations found for this category along this highway.
                        </span>
                      </div>
                    ) : (
                      activePOIsList.map((poi) => {
                        const isAlreadyAdded = liveStops.some(
                          (s) => s.id === poi.id || s.address === poi.name
                        );

                        return (
                          <div
                            key={poi.id}
                            onClick={() => {
                              setSelectedPOI(poi);
                              setActivePOITab('status');
                              if (mapRef.current) {
                                mapRef.current.flyTo([poi.coords[1], poi.coords[0]], 13.5, {
                                  duration: 0.8
                                });
                              }
                            }}
                            className="p-3 rounded-2xl transition-all cursor-pointer flex flex-col gap-2 bg-white hover:bg-slate-50 border border-slate-200/70"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black text-slate-900 truncate max-w-[210px]">
                                    {poi.name}
                                  </span>
                                  {poi.isPartner && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                      Partner
                                    </span>
                                  )}
                                  {poi.isRealLife && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                      OSM
                                    </span>
                                  )}
                                </div>

                                {poi.address && (
                                  <div className="text-[10px] text-slate-500 font-semibold truncate flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{poi.address}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                                  <div className="flex items-center text-amber-500 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                                    <span>{poi.rating}</span>
                                    <span className="text-slate-400 ml-1">({poi.reviewsCount})</span>
                                  </div>
                                  <span>•</span>
                                  <span
                                    className={`font-bold ${
                                      poi.category === 'ev' ? 'text-emerald-700' : 'text-slate-700'
                                    }`}
                                  >
                                    {poi.category === 'ev'
                                      ? `${poi.gunsFree || 3}/${poi.totalGuns || 4} Guns Free`
                                      : poi.openStatus?.split('•')?.[0]}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-500 font-medium truncate">
                                  {poi.price}
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-300">
                                  {poi.detourTime} detour
                                </span>
                                <div className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                  {poi.detourKm}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                              <div className="text-[10px] text-slate-500 font-medium truncate">
                                {poi.speed || poi.amenities?.slice(0, 2).join(' • ')}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPOI(poi);
                                    setActivePOITab('status');
                                  }}
                                  className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold transition-colors"
                                >
                                  View Specs
                                </button>

                                <button
                                  type="button"
                                  disabled={isAlreadyAdded || isRecalculating}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddStop(poi);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs ${
                                    isAlreadyAdded
                                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                      : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                                  }`}
                                >
                                  {isAlreadyAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Stop</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Journey Overview & Route Status */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">
              Total Journey: <strong className="font-black text-slate-900">{liveRoute?.distanceKm || '--'} KM</strong> ({liveRoute?.durationFormatted || '--'})
            </span>
            {liveStops.length > 0 && (
              <span className="text-[11px] text-slate-500">
                via {liveStops.map((s) => (s?.address ? String(s.address).split(' ')[0] : s?.name || 'Stop')).join(' → ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-colors cursor-pointer shadow-xs"
            >
              Done With Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
