import './AboutSection.css';

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="section-container about-container">
        <div className="about-content">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-text">
            For over a decade, <span className="text-primary font-semibold">DutchStay Rentals</span> has been the premier choice for expats seeking comfortable, high-quality, fully-furnished homes in Amsterdam. We understand that moving to a new country is a big step, which is why we’re dedicated to providing you with more than just an apartment—we provide a home.
          </p>
          <p className="about-text">
            From the bustling city center to the peaceful canal districts, our carefully curated properties ensure you experience the vibrant Dutch energy the moment you step through your door.
          </p>
          
          <div className="about-stats">
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Expats</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">120+</span>
              <span className="stat-label">Premium Homes</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Local Support</span>
            </div>
          </div>
        </div>
        
        <div className="about-image-wrapper">
          <div className="about-image-placeholder">
             {/* Using a bright stock image or CSS gradient as a placeholder */}
             <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
