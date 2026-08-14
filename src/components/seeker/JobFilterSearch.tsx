import React, { useState, useMemo, useEffect } from 'react';
import { Job, CandidateProfile } from '../../types';
import { JobCard } from '../common/JobCard';
import {
  INDIAN_LOCATIONS_DATABASE,
  LocationNode,
  calculateDistanceKm,
  reverseGeocodeNearest,
  searchLocations,
} from '../../data/locationData';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  X,
  Flame,
  Zap,
  CheckCircle2,
  Briefcase,
  DollarSign,
  UserCheck,
  Building2,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Navigation,
  Loader2,
  AlertCircle,
  MapPinned,
} from 'lucide-react';

interface JobFilterSearchProps {
  jobs: Job[];
  candidateProfile: CandidateProfile;
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
  initialCategory?: string;
  initialQuery?: string;
  initialLocation?: string;
}

const CATEGORIES = [
  'All',
  'Delivery',
  'Warehouse',
  'Sales',
  'Retail',
  'Customer Support',
  'Security',
  'Housekeeping',
  'Hospitality',
  'Driver',
  'Manufacturing',
  'Office Support',
  'Data Entry',
  'IT & Software',
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

export const JobFilterSearch: React.FC<JobFilterSearchProps> = ({
  jobs,
  candidateProfile,
  savedJobIds,
  onSelectJob,
  onApplyJob,
  onToggleSaveJob,
  initialCategory = 'All',
  initialQuery = '',
  initialLocation = '',
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [selectedLocationNode, setSelectedLocationNode] = useState<LocationNode | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [maxExpFilter, setMaxExpFilter] = useState<number>(10);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // Quick Toggles
  const [onlyQuickHire, setOnlyQuickHire] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyImmediate, setOnlyImmediate] = useState<boolean>(false);
  const [onlyWalkIn, setOnlyWalkIn] = useState<boolean>(false);

  // GPS Location State
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLocalityName, setGpsLocalityName] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sort & Drawer
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'newest' | 'distance'>('match');
  const [showAdvancedDrawer, setShowAdvancedDrawer] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Location suggestions list
  const locationSuggestions = useMemo(() => {
    return searchLocations(locationInput, 8);
  }, [locationInput]);

  // Handle GPS location click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ lat: latitude, lng: longitude });
        const nearest = reverseGeocodeNearest(latitude, longitude);
        setSelectedLocationNode(nearest);
        setLocationInput(`${nearest.name}, ${nearest.city || nearest.district}`);
        setGpsLocalityName(nearest.name);
        setIsLocating(false);
        setSortBy('distance');
        showToast(`📍 Located near ${nearest.name} (${nearest.district})`);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Could not access GPS. Using default location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please search your city or village manually.';
        }
        setGeoError(msg);
        showToast(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationInput('');
    setSelectedLocationNode(null);
    setGpsCoordinates(null);
    setGpsLocalityName(null);
    setSelectedCategory('All');
    setSelectedJobType('All');
    setSelectedWorkMode('All');
    setMinSalaryFilter(0);
    setMaxExpFilter(10);
    setSearchRadiusKm(25);
    setOnlyQuickHire(false);
    setOnlyVerified(false);
    setOnlyImmediate(false);
    setOnlyWalkIn(false);
    setSortBy('match');
    showToast('Filters reset to default.');
  };

  // Quick Preset Handlers
  const handleApplyPreset = (preset: string) => {
    handleResetFilters();
    if (preset === 'freshers') {
      setMaxExpFilter(0);
      showToast('Applied Fresher (0 Yrs) Filter');
    } else if (preset === 'quickhire') {
      setOnlyQuickHire(true);
      showToast('Showing 🔥 QuickHire Urgent Jobs');
    } else if (preset === 'highsalary') {
      setMinSalaryFilter(30000);
      showToast('Showing High Salary Jobs (Min ₹30,000)');
    } else if (preset === 'wfh') {
      setSelectedWorkMode('Work From Home');
      showToast('Showing Work From Home Jobs');
    } else if (preset === 'walkin') {
      setOnlyWalkIn(true);
      showToast('Showing Walk-in Interview Drives');
    }
  };

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // 1. Keyword search (Title, Skills, Company, Category, Description, Industry)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = j.title.toLowerCase().includes(q);
        const matchesCompany = j.companyName.toLowerCase().includes(q);
        const matchesCategory = j.category.toLowerCase().includes(q);
        const matchesSkills = j.skillsRequired.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = j.description ? j.description.toLowerCase().includes(q) : false;
        const matchesLocation = j.location.toLowerCase().includes(q);

        if (!matchesTitle && !matchesCompany && !matchesCategory && !matchesSkills && !matchesDesc && !matchesLocation) {
          return false;
        }
      }

      // 2. Location & Radius Filter
      if (gpsCoordinates) {
        // Compute distance from GPS
        const jobLat = j.coordinates?.lat ?? 19.1136;
        const jobLng = j.coordinates?.lng ?? 72.8697;
        const dist = calculateDistanceKm(gpsCoordinates.lat, gpsCoordinates.lng, jobLat, jobLng);
        if (dist > searchRadiusKm) {
          return false;
        }
      } else if (selectedLocationNode) {
        const jobLat = j.coordinates?.lat ?? 19.1136;
        const jobLng = j.coordinates?.lng ?? 72.8697;
        const dist = calculateDistanceKm(selectedLocationNode.lat, selectedLocationNode.lng, jobLat, jobLng);
        if (dist > searchRadiusKm) {
          return false;
        }
      } else if (locationInput.trim()) {
        const locLower = locationInput.toLowerCase().trim();
        const matchesJobLoc = j.location.toLowerCase().includes(locLower);
        if (!matchesJobLoc) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'All' && j.category !== selectedCategory) {
        return false;
      }

      // 4. Job Type Filter
      if (selectedJobType !== 'All' && j.jobType !== selectedJobType) {
        return false;
      }

      // 5. Work Mode Filter
      if (selectedWorkMode !== 'All' && j.workMode !== selectedWorkMode) {
        return false;
      }

      // 6. Min Salary Filter
      if (minSalaryFilter > 0 && j.maxSalary < minSalaryFilter) {
        return false;
      }

      // 7. Max Experience Filter
      if (maxExpFilter < 10 && j.minExperience > maxExpFilter) {
        return false;
      }

      // 8. Toggles
      if (onlyQuickHire && !j.isUrgent) return false;
      if (onlyVerified && !j.isVerifiedEmployer) return false;
      if (onlyImmediate && j.joiningDate !== 'Immediate') return false;
      if (onlyWalkIn && !j.isWalkIn) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'salary') return b.maxSalary - a.maxSalary;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'distance') {
        const centerLat = gpsCoordinates?.lat || selectedLocationNode?.lat || 19.1136;
        const centerLng = gpsCoordinates?.lng || selectedLocationNode?.lng || 72.8697;
        const distA = calculateDistanceKm(centerLat, centerLng, a.coordinates?.lat || 19.11, a.coordinates?.lng || 72.86);
        const distB = calculateDistanceKm(centerLat, centerLng, b.coordinates?.lat || 19.11, b.coordinates?.lng || 72.86);
        return distA - distB;
      }
      return 0;
    });
  }, [
    jobs,
    searchQuery,
    locationInput,
    selectedLocationNode,
    gpsCoordinates,
    searchRadiusKm,
    selectedCategory,
    selectedJobType,
    selectedWorkMode,
    minSalaryFilter,
    maxExpFilter,
    onlyQuickHire,
    onlyVerified,
    onlyImmediate,
    onlyWalkIn,
    sortBy,
  ]);

  // Active filters count
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (locationInput || selectedLocationNode || gpsCoordinates ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedJobType !== 'All' ? 1 : 0) +
    (selectedWorkMode !== 'All' ? 1 : 0) +
    (minSalaryFilter > 0 ? 1 : 0) +
    (maxExpFilter < 10 ? 1 : 0) +
    (onlyQuickHire ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (onlyImmediate ? 1 : 0) +
    (onlyWalkIn ? 1 : 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-teal-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Search Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-900">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Search className="w-3.5 h-3.5 text-teal-400" /> Pan-India Verified Employment Search
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Find Verified Jobs <span className="text-teal-400">Near Your Village, Town or City</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Search 1,000+ active job openings across India with precise GPS radius & instant HireMatch scoring.
          </p>

          {/* Search Inputs Bar */}
          <div className="bg-white rounded-2xl p-2.5 shadow-2xl text-slate-900 flex flex-col md:flex-row gap-2 mt-4 border border-slate-200">
            {/* 1. Keyword search input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-teal-700 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, skills, category or employer (e.g. Delivery, Warehouse, Sales)..."
                className="w-full text-xs outline-none bg-transparent font-medium text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. Two-Level Location Input with Suggestions */}
            <div className="relative md:w-72">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setSelectedLocationNode(null);
                    setGpsCoordinates(null);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="City, area, village or pincode..."
                  className="w-full text-xs outline-none bg-transparent font-bold text-slate-900 placeholder-slate-400"
                />
                {locationInput && (
                  <button
                    onClick={() => {
                      setLocationInput('');
                      setSelectedLocationNode(null);
                      setGpsCoordinates(null);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showLocationDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 max-h-64 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-1.5 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Popular Cities & Villages in India</span>
                    <button
                      onClick={() => setShowLocationDropdown(false)}
                      className="text-teal-700 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  {locationSuggestions.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => {
                        setSelectedLocationNode(node);
                        setLocationInput(`${node.name}, ${node.city || node.district}`);
                        setShowLocationDropdown(false);
                        showToast(`Selected location: ${node.name}`);
                      }}
                      className="w-full text-left p-2 hover:bg-teal-50 rounded-xl flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">{node.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {node.district}, {node.state} {node.pincode ? `• ${node.pincode}` : ''}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {node.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. GPS Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-teal-200 transition-all shrink-0"
              title="Locate nearest jobs via GPS"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-teal-700" />
              )}
              <span>{isLocating ? 'Locating...' : 'GPS Near Me'}</span>
            </button>

            {/* 4. Filter Drawer Toggle */}
            <button
              onClick={() => setShowAdvancedDrawer(!showAdvancedDrawer)}
              className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>

          {/* Radius Selector (when location is active) */}
          {(gpsCoordinates || selectedLocationNode || locationInput) && (
            <div className="flex items-center gap-2 pt-2 text-xs flex-wrap">
              <span className="text-teal-200 font-bold flex items-center gap-1">
                <MapPinned className="w-3.5 h-3.5 text-teal-300" /> Search Radius:
              </span>
              {RADIUS_OPTIONS.map((radius) => (
                <button
                  key={radius}
                  onClick={() => {
                    setSearchRadiusKm(radius);
                    showToast(`Search radius set to ${radius} km`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    searchRadiusKm === radius
                      ? 'bg-teal-400 text-slate-950 shadow-xs'
                      : 'bg-white/10 text-teal-100 hover:bg-white/20'
                  }`}
                >
                  Within {radius} km
                </button>
              ))}
              <span className="text-[11px] text-teal-200/80">
                ({filteredJobs.length} jobs matched)
              </span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 text-xs">
            <span className="text-[11px] font-bold text-teal-300/80 shrink-0">Quick Presets:</span>
            <button
              onClick={() => handleApplyPreset('freshers')}
              className="px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors shrink-0"
            >
              👶 Freshers (0 Yrs)
            </button>
            <button
              onClick={() => handleApplyPreset('quickhire')}
              className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-400" /> 🔥 QuickHire Urgent
            </button>
            <button
              onClick={() => handleApplyPreset('highsalary')}
              className="px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 text-[11px] font-bold transition-colors shrink-0"
            >
              💰 Min ₹30,000/mo
            </button>
            <button
              onClick={() => handleApplyPreset('wfh')}
              className="px-3 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-[11px] font-semibold transition-colors shrink-0"
            >
              🏠 Work From Home
            </button>
            <button
              onClick={() => handleApplyPreset('walkin')}
              className="px-3 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 text-[11px] font-semibold transition-colors shrink-0"
            >
              🏢 Walk-in Interviews
            </button>
          </div>
        </div>
      </div>

      {/* Category Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              showToast(`Category: ${cat}`);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Advanced Filter Panel Drawer */}
      {showAdvancedDrawer && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-5 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-600" /> Advanced Filter Controls
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Job Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none text-slate-800"
              >
                <option value="All">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Gig">Gig / Contract</option>
                <option value="Walk-In">Walk-In Drive</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none text-slate-800"
              >
                <option value="All">All Work Modes</option>
                <option value="On-Site">On-Site (Field/Office/Hub)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>

            {/* Min Salary Range */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Min Monthly Salary: ₹{minSalaryFilter.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="0"
                max="60000"
                step="5000"
                value={minSalaryFilter}
                onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>₹0</span>
                <span>₹30,000</span>
                <span>₹60,000+</span>
              </div>
            </div>

            {/* Max Experience */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Max Required Experience: {maxExpFilter === 10 ? 'Any' : `${maxExpFilter} Yrs`}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={maxExpFilter}
                onChange={(e) => setMaxExpFilter(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>0 Yrs (Freshers)</span>
                <span>5 Yrs</span>
                <span>10+ Yrs</span>
              </div>
            </div>
          </div>

          {/* Boolean Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyQuickHire}
                onChange={(e) => setOnlyQuickHire(e.target.checked)}
                className="rounded text-teal-600 accent-teal-600 w-4 h-4"
              />
              <span>🔥 QuickHire Urgent</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-teal-600 accent-teal-600 w-4 h-4"
              />
              <span>✓ Verified Employers Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyImmediate}
                onChange={(e) => setOnlyImmediate(e.target.checked)}
                className="rounded text-teal-600 accent-teal-600 w-4 h-4"
              />
              <span>⚡ Immediate Joining</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 transition-colors">
              <input
                type="checkbox"
                checked={onlyWalkIn}
                onChange={(e) => setOnlyWalkIn(e.target.checked)}
                className="rounded text-teal-600 accent-teal-600 w-4 h-4"
              />
              <span>🚶 Walk-In Drives</span>
            </label>
          </div>
        </div>
      )}

      {/* Results Header with Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            Available Job Postings ({filteredJobs.length})
          </h2>
          <p className="text-xs text-slate-500">
            Showing verified opportunities matching your search criteria
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer shadow-xs"
          >
            <option value="match">Best HireMatch Score</option>
            <option value="salary">Highest Salary</option>
            <option value="newest">Recently Posted</option>
            <option value="distance">Nearest Distance (GPS)</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid / Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">No jobs found matching your criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any job postings matching your current location or filter combination.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchRadiusKm(100);
                showToast('Radius increased to 100 km');
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Increase Search Radius (100 km)
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Clear All Filters & Search Pan-India
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateProfile={candidateProfile}
              isSaved={savedJobIds.includes(job.id)}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              onToggleSave={onToggleSaveJob}
            />
          ))}
        </div>
      )}
    </div>
  );
};
