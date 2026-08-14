import React, { useState, useMemo } from 'react';
import { Job, CandidateProfile } from '../../types';
import { JobCard } from '../common/JobCard';
import {
  Navigation,
  MapPin,
  SlidersHorizontal,
  Crosshair,
  Map as MapIcon,
  ListFilter,
  Layers,
  Bike,
  Footprints,
  Bus,
  Search,
  Sparkles,
  ArrowUpDown,
  Compass,
  Building2,
  CheckCircle2,
  Flame,
} from 'lucide-react';

interface NearbyJobsViewProps {
  jobs: Job[];
  candidateProfile: CandidateProfile;
  savedJobIds: string[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob: (jobId: string) => void;
}

const POPULAR_LOCATIONS = [
  'Andheri East, Mumbai',
  'Lower Parel, Mumbai',
  'Powai, Mumbai',
  'Thane West, Thane',
  'Bandra West, Mumbai',
  'Connaught Place, New Delhi',
  'Koramangala, Bangalore',
  'HSR Layout, Bangalore',
  'Cyber City, Gurgaon',
  'Aroli, Navi Mumbai',
];

export const NearbyJobsView: React.FC<NearbyJobsViewProps> = ({
  jobs,
  candidateProfile,
  savedJobIds,
  onSelectJob,
  onApplyJob,
  onToggleSaveJob,
}) => {
  const [distanceKm, setDistanceKm] = useState<number>(10);
  const [userLocation, setUserLocation] = useState<string>(candidateProfile.location || 'Andheri East, Mumbai');
  const [usingGeo, setUsingGeo] = useState<boolean>(false);
  const [selectedMapJob, setSelectedMapJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [commuteFilter, setCommuteFilter] = useState<'all' | 'walk' | 'bike' | 'transit'>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'match' | 'salary' | 'urgent'>('distance');
  const [customLocationSearch, setCustomLocationSearch] = useState('');

  const [geoError, setGeoError] = useState<string | null>(null);

  const handleUseBrowserGeo = () => {
    setGeoError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation(`GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`);
          setUsingGeo(true);
        },
        () => {
          setGeoError('Geolocation permission denied or unavailable. Using default location: Andheri East, Mumbai');
          setTimeout(() => setGeoError(null), 5000);
        }
      );
    } else {
      setGeoError('Geolocation is not supported by your browser.');
      setTimeout(() => setGeoError(null), 5000);
    }
  };

  // Filter & Sort Jobs
  const filteredJobs = useMemo(() => {
    let list = jobs.filter((j) => {
      const dist = j.distanceKm ?? 8;
      if (dist > distanceKm) return false;

      // Commute Filter
      if (commuteFilter === 'walk' && dist > 2) return false;
      if (commuteFilter === 'bike' && dist > 7) return false;
      if (commuteFilter === 'transit' && dist > 15) return false;

      // Search location match if typed
      if (customLocationSearch.trim()) {
        const search = customLocationSearch.toLowerCase();
        return (
          j.location.toLowerCase().includes(search) ||
          j.title.toLowerCase().includes(search) ||
          j.companyName.toLowerCase().includes(search)
        );
      }

      return true;
    });

    // Sort
    return list.sort((a, b) => {
      const distA = a.distanceKm ?? 10;
      const distB = b.distanceKm ?? 10;

      if (sortBy === 'distance') return distA - distB;
      if (sortBy === 'salary') return b.maxSalary - a.maxSalary;
      if (sortBy === 'urgent') return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
      return distA - distB;
    });
  }, [jobs, distanceKm, commuteFilter, customLocationSearch, sortBy]);

  // Estimate Commute Time Helper
  const getCommuteTime = (distance: number) => {
    if (distance <= 1.5) {
      return { text: `${Math.round(distance * 12)} min Walk`, icon: <Footprints className="w-3 h-3 text-emerald-600" /> };
    } else if (distance <= 8) {
      return { text: `${Math.round(distance * 3.5)} min Bike`, icon: <Bike className="w-3 h-3 text-teal-600" /> };
    } else {
      return { text: `${Math.round(distance * 2.5 + 5)} min Bus/Metro`, icon: <Bus className="w-3 h-3 text-indigo-600" /> };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Location Setup */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-teal-500/30 border border-teal-400/40 text-teal-300 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-teal-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">Hyperlocal Nearby Jobs</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Discover verified vacancies close to your home. Reduce commute time, save transportation costs, and start working immediately!
            </p>

            {/* Current Active Location Pill */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs text-slate-400 font-semibold">Active Location:</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>{userLocation}</span>
              </div>
              {usingGeo && (
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> GPS Live
                </span>
              )}
            </div>
            {geoError && (
              <p className="text-xs text-amber-300 bg-amber-950/60 border border-amber-500/40 rounded-xl p-2 mt-2">
                ⚠️ {geoError}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleUseBrowserGeo}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Crosshair className="w-4 h-4" />
              {usingGeo ? 'Refresh GPS Location' : 'Detect My Location'}
            </button>

            {/* Location Selector Dropdown */}
            <div className="relative">
              <select
                value={userLocation}
                onChange={(e) => {
                  setUserLocation(e.target.value);
                  setUsingGeo(false);
                }}
                className="w-full sm:w-48 px-3 py-2.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-medium rounded-2xl text-xs outline-none cursor-pointer"
              >
                <option disabled>-- Popular Localities --</option>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-2xs">
        {/* Search & Mode Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Quick Locality Search Input */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={customLocationSearch}
              onChange={(e) => setCustomLocationSearch(e.target.value)}
              placeholder="Search specific locality, street name or role (e.g., Lower Parel, Delivery)..."
              className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {customLocationSearch && (
              <button
                onClick={() => setCustomLocationSearch('')}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Grid List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Full Map</span>
            </button>
          </div>
        </div>

        {/* Distance Range & Commute Badges */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Distance Slider & Preset Chips */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600" /> Distance Radius:
                <span className="text-teal-700 dark:text-teal-400 font-extrabold bg-teal-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-teal-200 dark:border-slate-700">
                  Within {distanceKm} km
                </span>
              </span>
              <span className="text-slate-400 text-[11px] font-medium">{filteredJobs.length} Jobs Found</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
              {[1, 2, 5, 10, 15, 25].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setDistanceKm(dist)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all shrink-0 ${
                    distanceKm === dist
                      ? 'bg-teal-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {dist} km
                </button>
              ))}
            </div>
          </div>

          {/* Commute Mode & Sorting */}
          <div className="md:col-span-5 flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs">
            {/* Commute Quick Filter */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Commute Type</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setCommuteFilter('all')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    commuteFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                      : 'text-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setCommuteFilter('walk')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                    commuteFilter === 'walk'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                      : 'text-slate-500'
                  }`}
                  title="Under 2 km (Walking distance)"
                >
                  <Footprints className="w-3 h-3" /> Walk
                </button>
                <button
                  onClick={() => setCommuteFilter('bike')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                    commuteFilter === 'bike'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-2xs'
                      : 'text-slate-500'
                  }`}
                  title="Under 7 km (Short bike commute)"
                >
                  <Bike className="w-3 h-3" /> Bike
                </button>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-none text-[11px]"
              >
                <option value="distance">📍 Distance (Closest First)</option>
                <option value="salary">💰 Highest Salary</option>
                <option value="urgent">🔥 QuickHire Urgent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Map / Grid / Split) */}
      <div className="space-y-6">
        {/* Interactive Simulated Radar / Map View */}
        {(viewMode === 'map' || viewMode === 'split') && (
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white relative overflow-hidden shadow-xl min-h-[320px] flex flex-col justify-between">
            {/* Map Background Grid Simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Simulated Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border border-teal-500/20 rounded-full animate-ping opacity-25"></div>
              <div className="w-96 h-96 border border-teal-500/10 rounded-full"></div>
            </div>

            {/* Top Bar of Map */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="font-bold text-slate-200">Interactive Hyperlocal Map Radar</span>
                <span className="text-[10px] text-slate-400">({filteredJobs.length} active pins)</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Urgent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block"></span> Verified
                </span>
              </div>
            </div>

            {/* Map Canvas with Clickable Pins */}
            <div className="relative z-10 my-8 min-h-[220px] flex items-center justify-center">
              {/* User Center Location */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center group cursor-pointer z-20">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-teal-500/30 border-2 border-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/50 animate-bounce">
                    <MapPin className="w-6 h-6 text-teal-300 fill-teal-400" />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-teal-300 font-extrabold px-2 py-0.5 rounded-md border border-teal-500/40 whitespace-nowrap">
                    YOU ARE HERE ({userLocation.split(',')[0]})
                  </span>
                </div>
              </div>

              {/* Render Nearby Job Pins Positioned in Orbit */}
              {filteredJobs.map((job, idx) => {
                const dist = job.distanceKm ?? 5;
                // Calculate pseudo polar coordinates around center
                const angle = (idx * (360 / Math.max(filteredJobs.length, 1)) + 45) * (Math.PI / 180);
                const radius = Math.min(dist * 18 + 45, 140); // Pixel orbit offset
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                const isSelected = selectedMapJob?.id === job.id;

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedMapJob(job)}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 z-10 ${
                      isSelected ? 'scale-125 z-30' : ''
                    }`}
                  >
                    <div className="group relative">
                      <div
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-md border ${
                          job.isUrgent
                            ? 'bg-amber-500 text-slate-950 border-amber-300'
                            : 'bg-teal-600 text-white border-teal-400'
                        }`}
                      >
                        <span>{job.companyLogo}</span>
                        <span className="max-w-[80px] truncate">{job.title.split(' ')[0]}</span>
                        <span className="bg-black/30 px-1.5 py-0.2 rounded text-[9px] font-mono">
                          {dist}km
                        </span>
                      </div>

                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-48 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-700 shadow-xl z-50 text-left">
                        <p className="font-bold text-xs truncate">{job.title}</p>
                        <p className="text-[10px] text-teal-400 font-medium">{job.companyName}</p>
                        <p className="text-[10px] text-slate-300 font-mono mt-1">
                          ₹{job.minSalary.toLocaleString()} - ₹{job.maxSalary.toLocaleString()} / mo
                        </p>
                        <p className="text-[9px] text-amber-300 font-bold mt-0.5">
                          📍 {dist} km away ({getCommuteTime(dist).text})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Map Pin Preview Drawer */}
            {selectedMapJob && (
              <div className="relative z-20 bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-teal-500/40 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {selectedMapJob.companyLogo}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      {selectedMapJob.title}
                      <span className="text-[10px] bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/30 font-bold">
                        {selectedMapJob.distanceKm ?? 3} km away
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      {selectedMapJob.companyName} • {selectedMapJob.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectJob(selectedMapJob)}
                    className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    View Job Details
                  </button>
                  <button
                    onClick={() => setSelectedMapJob(null)}
                    className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Cards Grid */}
        {(viewMode === 'grid' || viewMode === 'split') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Nearby Openings ({filteredJobs.length})
              </span>
              <span className="text-slate-400 font-normal">Showing jobs within {distanceKm} km radius</span>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map((job) => {
                  const dist = job.distanceKm ?? 5;
                  const commute = getCommuteTime(dist);

                  return (
                    <div key={job.id} className="relative group">
                      {/* Commute Badge Tag */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold border border-slate-700 shadow-xs">
                        {commute.icon}
                        <span>{commute.text}</span>
                      </div>

                      <JobCard
                        job={job}
                        candidateProfile={candidateProfile}
                        isSaved={savedJobIds.includes(job.id)}
                        onSelect={onSelectJob}
                        onApply={onApplyJob}
                        onToggleSave={onToggleSaveJob}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-slate-800 text-teal-600 flex items-center justify-center mx-auto text-xl">
                  📍
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  No jobs found within {distanceKm} km of {userLocation}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try expanding your distance radius to 15 km or 25 km, or select a different locality.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => setDistanceKm(25)}
                    className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Expand to 25 km Radius
                  </button>
                  <button
                    onClick={() => setCommuteFilter('all')}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Reset Commute Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
