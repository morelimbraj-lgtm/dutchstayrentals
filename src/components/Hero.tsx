import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-video-wrapper">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          {/* Using a high-quality free stock video resembling a lively city/canals */}
          <source src="/16426870-hd_1920_1080_60fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <span className="hero-badge">Welcome to Amsterdam</span>
        <h1 className="hero-title">
          Furnished long-term homes <br/> for expats in Amsterdam
        </h1>
        <p className="hero-subtitle">
          Experience the vibrant city life with premium, fully-furnished rental properties tailored for your comfort.
        </p>
        <div className="hero-actions">
          <a href="#properties" className="btn-primary hero-btn">
            Browse Amsterdam Rentals
          </a>
        </div>
      </div>
    </section>
  );
}
