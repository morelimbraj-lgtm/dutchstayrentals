
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import Button from '../components/ui/Button';
import EnquiryModal from '../components/EnquiryModal';
import { PropertyAvailability } from '../types';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, addEnquiry } = useData();
  const property = useMemo(() => properties.find(p => p.id === id), [id, properties]);
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState(property?.images[0]);
  const [isSubmissionSuccess, setSubmissionSuccess] = useState(false);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  React.useEffect(() => {
    if (property && !mainImage) {
      setMainImage(property.images[0]);
    }
  }, [property, mainImage]);

  if (!property) {
    return (
      <div className="text-center py-20 text-white animate-fade-in-up">
        <h2 className="font-display text-3xl font-bold">Property not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4">Back to Listings</Button>
      </div>
    );
  }

  const handleEnquirySubmit = (enquiryData: { name: string; email: string; phone?: string; message: string }) => {
    addEnquiry({
      propertyId: property.id,
      tenantName: enquiryData.name,
      tenantEmail: enquiryData.email,
      tenantPhone: enquiryData.phone,
      message: enquiryData.message,
    });
    setEnquiryModalOpen(false);
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 5000); // Hide message after 5 seconds
  };

  const handleImageClick = () => {
    setIsLightboxOpen(true);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = property.images.indexOf(mainImage || '');
    const nextIndex = (currentIndex + 1) % property.images.length;
    setMainImage(property.images[nextIndex]);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = property.images.indexOf(mainImage || '');
    const prevIndex = (currentIndex - 1 + property.images.length) % property.images.length;
    setMainImage(property.images[prevIndex]);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in-up">
      <div className="bg-gray-950/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Image Gallery */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-black/50 cursor-pointer group relative"
              onClick={handleImageClick}
            >
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white/80 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">Click to Expand</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 ${mainImage === image ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900' : 'opacity-70 hover:opacity-100 hover:ring-2 hover:ring-white/20'}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex px-3 py-1 text-[12px] font-semibold tracking-wide uppercase rounded-full ${property.availability === PropertyAvailability.AVAILABLE ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {property.availability}
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">{property.title}</h1>
              <p className="font-sans text-[16px] text-white/60 mt-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                {property.location}
              </p>

              <div className="my-8 h-px bg-gradient-to-r from-white/10 to-transparent"></div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-xs font-sans text-gray-500 uppercase tracking-wider mb-1">Rent</p>
                  <p className="font-display font-semibold text-2xl text-white">${property.rent.toLocaleString()}<span className="text-sm text-gray-400 font-normal">/mo</span></p>
                </div>
                <div>
                  <p className="text-xs font-sans text-gray-500 uppercase tracking-wider mb-1">Size</p>
                  <p className="font-display font-semibold text-2xl text-white">{property.size.toLocaleString()} <span className="text-sm text-gray-400 font-normal">sqft</span></p>
                </div>
                <div>
                  <p className="text-xs font-sans text-gray-500 uppercase tracking-wider mb-1">Bedrooms</p>
                  <p className="font-display font-semibold text-2xl text-white">{property.bedrooms}</p>
                </div>
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-white/10 to-transparent"></div>

              <div>
                <p className="text-xs font-sans text-gray-500 uppercase tracking-wider mb-3">About this property</p>
                <p className="font-sans text-gray-300 leading-relaxed text-[15px]">{property.description}</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5">
              {isSubmissionSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-center p-3 rounded-xl mb-4 text-sm font-medium">
                  Your enquiry has been sent successfully!
                </div>
              )}
              {property.availability === PropertyAvailability.AVAILABLE ? (
                <Button fullWidth onClick={() => setEnquiryModalOpen(true)} className="h-12 text-[16px]">
                  Schedule a Viewing
                </Button>
              ) : (
                <Button fullWidth disabled className="bg-white/5 text-gray-400 cursor-not-allowed border border-white/5 h-12">
                  Currently Unavailable
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white p-2 z-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-50 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-50 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <img
            src={mainImage}
            alt="Full screen"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />

          {/* Thumbnails in Lightbox */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 hide-scrollbar" onClick={(e) => e.stopPropagation()}>
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${mainImage === image ? 'border-indigo-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={image} className="w-full h-full object-cover" alt={`Thumbnail ${index}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        propertyTitle={property.title}
        onSubmit={handleEnquirySubmit}
      />
    </div>
  );
};

export default PropertyDetailPage;
