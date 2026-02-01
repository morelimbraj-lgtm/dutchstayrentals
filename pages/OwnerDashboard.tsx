
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Property, Enquiry, EnquiryStatus, PropertyStatus } from '../types';
import Button from '../components/ui/Button';
import PropertyFormModal from '../components/PropertyFormModal';
import Modal from '../components/ui/Modal';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    properties, 
    enquiries, 
    deleteProperty, 
    deleteEnquiry, 
    addProperty, 
    updateProperty,
    updateEnquiryStatus 
  } = useData();

  const [activeTab, setActiveTab] = useState('properties');
  
  // Property Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Delete Property Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // Delete Enquiry Confirmation Modal State
  const [isEnquiryDeleteModalOpen, setIsEnquiryDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<string | null>(null);

  const ownerProperties = useMemo(() => {
    return properties.filter(p => p.ownerId === user?.id);
  }, [properties, user?.id]);
  
  const ownerEnquiries = useMemo(() => {
    const propertyIds = ownerProperties.map(p => p.id);
    return enquiries.filter(e => propertyIds.includes(e.propertyId));
  }, [enquiries, ownerProperties]);

  // --- Property Handlers ---
  
  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingProperty(property);
    setIsFormModalOpen(true);
  };

  const initiateDeleteProperty = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setPropertyToDelete(propertyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProperty = async () => {
    if (propertyToDelete) {
        await deleteProperty(propertyToDelete);
        setIsDeleteModalOpen(false);
        setPropertyToDelete(null);
    }
  };

  const handlePropertySubmit = async (propertyData: Omit<Property, 'id' | 'ownerId' | 'createdAt'>, files: File[], id?: string) => {
      try {
        if (id) { // Editing existing property
            await updateProperty(id, propertyData, files);
        } else { // Adding new property
            await addProperty(propertyData, user!.id, files);
        }
        setIsFormModalOpen(false);
      } catch (e) {
        console.error("Error saving property", e);
        // Error handling is mostly done in modal, but this catches bubble ups
      }
  };

  // --- Enquiry Handlers ---
  
  const initiateDeleteEnquiry = (e: React.MouseEvent, enquiryId: string) => {
       e.stopPropagation();
       setEnquiryToDelete(enquiryId);
       setIsEnquiryDeleteModalOpen(true);
  };

  const confirmDeleteEnquiry = async () => {
      if (enquiryToDelete) {
          await deleteEnquiry(enquiryToDelete);
          setIsEnquiryDeleteModalOpen(false);
          setEnquiryToDelete(null);
      }
  };

  const handleEnquiryStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
      await updateEnquiryStatus(enquiryId, newStatus);
  };


  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">My Properties</h2>
        <Button onClick={handleOpenAddModal} className="bg-indigo-600 hover:bg-indigo-700">Add New Property</Button>
      </div>
      
      {ownerProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ownerProperties.map((property) => (
                <div key={property.id} className="group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
                    {/* Image Area */}
                    <div className="relative h-56 w-full overflow-hidden">
                        <img 
                            src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                            <h3 className="text-xl font-bold text-white truncate shadow-black drop-shadow-md">{property.title}</h3>
                            <p className="text-gray-200 text-sm truncate drop-shadow-md">{property.location}</p>
                        </div>
                    </div>

                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm ${property.status === PropertyStatus.ACTIVE ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                            {property.status}
                        </span>
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
                             <button 
                                onClick={(e) => handleOpenEditModal(e, property)} 
                                className="px-3 py-1.5 bg-gray-900/80 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-lg border border-white/20 backdrop-blur-md cursor-pointer text-xs font-medium"
                                title="Edit Property"
                                type="button"
                             >
                                Edit
                             </button>
                             <button 
                                onClick={(e) => initiateDeleteProperty(e, property.id)} 
                                className="px-3 py-1.5 bg-gray-900/80 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors shadow-lg border border-white/20 backdrop-blur-md cursor-pointer text-xs font-medium"
                                title="Delete Property"
                                type="button"
                             >
                                Delete
                             </button>
                    </div>

                    <div className="p-5 space-y-4 relative z-10 bg-inherit"> 
                        <div className="flex justify-between items-center text-sm text-gray-300">
                             <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">${property.rent.toLocaleString()}/mo</span>
                             </div>
                             <div className="flex items-center gap-4 text-xs">
                                <span>{property.bedrooms} Beds</span>
                                <span>{property.size} sqft</span>
                             </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                             <span className={`text-xs ${property.availability === 'Available' ? 'text-green-400' : 'text-red-400'}`}>
                                ● {property.availability}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-black/20 rounded-xl border border-white/5 border-dashed">
            <p className="text-gray-400 text-lg">You have not listed any properties yet.</p>
            <Button onClick={handleOpenAddModal} variant="secondary" className="mt-4">Create Your First Listing</Button>
        </div>
      )}
    </div>
  );

  const renderEnquiries = () => (
     <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Received Enquiries</h2>
       <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg overflow-hidden">
        <ul role="list" className="divide-y divide-white/10">
          {ownerEnquiries.length > 0 ? ownerEnquiries.map((enquiry) => {
              const property = ownerProperties.find(p => p.id === enquiry.propertyId);
              return (
              <li key={enquiry.id} className="p-6 hover:bg-white/5 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow space-y-2">
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                {property?.title || 'Unknown Property'}
                             </span>
                             <span className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-white">{enquiry.tenantName}</p>
                            <p className="text-sm text-gray-400">{enquiry.tenantEmail} {enquiry.tenantPhone && `• ${enquiry.tenantPhone}`}</p>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <p className="text-sm text-gray-300 italic">"{enquiry.message}"</p>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <select
                            value={enquiry.status}
                            onChange={(e) => handleEnquiryStatusChange(enquiry.id, e.target.value as EnquiryStatus)}
                            className="bg-gray-800 border border-white/20 text-gray-200 rounded-lg text-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            {Object.values(EnquiryStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                         <button 
                            onClick={(e) => initiateDeleteEnquiry(e, enquiry.id)} 
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Enquiry"
                            type="button"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                         </button>
                    </div>
                </div>
              </li>
              );
            }) : (
                 <li className="p-12 text-center text-gray-400">You have not received any enquiries yet.</li>
            )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-white tracking-tight">Owner Dashboard</h1>
      <div>
        <div className="border-b border-white/10 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button onClick={() => setActiveTab('properties')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'properties' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
              My Properties
            </button>
            <button onClick={() => setActiveTab('enquiries')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'enquiries' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
              Enquiries
            </button>
          </nav>
        </div>
        <div className="animate-fade-in-up">
          {activeTab === 'properties' ? renderProperties() : renderEnquiries()}
        </div>
      </div>
      
      {/* Property Edit/Add Modal */}
      <PropertyFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handlePropertySubmit}
        property={editingProperty}
      />

      {/* Delete Property Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Property Deletion"
      >
        <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                     <h3 className="text-red-300 font-semibold">Warning</h3>
                     <p className="text-red-200/70 text-sm mt-1">This action is permanent and cannot be undone.</p>
                </div>
            </div>
            <p className="text-gray-300">
                Are you sure you want to delete this property? 
                This will also remove all <strong>{ownerEnquiries.filter(e => e.propertyId === propertyToDelete).length}</strong> associated enquiries.
            </p>
            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDeleteProperty}>Delete Property</Button>
            </div>
        </div>
      </Modal>

      {/* Delete Enquiry Confirmation Modal */}
      <Modal 
        isOpen={isEnquiryDeleteModalOpen} 
        onClose={() => setIsEnquiryDeleteModalOpen(false)} 
        title="Confirm Enquiry Deletion"
      >
        <div className="space-y-4">
            <div className="flex items-start gap-3 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                     <h3 className="text-red-300 font-semibold">Warning</h3>
                     <p className="text-red-200/70 text-sm mt-1">This action is permanent and cannot be undone.</p>
                </div>
            </div>
            <p className="text-gray-300">
                Are you sure you want to delete this enquiry?
            </p>
            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setIsEnquiryDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDeleteEnquiry}>Delete Enquiry</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;
