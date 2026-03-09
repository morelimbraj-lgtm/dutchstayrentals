
import React, { useMemo, useState, useRef, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { useData } from '../hooks/useData';
import { PropertyStatus } from '../types';

const DUTCH_LOCATIONS = [
  "Amsterdam (North Holland)",
  "Rotterdam (South Holland)",
  "The Hague (South Holland)",
  "Utrecht (Utrecht)",
  "Eindhoven (North Brabant)",
  "Groningen (Groningen)",
  "Maastricht (Limburg)"
];

type SortOption = 'date_desc' | 'price_asc' | 'price_desc' | 'beds_asc' | 'beds_desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date_desc', label: 'Newest Listed' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'beds_asc', label: 'Bedrooms (Least first)' },
  { value: 'beds_desc', label: 'Bedrooms (Most first)' },
];

const HomePage: React.FC = () => {
  const { properties } = useData();
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProperties = useMemo(() => {
    // 1. Filter
    let result = properties.filter(p => {
      if (p.status !== PropertyStatus.ACTIVE) return false;
      if (locationFilter && p.location !== locationFilter) {
        return false;
      }
      return true;
    });

    // 2. Sort
    result = result.sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return a.rent - b.rent;
        case 'price_desc':
          return b.rent - a.rent;
        case 'beds_asc':
          return a.bedrooms - b.bedrooms;
        case 'beds_desc':
          return b.bedrooms - a.bedrooms;
        case 'date_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [properties, locationFilter, sortOption]);

  return (
    <div className="space-y-16 pb-12">
      <div className="text-center space-y-6 pt-8 animate-fade-in-up animation-delay-100">
        <h1 className="font-display font-bold text-4xl md:text-[52px] leading-[1.1] tracking-[-0.5px] text-white">
          Find Your Next Home
        </h1>
        <p className="font-sans font-normal text-base md:text-[18px] leading-[1.6] text-white/75 max-w-2xl mx-auto">
          Discover premium properties in the world's most desirable locations.
          <br className="hidden md:block" />Experience luxury living redefined.
        </p>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all hover:shadow-indigo-500/5 hover:bg-white/10 max-w-4xl mx-auto relative z-40 animate-fade-in-up animation-delay-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Location Filter */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Location
            </label>
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className={`w-full text-left bg-gray-900/60 border ${isLocationDropdownOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/20'} hover:bg-gray-900/80 rounded-xl shadow-lg text-white px-4 py-3.5 flex items-center justify-between transition-all duration-200 group`}
              >
                <span className={`block truncate ${!locationFilter ? 'text-gray-400' : 'text-white'}`}>
                  {locationFilter || "All Locations"}
                </span>
                <span className="pointer-events-none flex items-center ml-2">
                  <svg className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isLocationDropdownOpen ? 'transform rotate-180 text-indigo-400' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-gray-950/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    <div
                      onClick={() => { setLocationFilter(''); setIsLocationDropdownOpen(false); }}
                      className={`cursor-pointer select-none relative py-3 px-4 hover:bg-white/10 transition-colors ${locationFilter === '' ? 'text-indigo-400 font-medium bg-white/5' : 'text-white'}`}
                    >
                      All Locations
                    </div>
                    {DUTCH_LOCATIONS.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => { setLocationFilter(loc); setIsLocationDropdownOpen(false); }}
                        className={`cursor-pointer select-none relative py-3 px-4 hover:bg-white/10 transition-colors border-t border-white/5 ${locationFilter === loc ? 'text-indigo-400 font-medium bg-white/5' : 'text-white'}`}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className={`w-full text-left bg-gray-900/60 border ${isSortDropdownOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/20'} hover:bg-gray-900/80 rounded-xl shadow-lg text-white px-4 py-3.5 flex items-center justify-between transition-all duration-200 group`}
              >
                <span className="block truncate text-white">
                  {SORT_OPTIONS.find(opt => opt.value === sortOption)?.label}
                </span>
                <span className="pointer-events-none flex items-center ml-2">
                  <svg className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isSortDropdownOpen ? 'transform rotate-180 text-indigo-400' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {isSortDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-gray-950/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-auto focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    {SORT_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => { setSortOption(opt.value); setIsSortDropdownOpen(false); }}
                        className={`cursor-pointer select-none relative py-3 px-4 hover:bg-white/10 transition-colors border-t first:border-t-0 border-white/5 ${sortOption === opt.value ? 'text-indigo-400 font-medium bg-white/5' : 'text-white'}`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-8 relative z-0">
        {activeProperties.length > 0 && (
          <div className="flex justify-between items-end px-2 animate-fade-in-up animation-delay-300">
            <h2 className="font-display font-semibold text-[24px] text-white/90">
              Featured Properties
              <span className="ml-3 text-sm font-normal text-white/50 font-sans">{activeProperties.length} results</span>
            </h2>
          </div>
        )}

        {activeProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${300 + (index * 100)}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 border-dashed animate-fade-in-up animation-delay-300">
            <h2 className="font-display font-medium text-2xl text-white">No Properties Found</h2>
            <p className="mt-3 font-sans text-gray-400">Try adjusting your location filter.</p>
            <button
              onClick={() => setLocationFilter('')}
              className="mt-6 text-indigo-400 hover:text-indigo-300 font-medium font-sans underline underline-offset-4 decoration-indigo-400/30 hover:decoration-indigo-400"
            >
              Show all properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
