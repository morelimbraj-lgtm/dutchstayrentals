
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { Property, PropertyAvailability, PropertyStatus } from '../types';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, id?: string) => void;
  property?: Property | null;
}

const AMSTERDAM_LOCATIONS = [
  "Amsterdam-Centrum (Central Amsterdam)",
  "Amsterdam-Noord (North Amsterdam)",
  "Amsterdam-West (West Amsterdam)",
  "Amsterdam-Nieuw-West (New West Amsterdam)",
  "Amsterdam-Zuid (South Amsterdam)",
  "Amsterdam-Oost (East Amsterdam)",
  "Amsterdam-Zuidoost (Southeast Amsterdam)"
];

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, onSubmit, property }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [size, setSize] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [imageUrlText, setImageUrlText] = useState(''); // Manual URLs
  const [availability, setAvailability] = useState<PropertyAvailability>(PropertyAvailability.AVAILABLE);
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.ACTIVE);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setDescription(property.description);
      setLocation(property.location);
      setRent(property.rent.toString());
      setSize(property.size.toString());
      setBedrooms(property.bedrooms.toString());
      setImageUrlText(property.images.join(', '));
      setAvailability(property.availability);
      setStatus(property.status);
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setRent('');
      setSize('');
      setBedrooms('');
      setImageUrlText('');
      setAvailability(PropertyAvailability.AVAILABLE);
      setStatus(PropertyStatus.ACTIVE);
    }
  }, [property, isOpen]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !rent || !size || !bedrooms) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if we have at least one image source
    if (!imageUrlText && (!property || property.images.length === 0)) {
      setError('Please provide at least one image URL.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const manualImages = imageUrlText ? imageUrlText.split(',').map(url => url.trim()).filter(url => url.length > 0) : [];

      const propertyData = {
        title,
        description,
        location,
        rent: parseInt(rent, 10),
        size: parseInt(size, 10),
        bedrooms: parseInt(bedrooms, 10),
        images: manualImages,
        availability,
        status,
      };

      // Await the submit handler to ensure files upload before closing
      await onSubmit(propertyData, property?.id);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save property. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={property ? 'Edit Property' : 'Add New Property'}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <Input id="title" type="text" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 transition" required></textarea>
        </div>

        {/* Location Dropdown */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
          <div className="relative">
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 appearance-none transition"
              required
            >
              <option value="" disabled>Select a district</option>
              {AMSTERDAM_LOCATIONS.map(loc => (
                <option key={loc} value={loc} className="bg-gray-900">{loc}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/70">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input id="rent" type="number" label="Rent ($/mo)" value={rent} onChange={(e) => setRent(e.target.value)} required />
          <Input id="size" type="number" label="Size (sqft)" value={size} onChange={(e) => setSize(e.target.value)} required />
        </div>
        <Input id="bedrooms" type="number" label="Bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />

        {/* Images Section */}
        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <label className="block text-sm font-medium text-gray-300">Property Images</label>

          {/* URL Input */}
          <div>
            <label htmlFor="images" className="block text-xs text-gray-400 mb-1">Image URLs (Comma separated)</label>
            <textarea id="images" placeholder="https://..." rows={2} value={imageUrlText} onChange={(e) => setImageUrlText(e.target.value)} className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 text-sm transition"></textarea>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-1">Availability</label>
            <select id="availability" value={availability} onChange={(e) => setAvailability(e.target.value as PropertyAvailability)} className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 transition">
              {Object.values(PropertyAvailability).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as PropertyStatus)} className="w-full bg-gray-900/50 border border-white/20 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white p-2 transition">
              {Object.values(PropertyStatus).map(val => <option key={val} value={val}>{val}</option>)}
            </select>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="pt-2">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (property ? 'Save Changes' : 'Add Property')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PropertyFormModal;
