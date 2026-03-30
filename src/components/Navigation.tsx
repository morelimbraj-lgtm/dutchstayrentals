import { useState, useEffect } from 'react';
import './Navigation.css';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo">
          Dutch<span className="text-primary">Stay</span>
        </a>
        <div className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#properties" className="nav-link">Properties</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button className="nav-cta">Book Viewing</button>
      </div>
    </nav>
  );
}
