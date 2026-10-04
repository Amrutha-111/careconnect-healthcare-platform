import React, { useState, useMemo } from 'react';
import { useApp, LOCATION_PRESETS } from '../context/AppContext';
import { FacilityCard } from './FacilityCard';
import { InteractiveMapPlaceholder } from './InteractiveMapPlaceholder';
import {
  Search,
  MapPin,
  Compass,
  Sparkles,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  Map,
  Clock,
  Calendar,
  Ticket,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';

export const DiscoveryHome: React.FC = () => {
  const {
    facilities,
    departments,
    doctors,
    filters,
    setFilters,
    resetFilters,
    userLocation,
    setUserLocation,
    useCurrentDeviceLocation,
    calculateDistance,
    setCurrentView,
    setIsAIAssistantOpen,
    setInitialAIPrompt
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Standard departments for quick pills
  const quickDepts = [
    'All',
    'Dermatology',
    'Cardiology',
    'Pediatrics',
    'General Medicine',
    'Orthopedics',
    'Dental',
    'ENT',
    'Neurology'
  ];

  // Filter facilities based on user inputs
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const q = filters.query.toLowerCase().trim();

      // Search matching across: hospital name, clinic name, doctor, department, specialization, area
      const matchesName = fac.name.toLowerCase().includes(q);
      const matchesArea = fac.area.toLowerCase().includes(q) || fac.address.toLowerCase().includes(q);
      const matchesDept = fac.available_departments.some((d) => d.toLowerCase().includes(q));

      // Match doctors at this facility
      const facDocs = doctors.filter((doc) => doc.facility_id === fac.id);
      const matchesDoctor = facDocs.some(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q)
      );

      const matchesQuery = !q || matchesName || matchesArea || matchesDept || matchesDoctor;

      // Department dropdown / pill filter
      const matchesSelectedDept =
        !filters.department ||
        filters.department === 'All' ||
        fac.available_departments.some(
          (d) => d.toLowerCase() === filters.department.toLowerCase()
        );

      // Distance filter
      const dist = calculateDistance(fac.latitude, fac.longitude);
      const matchesDistance = dist <= filters.maxDistance;

      // Boolean toggles
      const matchesOpen = !filters.openNowOnly || fac.status === 'open';
      const matchesEmergency = !filters.emergencyOnly || fac.is_emergency;

      return (
        matchesQuery &&
        matchesSelectedDept &&
        matchesDistance &&
        matchesOpen &&
        matchesEmergency
      );
    }).sort((a, b) => {
      if (filters.sortBy === 'distance') {
        const distA = calculateDistance(a.latitude, a.longitude);
        const distB = calculateDistance(b.latitude, b.longitude);
        return distA - distB;
      }
      if (filters.sortBy === 'shortest_wait') {
        const deptsA = departments.filter((d) => d.facility_id === a.id);
        const deptsB = departments.filter((d) => d.facility_id === b.id);
        const waitA = deptsA.length > 0 ? deptsA[0].estimated_wait_minutes : 99;
        const waitB = deptsB.length > 0 ? deptsB[0].estimated_wait_minutes : 99;
        return waitA - waitB;
      }
      return 0;
    });
  }, [facilities, filters, doctors, departments, calculateDistance]);

  return (
    <div className="space-y-8">
      
      {/* Hero Search & Discovery Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Zero Wasted Waiting • Verified Schedules</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Find Healthcare Near You.
            <span className="block bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Know Wait Times Before You Go.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Real-time queue tokens, live doctor schedules, and transparent patient reviews across local hospitals and clinics.
          </p>

          {/* Location & Search Bar */}
          <div className="pt-2 space-y-3">
            
            {/* Location Selector Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Your Location:</span>
              </span>

              <select
                value={userLocation.name}
                onChange={(e) => {
                  const found = LOCATION_PRESETS.find((p) => p.name === e.target.value);
                  if (found) setUserLocation(found);
                }}
                className="bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {LOCATION_PRESETS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={useCurrentDeviceLocation}
                className="px-3 py-1.5 rounded-xl bg-teal-600/40 hover:bg-teal-600 text-teal-200 hover:text-white border border-teal-500/30 transition-all font-semibold flex items-center space-x-1 cursor-pointer"
                title="Detect GPS location"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Use My GPS</span>
              </button>
            </div>

            {/* Main Unified Search Input */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center space-x-3 px-3 w-full sm:flex-1">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search hospital, clinic, doctor, department, or area (e.g. Dermatology)..."
                  value={filters.query}
                  onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                  className="w-full text-slate-900 text-xs sm:text-sm py-2 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto px-2 pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    showAdvancedFilters
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInitialAIPrompt(filters.query ? `Find options for ${filters.query}` : '');
                    setIsAIAssistantOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md shadow-teal-600/30 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* Quick Department Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 py-1 mr-1">Quick Select:</span>
              {quickDepts.map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      department: d === 'All' ? '' : d
                    }))
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    (d === 'All' && !filters.department) || filters.department === d
                      ? 'bg-teal-400 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* AI Callout Banner in Hero */}
        <div className="mt-8 bg-teal-900/50 backdrop-blur-md rounded-2xl p-4 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 text-teal-200">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
            <span>
              Unsure which clinic fits your needs? Use <strong>CareConnect AI</strong> to compare facilities by wait times, schedules, and verified patient feedback.
            </span>
          </div>
          <button
            onClick={() => {
              setInitialAIPrompt('');
              setIsAIAssistantOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-md transition-transform hover:scale-105"
          >
            Launch AI Assistant
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvancedFilters && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-in fade-in space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center space-x-1.5 text-sm">
              <Filter className="w-4 h-4 text-teal-600" />
              <span>Advanced Discovery Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-400 hover:text-teal-600"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Max Distance Slider */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Maximum Distance</span>
                <span className="text-teal-700">{filters.maxDistance} km</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={filters.maxDistance}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxDistance: Number(e.target.value) }))
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sort Results By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                }
                className="w-full p-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="distance">Nearest Distance</option>
                <option value="shortest_wait">Shortest Estimated Wait (Low-Wait Discovery)</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1 sm:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.openNowOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, openNowOnly: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Open Now Only</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.emergencyOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, emergencyOnly: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>24/7 Trauma Emergency Only</span>
              </label>
            </div>

          </div>
        </div>
      )}

      {/* Discovery Results Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Nearby Healthcare Facilities
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Found <strong>{filteredFacilities.length}</strong> facilities near {userLocation.name}
          </p>
        </div>

        {/* View Switcher: Cards vs Map */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Facility Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Main Results View */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMapPlaceholder
            facilities={filteredFacilities}
            height="h-[550px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.slice(0, 3).map((fac) => (
              <FacilityCard key={fac.id} facility={fac} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {filteredFacilities.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Facilities Match Your Criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your search distance or clearing the department filter.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
