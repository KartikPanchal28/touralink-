import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Fuel,
  Hotel,
  Mountain,
  Waves,
  Utensils,
  Search,
  Check,
  Star,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  ShieldCheck,
  Send,
  Loader2,
  Bike,
  Car,
  Tag,
  Crosshair,
  Bot,
  MessageSquare
} from 'lucide-react';
import {
  calculateFastestAndScenicRoutes,
  fetchTripPlannerPOIs,
  searchPlaces,
  getPresetCoords,
  OSM_TILE_LAYERS,
  TRIP_PLANNER_POIS_DATABASE
} from '../../services/osmService';
import { generateChatCompletion, isAIConfigured } from '../../services/aiService';

// Vehicle Options
const VEHICLE_OPTIONS = [
  { id: 'ev', label: '⚡ EV (Electric)', sublabel: 'Fast Charging Hubs', icon: Zap, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
  { id: 'petrol_diesel', label: '⛽ Petrol / Diesel', sublabel: 'Swagat Fuel Bunks', icon: Fuel, color: 'text-blue-700 bg-blue-50 border-blue-300' },
  { id: 'cng', label: '🟢 CNG', sublabel: 'Green Corridors', icon: Fuel, color: 'text-teal-700 bg-teal-50 border-teal-300' },
  { id: 'bike', label: '🏍️ Motorcycle / Bike', sublabel: 'Twisties & Pitstops', icon: Bike, color: 'text-amber-700 bg-amber-50 border-amber-300' }
];

// Curated POI Categories
const POI_CATEGORIES = [
  { id: 'all', label: '🌟 All Stops', icon: MapPin, color: '#3b82f6', bgLight: '#eff6ff' },
  { id: 'waterfall', label: '🌊 Waterfalls & Pools', icon: Waves, color: '#0284c7', bgLight: '#f0f9ff' },
  { id: 'sports', label: '🤿 Adventure Sports', icon: Mountain, color: '#7c3aed', bgLight: '#f5f3ff' },
  { id: 'temple', label: '🛕 Temples & Forts', icon: Compass, color: '#dc2626', bgLight: '#fef2f2' },
  { id: 'hotel', label: '🏨 Hotels & Resorts', icon: Hotel, color: '#4f46e5', bgLight: '#eef2ff' },
  { id: 'food', label: '🍽️ Highway Plazas', icon: Utensils, color: '#ea580c', bgLight: '#fff7ed' },
  { id: 'fuel_ev', label: '⚡ / ⛽ Fuel & Chargers', icon: Zap, color: '#059669', bgLight: '#ecfdf5' }
];

// Quick Destination Shortcuts
const DESTINATION_CHIPS = [
  { label: 'North Goa', dest: 'North Goa (Baga / Calangute)', coords: [73.7553, 15.5527] },
  { label: 'Mahabaleshwar', dest: 'Mahabaleshwar Hills', coords: [73.6586, 17.9237] },
  { label: 'Kolad Rafting', dest: 'Kolad', coords: [73.3361, 18.4239] },
  { label: 'Statue of Unity', dest: 'Statue of Unity (Kevadia)', coords: [73.7191, 21.8380] },
  { label: 'Lonavala Ghats', dest: 'Lonavala / Khandala', coords: [73.3667, 18.7615] },
  { label: 'Coorg Hills', dest: 'Coorg (Madikeri)', coords: [75.7382, 12.4244] }
];

// Quick Origin Shortcuts
const ORIGIN_CHIPS = [
  { label: 'Mumbai Airport', coords: [72.8746, 19.0896] },
  { label: 'Pune Baner', coords: [73.7840, 18.5590] },
  { label: 'Ahmedabad', coords: [72.5714, 23.0225] },
  { label: 'Bengaluru', coords: [77.5946, 12.9716] }
];

export default function TripPlannerMapExperience({
  initialDestination = 'North Goa (Baga / Calangute)',
  initialDestCoords = [73.7553, 15.5527],
  initialOrigin = 'Mumbai Airport (BOM)',
  initialOriginCoords = [72.8746, 19.0896],
  initialVehicleType = 'petrol_diesel',
  onSelectRoute,
  onAddStopToItinerary,
  className = ''
}) {
  // Container & Map Refs
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const fastestPolylineRef = useRef(null);
  const scenicPolylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const botMarkerRef = useRef(null);
  const poiMarkersGroupRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Search & Geolocation State
  const [destinationQuery, setDestinationQuery] = useState(initialDestination);
  const [destinationCoords, setDestinationCoords] = useState(initialDestCoords);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const [originQuery, setOriginQuery] = useState(initialOrigin);
  const [originCoords, setOriginCoords] = useState(initialOriginCoords);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Active Vehicle Type: 'ev' | 'petrol_diesel' | 'cng' | 'bike'
  const [vehicleType, setVehicleType] = useState(initialVehicleType);

  // Route State: Fastest vs Scenic
  const [routesData, setRoutesData] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState('fastest'); // 'fastest' | 'scenic'
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  // POI & Stop Category Filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [poisList, setPoisList] = useState([]);
  const [selectedPoiModal, setSelectedPoiModal] = useState(null);
  const [addedStops, setAddedStops] = useState([]);

  // Roaming Bot State
  const [isRoaming, setIsRoaming] = useState(false);
  const [roamProgress, setRoamProgress] = useState(0); // 0 to 100%
  const [roamSpeed, setRoamSpeed] = useState(1); // 1x, 2x, 4x
  const [botCallout, setBotCallout] = useState('Touralink Rover ready to scout!');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isBotChatOpen, setIsBotChatOpen] = useState(true);

  // Map & Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tileStyle, setTileStyle] = useState('clean'); // 'clean' | 'dark' | 'satellite'

  // Chat with Bot
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello Traveler! I'm Rover, your Touralink AI Scout Bot. I've plotted both the Fastest Highway Corridor and the Scenic Sahyadri Ghats route for your journey. What would you like to explore?`,
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Speech synthesizer voice function
  const speakBotCallout = useCallback((text) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (_) {}
  }, [isVoiceEnabled]);

  // 1. Compute Routes when coordinates or vehicle change
  useEffect(() => {
    if (!originCoords || !destinationCoords) return;

    let isMounted = true;
    setIsLoadingRoutes(true);

    calculateFastestAndScenicRoutes(originCoords, destinationCoords, vehicleType)
      .then((data) => {
        if (!isMounted || !data) return;
        setRoutesData(data);

        // Motorcycle defaults to Scenic route automatically
        if (vehicleType === 'bike') {
          setActiveRouteType('scenic');
          setBotCallout('🏍️ Biker Mode: Selected scenic ghat curves with stunning vistas!');
        }

        // Notify parent callback if available
        if (onSelectRoute) {
          onSelectRoute(activeRouteType === 'scenic' ? data.scenic : data.fastest);
        }
      })
      .catch((err) => {
        console.error('Error calculating trip routes:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingRoutes(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originCoords, destinationCoords, vehicleType]);

  // 2. Fetch POIs along active route
  useEffect(() => {
    if (!originCoords || !destinationCoords) return;

    const activeRoute = activeRouteType === 'scenic' ? routesData?.scenic : routesData?.fastest;
    const geometry = activeRoute?.geometry;

    fetchTripPlannerPOIs({
      startCoords: originCoords,
      endCoords: destinationCoords,
      routeGeometry: geometry,
      vehicleType,
      category: activeCategory
    }).then((pois) => {
      setPoisList(pois);
    });
  }, [originCoords, destinationCoords, routesData, activeRouteType, vehicleType, activeCategory]);

  // 3. Initialize & Sync Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove existing instance if any
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (_) {}
      mapRef.current = null;
    }

    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const midLat = (originCoords[1] + destinationCoords[1]) / 2;
    const midLng = (originCoords[0] + destinationCoords[0]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [midLat, midLng],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    mapRef.current = map;

    // Layer selection
    const activeTileConfig = OSM_TILE_LAYERS.find((l) => l.id === tileStyle) || OSM_TILE_LAYERS[0];
    const tile = L.tileLayer(activeTileConfig.url, {
      maxZoom: 19,
      subdomains: activeTileConfig.subdomains || 'abcd',
      attribution: activeTileConfig.attribution
    }).addTo(map);

    tile.on('tileerror', () => {
      if (!map._hasOsmFallback) {
        map._hasOsmFallback = true;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      }
    });

    tileLayerRef.current = tile;

    // POI layer group
    poiMarkersGroupRef.current = L.layerGroup().addTo(map);

    // Ensure map tiles render without grey clipping
    setTimeout(() => {
      if (mapRef.current) {
        try {
          mapRef.current.invalidateSize();
        } catch (_) {}
      }
    }, 150);

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (_) {}
        mapRef.current = null;
      }
    };
  }, [tileStyle]);

  // Handle Fullscreen Leaflet Resize Invalidation & Escape Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 250);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // 4. Draw Polylines & Markers on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routesData) return;

    // Remove old polylines
    if (fastestPolylineRef.current) {
      map.removeLayer(fastestPolylineRef.current);
      fastestPolylineRef.current = null;
    }
    if (scenicPolylineRef.current) {
      map.removeLayer(scenicPolylineRef.current);
      scenicPolylineRef.current = null;
    }
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }

    const fastestCoords = routesData.fastest?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [];
    const scenicCoords = routesData.scenic?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [];

    // Draw Scenic Route
    if (scenicCoords.length > 0) {
      const isScenicActive = activeRouteType === 'scenic';
      scenicPolylineRef.current = L.polyline(scenicCoords, {
        color: '#059669',
        weight: isScenicActive ? 7 : 4,
        opacity: isScenicActive ? 0.95 : 0.45,
        dashArray: isScenicActive ? null : '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      scenicPolylineRef.current.on('click', () => {
        setActiveRouteType('scenic');
        setBotCallout('Switched to Scenic Sahyadri Route! 🌿');
      });
    }

    // Draw Fastest Route
    if (fastestCoords.length > 0) {
      const isFastestActive = activeRouteType === 'fastest';
      fastestPolylineRef.current = L.polyline(fastestCoords, {
        color: '#2563eb',
        weight: isFastestActive ? 7 : 4,
        opacity: isFastestActive ? 0.95 : 0.45,
        dashArray: isFastestActive ? null : '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      fastestPolylineRef.current.on('click', () => {
        setActiveRouteType('fastest');
        setBotCallout('Switched to Fastest Expressway Route! ⚡');
      });
    }

    // Start Pin (A)
    const startIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 14px rgba(37,99,235,0.45);">
          A
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    startMarkerRef.current = L.marker([originCoords[1], originCoords[0]], { icon: startIcon }).addTo(map);

    // End Pin (B)
    const endIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: #059669; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 14px rgba(5,150,105,0.45);">
          B
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    endMarkerRef.current = L.marker([destinationCoords[1], destinationCoords[0]], { icon: endIcon }).addTo(map);

    // Fit map bounds to show complete circuit
    try {
      const allPoints = [...fastestCoords, ...scenicCoords];
      if (allPoints.length > 0) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [60, 60], maxZoom: 13 });
      }
    } catch (_) {}
  }, [routesData, activeRouteType, originCoords, destinationCoords]);

  // 5. Draw POI Markers
  useEffect(() => {
    const map = mapRef.current;
    const group = poiMarkersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    poisList.forEach((poi) => {
      const [lng, lat] = poi.coords;
      let symbol = '📍';
      let bgColor = poi.brandColor || '#2563eb';

      if (poi.category === 'waterfall') symbol = '🌊';
      else if (poi.category === 'sports') symbol = '🤿';
      else if (poi.category === 'temple') symbol = '🛕';
      else if (poi.category === 'hotel') symbol = '🏨';
      else if (poi.category === 'food') symbol = '🍽️';
      else if (poi.category === 'fuel_ev') {
        symbol = poi.vehicleTag === 'ev' ? '⚡' : '⛽';
      }

      const poiIcon = L.divIcon({
        className: 'poi-custom-pin',
        html: `
          <div style="background: white; border: 2.5px solid ${bgColor}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.25); cursor: pointer; transition: transform 0.2s;">
            ${symbol}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([lat, lng], { icon: poiIcon });
      marker.on('click', () => {
        setSelectedPoiModal(poi);
        setBotCallout(`Inspecting: ${poi.name} (${poi.detourTime})`);
      });
      group.addLayer(marker);
    });
  }, [poisList]);

  // 6. Roaming Bot Motion Along Active Polyline
  const activeCoordinates = useMemo(() => {
    const activeRoute = activeRouteType === 'scenic' ? routesData?.scenic : routesData?.fastest;
    return activeRoute?.geometry?.coordinates || [];
  }, [routesData, activeRouteType]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || activeCoordinates.length === 0) return;

    const totalPoints = activeCoordinates.length;
    const currentIndex = Math.min(
      totalPoints - 1,
      Math.max(0, Math.floor((roamProgress / 100) * (totalPoints - 1)))
    );
    const [bLng, bLat] = activeCoordinates[currentIndex];

    // Create or update Roaming Bot Marker
    if (!botMarkerRef.current) {
      const botIcon = L.divIcon({
        className: 'roaming-bot-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-10 h-10 rounded-full bg-cyan-400 opacity-60 animate-ping"></span>
            <div class="relative w-8 h-8 rounded-2xl bg-slate-900 border-2 border-cyan-400 text-white flex items-center justify-center shadow-xl shadow-cyan-500/50">
              <span style="font-size: 16px;">🤖</span>
            </div>
            <div class="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black border border-cyan-400 shadow-md">
              Rover AI
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      botMarkerRef.current = L.marker([bLat, bLng], { icon: botIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      botMarkerRef.current.setLatLng([bLat, bLng]);
    }

    // Check for nearby POIs to announce
    if (isRoaming && poisList.length > 0) {
      const nearest = poisList.find((p) => {
        const d = Math.abs(p.coords[0] - bLng) + Math.abs(p.coords[1] - bLat);
        return d < 0.08;
      });

      if (nearest) {
        const calloutMsg = `Passing ${nearest.name}! ${nearest.badge || ''}`;
        setBotCallout(calloutMsg);
      }
    }
  }, [activeCoordinates, roamProgress, isRoaming, poisList]);

  // Animation Loop for Roaming
  useEffect(() => {
    if (!isRoaming || activeCoordinates.length === 0) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setRoamProgress((prev) => {
        const next = prev + delta * (4 * roamSpeed);
        if (next >= 100) {
          setIsRoaming(false);
          setBotCallout('Destination reached! Ready to formulate itinerary.');
          speakBotCallout('Trip scout completed! Destination reached successfully.');
          return 100;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRoaming, roamSpeed, activeCoordinates, speakBotCallout]);

  // Handle Geolocation
  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setOriginCoords([lng, lat]);
        setOriginQuery('Current GPS Location');
        setIsLocatingUser(false);
        setBotCallout('Device GPS synced! Recalibrating route...');
        speakBotCallout('Device location captured. Recalibrating optimal driving route.');
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setIsLocatingUser(false);
        // Fallback to Mumbai Airport
        setOriginCoords([72.8746, 19.0896]);
        setOriginQuery('Mumbai Airport (BOM)');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Destination Search
  const handleDestinationInput = async (val) => {
    setDestinationQuery(val);
    if (!val || val.trim().length < 2) {
      setDestinationSuggestions([]);
      return;
    }
    setIsSearchingDest(true);
    setShowDestDropdown(true);
    try {
      const results = await searchPlaces(val);
      setDestinationSuggestions(results);
    } catch (_) {}
    setIsSearchingDest(false);
  };

  const handleSelectDestination = (placeName, coords) => {
    setDestinationQuery(placeName);
    setDestinationCoords(coords);
    setShowDestDropdown(false);
    setDestinationSuggestions([]);
    setRoamProgress(0);
    setBotCallout(`Set destination to ${placeName.split(',')[0]}!`);
  };

  // Handle Origin Search
  const handleOriginInput = async (val) => {
    setOriginQuery(val);
    if (!val || val.trim().length < 2) {
      setOriginSuggestions([]);
      return;
    }
    setIsSearchingOrigin(true);
    setShowOriginDropdown(true);
    try {
      const results = await searchPlaces(val);
      setOriginSuggestions(results);
    } catch (_) {}
    setIsSearchingOrigin(false);
  };

  const handleSelectOrigin = (placeName, coords) => {
    setOriginQuery(placeName);
    setOriginCoords(coords);
    setShowOriginDropdown(false);
    setOriginSuggestions([]);
    setRoamProgress(0);
    setBotCallout(`Start point set to ${placeName.split(',')[0]}!`);
  };

  // Swap Start & Destination
  const handleSwapLocations = () => {
    const tempQ = destinationQuery;
    const tempC = destinationCoords;
    setDestinationQuery(originQuery);
    setDestinationCoords(originCoords);
    setOriginQuery(tempQ);
    setOriginCoords(tempC);
    setRoamProgress(0);
    setBotCallout('Flipped route origin and destination!');
  };

  // Send message to Roaming Bot
  const handleSendMessage = async (customPrompt) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsBotThinking(true);

    const lower = textToSend.toLowerCase();

    // Trigger local immediate actions if keyword matches
    if (lower.includes('scenic') || lower.includes('enjoyable') || lower.includes('view') || lower.includes('twist')) {
      setActiveRouteType('scenic');
      setBotCallout('Switched to Scenic Sahyadri Route! 🌿');
    } else if (lower.includes('fast') || lower.includes('expressway') || lower.includes('direct')) {
      setActiveRouteType('fastest');
      setBotCallout('Switched to Fastest Expressway Route! ⚡');
    }

    if (lower.includes('waterfall')) {
      setActiveCategory('waterfall');
    } else if (lower.includes('temple') || lower.includes('fort')) {
      setActiveCategory('temple');
    } else if (lower.includes('hotel') || lower.includes('resort') || lower.includes('stay')) {
      setActiveCategory('hotel');
    } else if (lower.includes('sport') || lower.includes('scuba') || lower.includes('rafting') || lower.includes('paragliding')) {
      setActiveCategory('sports');
    } else if (lower.includes('ev') || lower.includes('charge') || lower.includes('charger')) {
      setVehicleType('ev');
      setActiveCategory('fuel_ev');
    } else if (lower.includes('bike') || lower.includes('motorcycle')) {
      setVehicleType('bike');
      setActiveRouteType('scenic');
    }

    // Generate intelligent AI response via Groq or smart reasoning fallback
    try {
      const systemPrompt = `You are Rover, an expert road trip copilot for Touralink in India.
Current Route: From ${originQuery} to ${destinationQuery}.
Active Route Choice: ${activeRouteType === 'scenic' ? 'Scenic Sahyadri Ghats & Waterfalls' : 'Fastest NH48 Expressway'}.
Vehicle: ${vehicleType}.
Give concise, vibrant, helpful road trip advice (max 2-3 sentences) with emoji. Mention authentic stops, waterfalls, temples, hotels, or charging tips as requested.`;

      const aiResponse = await generateChatCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: textToSend }
        ],
        temperature: 0.7,
        max_tokens: 180
      });

      const replyText = aiResponse?.content || generateLocalBotReply(textToSend, vehicleType, activeRouteType, destinationQuery);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: 'Just now'
        }
      ]);
      setBotCallout(replyText.slice(0, 70) + '...');
      speakBotCallout(replyText);
    } catch (_) {
      const localReply = generateLocalBotReply(textToSend, vehicleType, activeRouteType, destinationQuery);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: 'bot',
          text: localReply,
          time: 'Just now'
        }
      ]);
      setBotCallout(localReply.slice(0, 70) + '...');
      speakBotCallout(localReply);
    } finally {
      setIsBotThinking(false);
    }
  };

  // Local reasoning helper
  function generateLocalBotReply(text, vehicle, routeMode, dest) {
    const l = text.toLowerCase();
    if (l.includes('scenic')) {
      return `I've switched you to the Scenic Sahyadri Route! You'll pass stunning ghats, roadside waterfalls, and panoramic viewpoints.`;
    }
    if (l.includes('fast')) {
      return `Fastest corridor active! Running on the 4-6 lane expressway with minimal delays and 24/7 highway food plazas.`;
    }
    if (l.includes('waterfall')) {
      return `Filtered waterfalls along your path! Don't miss Dudhsagar Waterfalls or Lingmala cascade for a natural freshwater plunge.`;
    }
    if (l.includes('temple') || l.includes('fort')) {
      return `Showing historic hill shrines and heritage fortresses! Sinhagad Fort and Mahabaleshwar's ancient Panchganga temple are verified stops.`;
    }
    if (l.includes('ev') || l.includes('charge')) {
      return `Plotted 120kW ultra-fast Jio-bp pulse and Tata Power 60kW DC chargers with safe shaded bays and coffee plazas.`;
    }
    if (l.includes('hotel') || l.includes('stay')) {
      return `Highlighted top verified resorts along your route, like Le Méridien and Taj Holiday Village, with chauffeur rooms available.`;
    }
    if (l.includes('bike')) {
      return `Biker Mode configured! The Sahyadri ghats feature sweeping hairpins, scenic lookout points, and biker-friendly filter coffee pitstops.`;
    }
    return `Great choice! I've updated the map for ${dest.split(',')[0]} and verified clean rest stops, dining, and scenic activities along your drive.`;
  }

  // Active Route Object
  const currentRoute = activeRouteType === 'scenic' ? routesData?.scenic : routesData?.fastest;

  return (
    <div
      className={`relative bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl transition-all duration-300 font-sans ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-none' : 'w-full'
      } ${className}`}
    >
      {/* 🚀 TOP CONTROL CONSOLE (In-Page: Structured Header Panel; Fullscreen: Floating Glass HUD) */}
      <div
        className={
          isFullscreen
            ? 'absolute top-3 left-3 right-3 z-[1050] flex flex-col gap-2.5 pointer-events-none'
            : 'relative z-20 p-3 sm:p-4 bg-slate-950/95 border-b border-slate-800/90 flex flex-col gap-3 shrink-0'
        }
      >
        {/* Row 1: Header Brand, Vehicle Selector & Fullscreen Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-md pointer-events-auto">
          
          {/* Brand & Roaming Status */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                <span>Touralink Route & Adventure Studio</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                  OSM Live
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {routesData ? `${currentRoute?.distanceKm} km • ${currentRoute?.durationFormatted}` : 'Calculating routes...'}
              </div>
            </div>
          </div>

          {/* Vehicle Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {VEHICLE_OPTIONS.map((v) => {
              const Icon = v.icon;
              const isSelected = vehicleType === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setVehicleType(v.id);
                    setBotCallout(`Vehicle switched to ${v.label.split(' ')[1] || v.label}`);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={v.sublabel}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons: Layer style & Fullscreen */}
          <div className="flex items-center gap-1.5 pr-1">
            {/* Tile Layer Switcher */}
            <div className="relative group">
              <button
                type="button"
                className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Change Map Style"
              >
                <Layers className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col gap-1 p-2 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-xl w-44 z-50">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">Map Style</span>
                <button
                  onClick={() => setTileStyle('clean')}
                  className={`px-2 py-1.5 text-xs rounded-lg text-left font-medium ${tileStyle === 'clean' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  🗺️ Google Maps (Esri)
                </button>
                <button
                  onClick={() => setTileStyle('streets')}
                  className={`px-2 py-1.5 text-xs rounded-lg text-left font-medium ${tileStyle === 'streets' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  🛣️ OpenStreetMap Classic
                </button>
                <button
                  onClick={() => setTileStyle('topo')}
                  className={`px-2 py-1.5 text-xs rounded-lg text-left font-medium ${tileStyle === 'topo' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  ⛰️ Topo & Ghat Ridges
                </button>
                <button
                  onClick={() => setTileStyle('satellite')}
                  className={`px-2 py-1.5 text-xs rounded-lg text-left font-medium ${tileStyle === 'satellite' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  🛰️ Satellite Hybrid
                </button>
              </div>
            </div>

            {/* Audio Voice Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !isVoiceEnabled;
                setIsVoiceEnabled(next);
                if (next) speakBotCallout('Voice guidance enabled.');
              }}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800/90 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isVoiceEnabled ? 'Mute Rover Voice' : 'Enable Rover Voice Guidance'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                isFullscreen
                  ? 'bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5'
                  : 'bg-slate-800/90 hover:bg-brand-600 text-white border border-slate-700'
              }`}
              title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen Map (Google Maps Mode)'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="text-xs">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden md:inline">Google Maps Fullscreen</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Row 2: Location Entry (Destination First, then Start Location Prompt) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pointer-events-auto">
          
          {/* Box 1: DESTINATION (Where do you want to visit first?) */}
          <div className="relative p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>1. Where do you want to visit first?</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Destination First</span>
            </div>

            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => handleDestinationInput(e.target.value)}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="Search destination (e.g. North Goa, Mahabaleshwar)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              {isSearchingDest ? (
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin absolute right-3" />
              ) : destinationQuery ? (
                <button
                  type="button"
                  onClick={() => setDestinationQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Quick Destination Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {DESTINATION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSelectDestination(chip.dest, chip.coords)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Autocomplete Dropdown */}
            {showDestDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl p-1 z-50 max-h-48 overflow-y-auto">
                {destinationSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item.name, item.center)}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-brand-600 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Box 2: START LOCATION (Where are you starting from?) */}
          <div className="relative p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 shadow-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>2. Where are you starting from?</span>
              </span>

              {/* 1-Tap Use Device Location Button */}
              <button
                type="button"
                onClick={handleUseDeviceLocation}
                disabled={isLocatingUser}
                className="text-[10px] font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                title="Fetch live location from your phone / computer GPS"
              >
                {isLocatingUser ? (
                  <Loader2 className="w-3 h-3 animate-spin text-cyan-300" />
                ) : (
                  <Crosshair className="w-3 h-3 text-cyan-400" />
                )}
                <span>Use My Device Location</span>
              </button>
            </div>

            <div className="relative flex items-center gap-1.5">
              <div className="relative flex-1 flex items-center">
                <Navigation className="w-4 h-4 text-blue-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={originQuery}
                  onChange={(e) => handleOriginInput(e.target.value)}
                  onFocus={() => setShowOriginDropdown(true)}
                  placeholder="Enter starting city or landmark..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {isSearchingOrigin ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin absolute right-3" />
                ) : originQuery ? (
                  <button
                    type="button"
                    onClick={() => setOriginQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

              {/* Swap Origin & Destination Button */}
              <button
                type="button"
                onClick={handleSwapLocations}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
                title="Swap Start & Destination"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Origin Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {ORIGIN_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleSelectOrigin(chip.label, chip.coords)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Autocomplete Dropdown */}
            {showOriginDropdown && originSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl p-1 z-50 max-h-48 overflow-y-auto">
                {originSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectOrigin(item.name, item.center)}
                    className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-brand-600 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 🗺️ MAP CANVAS CONTAINER */}
      <div className={`relative w-full ${isFullscreen ? 'h-full absolute inset-0 z-0' : 'h-[580px] sm:h-[640px] flex-1'} bg-slate-950 overflow-hidden`}>
        <div
          ref={mapContainerRef}
          className="w-full h-full relative z-0"
        />

      {/* ⚡ / 🌿 BOTTOM FLOATING HUD: Route Toggle (Fastest vs Scenic) */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pointer-events-none">
        
        {/* Left Side: Route Mode Toggle Cards */}
        {routesData && (
          <div className="flex flex-col sm:flex-row gap-2 pointer-events-auto max-w-xl">
            
            {/* Card 1: Fastest Route */}
            <div
              onClick={() => {
                setActiveRouteType('fastest');
                setBotCallout('Selected Fastest Expressway Route! ⚡');
                if (onSelectRoute) onSelectRoute(routesData.fastest);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex-1 ${
                activeRouteType === 'fastest'
                  ? 'bg-blue-950/90 border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30 text-white'
                  : 'bg-slate-950/75 border-slate-800 text-slate-300 hover:bg-slate-900/90'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-blue-400" />
                  <span>Fastest Route</span>
                </span>
                {activeRouteType === 'fastest' && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-black">
                    Active
                  </span>
                )}
              </div>
              <div className="text-base font-black mt-0.5">
                {routesData.fastest?.durationFormatted}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {routesData.fastest?.distanceKm} km • Tolls {routesData.fastest?.tollEstimate}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {routesData.fastest?.highlights?.slice(0, 2).join(' • ')}
              </div>
            </div>

            {/* Card 2: Scenic & Enjoyable Route */}
            <div
              onClick={() => {
                setActiveRouteType('scenic');
                setBotCallout('Selected Scenic Sahyadri Ghats & Waterfalls! 🌿');
                if (onSelectRoute) onSelectRoute(routesData.scenic);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex-1 ${
                activeRouteType === 'scenic'
                  ? 'bg-emerald-950/90 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/30 text-white'
                  : 'bg-slate-950/75 border-slate-800 text-slate-300 hover:bg-slate-900/90'
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Mountain className="w-3 h-3 fill-emerald-400" />
                  <span>Scenic & Enjoyable</span>
                </span>
                {activeRouteType === 'scenic' && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black">
                    Active
                  </span>
                )}
              </div>
              <div className="text-base font-black mt-0.5">
                {routesData.scenic?.durationFormatted}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">
                {routesData.scenic?.distanceKm} km • ⭐ {routesData.scenic?.scenicRating} Scenic Score
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {routesData.scenic?.highlights?.slice(0, 2).join(' • ')}
              </div>
            </div>

          </div>
        )}

        {/* Right Side: Roaming Bot Controller Card */}
        <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 shadow-2xl pointer-events-auto flex flex-col gap-2 min-w-[280px]">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <div className="text-xs font-black text-white">Rover AI Scout</div>
                <div className="text-[10px] text-cyan-300 font-bold">{Math.round(roamProgress)}% Scouted</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBotChatOpen(!isBotChatOpen)}
              className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              <span>{isBotChatOpen ? 'Hide Chat' : 'Chat Copilot'}</span>
            </button>
          </div>

          {/* Current Bot Callout Pill */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 text-[11px] text-cyan-200 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="truncate">{botCallout}</span>
          </div>

          {/* Controls: Play/Pause, Reset, Speed */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const nextState = !isRoaming;
                  setIsRoaming(nextState);
                  if (nextState) speakBotCallout('Scouting driving route and detecting highway attractions.');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  isRoaming
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30'
                }`}
              >
                {isRoaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                <span>{isRoaming ? 'Pause Scout' : 'Roam Route'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoamProgress(0);
                  setIsRoaming(false);
                  setBotCallout('Reset Rover to starting point.');
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Reset to Start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-900 px-1 py-0.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Speed:</span>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRoamSpeed(s)}
                  className={`px-1.5 py-0.5 rounded ${roamSpeed === s ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 🧭 CATEGORY FILTER PILLS ON BOTTOM-CENTER */}
      <div className="absolute bottom-28 sm:bottom-24 left-3 right-3 z-[995] flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto pb-1">
        {POI_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setBotCallout(`Filtered map for ${cat.label}!`);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-slate-950 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400'
                  : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-700 backdrop-blur-md'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 💬 FLOATING ROVER AI COPILOT CHAT DRAWER */}
      {isBotChatOpen && (
        <div className="absolute top-28 sm:top-24 right-3 z-[1050] w-80 sm:w-96 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl flex flex-col max-h-[460px] overflow-hidden transition-all animate-in fade-in slide-in-from-right-4">
          
          {/* Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1">
                  <span>Rover AI Route Copilot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">Ask anything about route, stops, temples & hotels</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBotChatOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 border-b border-slate-800/80 bg-slate-900/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSendMessage('Suggest the scenic route with waterfalls')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 shrink-0"
            >
              🌿 Scenic Route & Waterfalls
            </button>
            <button
              onClick={() => handleSendMessage('Where should I charge my EV?')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 shrink-0"
            >
              ⚡ EV Fast Chargers
            </button>
            <button
              onClick={() => handleSendMessage('Show top temples and forts')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 shrink-0"
            >
              🛕 Temples & Forts
            </button>
            <button
              onClick={() => handleSendMessage('Best luxury hotels for overnight stay')}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shrink-0"
            >
              🏨 Hotels & Resorts
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-3 space-y-2.5 overflow-y-auto flex-1 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white font-medium rounded-tr-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isBotThinking && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Rover is scouting recommendations...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask Rover: fastest vs scenic, hotels, temples..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* 📍 DETAILED POI INSPECTION MODAL */}
      {selectedPoiModal && (
        <div className="absolute inset-0 z-[1100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Photo Header */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={selectedPoiModal.image}
                alt={selectedPoiModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedPoiModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-cyan-300 border border-cyan-400/40 backdrop-blur-md">
                    {selectedPoiModal.categoryLabel || selectedPoiModal.category}
                  </span>
                  <h3 className="text-lg font-black text-white mt-1 drop-shadow-md">
                    {selectedPoiModal.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedPoiModal.rating}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">{selectedPoiModal.reviewsCount} reviews</div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-medium pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-white">{selectedPoiModal.detourTime}</span>
                  <span>({selectedPoiModal.detourKm} off highway)</span>
                </div>
                <div className="text-emerald-400 font-bold">
                  {selectedPoiModal.price || 'Verified Stop'}
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed font-medium">
                {selectedPoiModal.description}
              </p>

              {/* Highlights */}
              {selectedPoiModal.highlights?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Highlights & Amenities:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedPoiModal.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-200 text-[11px]">
                        <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddedStops((prev) => [...prev, selectedPoiModal]);
                    if (onAddStopToItinerary) onAddStopToItinerary(selectedPoiModal);
                    setBotCallout(`Added ${selectedPoiModal.name} to itinerary stops!`);
                    setSelectedPoiModal(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Stop to Route Itinerary</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.open(selectedPoiModal.googleMapsUrl, '_blank')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* End Map Canvas Container */}
      </div>

    </div>
  );
}
