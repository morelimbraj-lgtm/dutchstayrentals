import { useState } from 'react';
import './Properties.css';

// Mock data for Amsterdam properties
const mockProperties = [
  {
    id: 1,
    title: 'Modern Canal-Side Apartment',
    neighborhood: 'Jordaan',
    price: 2400,
    bedrooms: 2,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    title: 'Spacious Family Home',
    neighborhood: 'Oud-Zuid',
    price: 3200,
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    featured: false
  },
  {
    id: 3,
    title: 'Sunny Studio Near Vondelpark',
    neighborhood: 'Oud-West',
    price: 1800,
    bedrooms: 1,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop',
    featured: true
  },
  {
    id: 4,
    title: 'Luxury Penthouse',
    neighborhood: 'De Pijp',
    price: 4500,
    bedrooms: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    featured: false
  },
  {
    id: 5,
    title: 'Cozy Historical Flat',
    neighborhood: 'Centrum',
    price: 2100,
    bedrooms: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    featured: false
  },
  {
    id: 6,
    title: 'Bright Corner Apartment',
    neighborhood: 'Jordaan',
    price: 2700,
    bedrooms: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d0cb?q=80&w=2080&auto=format&fit=crop',
    featured: false
  }
];

export default function Properties() {
  const [filterNeighborhood, setFilterNeighborhood] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterBeds, setFilterBeds] = useState('All');

  // Derive available neighborhoods from mock data
  const neighborhoods = ['All', ...new Set(mockProperties.map(p => p.neighborhood))];

  const filteredProperties = mockProperties.filter(property => {
    let matchNeighborhood = filterNeighborhood === 'All' || property.neighborhood === filterNeighborhood;
    let matchBeds = filterBeds === 'All' || property.bedrooms >= parseInt(filterBeds, 10);
    
    let matchPrice = true;
    if (filterPrice === 'Under 2000') matchPrice = property.price < 2000;
    else if (filterPrice === '2000 - 3000') matchPrice = property.price >= 2000 && property.price <= 3000;
    else if (filterPrice === 'Over 3000') matchPrice = property.price > 3000;

    return matchNeighborhood && matchBeds && matchPrice;
  });

  return (
    <section id="properties" className="properties-section">
      <div className="section-container">
        
        <div className="properties-header">
          <h2 className="section-title">Available Rentals</h2>
          <p className="properties-subtitle">Find your perfect home in Amsterdam, fully furnished and ready to move in.</p>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="filter-group">
            <label>Neighborhood</label>
            <select value={filterNeighborhood} onChange={(e) => setFilterNeighborhood(e.target.value)}>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Max Price / Month</label>
            <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
              <option value="All">Any Price</option>
              <option value="Under 2000">Under €2,000</option>
              <option value="2000 - 3000">€2,000 - €3,000</option>
              <option value="Over 3000">Over €3,000</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Bedrooms</label>
            <select value={filterBeds} onChange={(e) => setFilterBeds(e.target.value)}>
              <option value="All">Any</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
            </select>
          </div>
          <button className="btn-secondary filter-clear" onClick={() => {
            setFilterNeighborhood('All');
            setFilterPrice('All');
            setFilterBeds('All');
          }}>Clear Filters</button>
        </div>

        {/* Property Grid */}
        <div className="properties-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div key={property.id} className="property-card">
                <div className="property-image-wrapper">
                  <img src={property.image} alt={property.title} className="property-image" loading="lazy" />
                  {property.featured && <span className="property-badge">Featured</span>}
                  <div className="property-price">€{property.price} <span>/mo</span></div>
                </div>
                <div className="property-details">
                  <h3 className="property-title">{property.title}</h3>
                  <div className="property-meta">
                    <span className="meta-item">📍 {property.neighborhood}</span>
                    <span className="meta-item">🛏️ {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <button className="btn-primary w-full mt-4">View Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3>No properties found</h3>
              <p>Try adjusting your search filters.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
