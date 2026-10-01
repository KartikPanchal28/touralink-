import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X, Trash2 } from 'lucide-react';
import { searchPlaces, getPresetCoords } from '../../services/osmService';

/**
 * Reusable OpenStreetMap-powered location search input with real-time autocomplete suggestions
 */
export default function LocationAutocompleteInput({
  label,
  pointBadge = 'A',
  pointBadgeColor = 'bg-brand-600',
  subLabel,
  subLabelColor = 'text-brand-700',
  pinColor = 'text-brand-600',
  focusRingColor = 'focus:ring-brand-500 focus:border-brand-500',
  value,
  placeholder,
  onChange,
  onSelectCoords,
  chips = [],
  onRemove,
  activeChipClass = 'bg-brand-50 text-brand-700 border-brand-300 font-bold'
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Synchronize internal state when value prop changes externally (e.g. preset chips)
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search with Mapbox
  useEffect(() => {
    if (!isOpen || !query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchPlaces(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Failed to search locations:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (item) => {
    setQuery(item.name);
    setIsOpen(false);
    setSuggestions([]);
    if (onChange) onChange(item.name);
    if (onSelectCoords) onSelectCoords(item.center);
  };

  const handleChipClick = (chipText) => {
    setQuery(chipText);
    setIsOpen(false);
    if (onChange) onChange(chipText);
    const coords = getPresetCoords(chipText);
    if (coords && onSelectCoords) {
      onSelectCoords(coords);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onChange) onChange('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="space-y-1.5 relative">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full ${pointBadgeColor} text-white flex items-center justify-center text-[10px] font-black shrink-0`}>
            {pointBadge}
          </span>
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {subLabel && (
            <span className={`text-[11px] font-bold ${subLabelColor}`}>
              {subLabel}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Input Field with Pin & Status */}
      <div className="relative">
        <MapPin className={`w-4 h-4 ${pinColor} absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none`} />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 ${focusRingColor} transition-all shadow-xs`}
        />

        {/* Clear or Loading Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>

        {/* Floating Autocomplete Dropdown */}
        {isOpen && (suggestions.length > 0 || isLoading) && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
            {isLoading && suggestions.length === 0 ? (
              <div className="px-4 py-3 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                <span>Searching places via Mapbox...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/80 flex items-center justify-between">
                  <span>Suggested Locations</span>
                  <span className="text-[9px] text-brand-600 font-extrabold">Mapbox Live</span>
                </div>

                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-brand-50/70 transition-colors flex items-start gap-2.5 cursor-pointer group"
                  >
                    <MapPin className={`w-3.5 h-3.5 mt-0.5 ${pinColor} shrink-0 group-hover:scale-110 transition-transform`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-slate-900 group-hover:text-brand-900 truncate">
                        {item.text}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-medium">
                        {item.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset Quick Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {chips.map((chip) => {
            const isSelected = query.toLowerCase().includes(chip.toLowerCase());
            return (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? activeChipClass
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
