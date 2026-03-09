
import React from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link to={`/property/${property.id}`} className="block group rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-full flex flex-col transition-all duration-500 group-hover:bg-gray-900/80 group-hover:border-white/20">

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl aspect-[16/10] w-full">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-80"></div>

          {/* Price Tag - Inter SemiBold 18px */}
          <div className="absolute bottom-4 left-4">
            <span className="font-sans font-semibold text-[18px] text-white tracking-tight drop-shadow-md">
              ${property.rent.toLocaleString()}<span className="text-[14px] font-medium text-white/80">/mo</span>
            </span>
          </div>
        </div>

        <div className="pt-5 pb-2 flex-grow flex flex-col">
          {/* Title - Inter Medium 17px, Leading 1.4 */}
          <h3 className="font-sans font-medium text-[17px] leading-[1.4] text-white truncate group-hover:text-indigo-300 transition-colors">
            {property.title}
          </h3>

          {/* Location - Inter Regular 14px, White 65% opacity */}
          <p className="font-sans font-normal text-[14px] text-white/65 mt-1 truncate">
            {property.location}
          </p>

          <div className="mt-auto pt-4 flex items-center gap-4 border-t border-white/5">
            {/* Meta Info - Inter Regular 13px, Tracking 0.3px, White 55% opacity */}
            <div className="flex items-center gap-1.5 font-sans font-normal text-[13px] tracking-[0.3px] text-white/55">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 14.25c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75v1.5z" />
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h3.25a.75.75 0 00.75-.75v-3.25z" clipRule="evenodd" />
              </svg>
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="flex items-center gap-1.5 font-sans font-normal text-[13px] tracking-[0.3px] text-white/55">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5a2.25 2.25 0 002.25 2.25h11.5c1.243 0 2.25-1.007 2.25-2.25v-2.5A2.25 2.25 0 0015.75 2H4.25zM6 13.25a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
              <span>{property.size.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
