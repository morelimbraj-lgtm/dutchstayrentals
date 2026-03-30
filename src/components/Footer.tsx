import './Footer.css';

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="section-container footer-container">
        
        <div className="footer-brand">
          <a href="#" className="footer-logo">
            Dutch<span className="text-secondary">Stay</span>
          </a>
          <p className="footer-desc">
            Premium furnished homes for expats, designed to make your transition to Amsterdam entirely seamless.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Explore</h4>
          <a href="#" className="footer-link">Home</a>
          <a href="#properties" className="footer-link">Properties</a>
          <a href="#about" className="footer-link">About Us</a>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-title">Contact</h4>
          <p className="footer-contact">📍 Herengracht 123, Amsterdam</p>
          <p className="footer-contact">📞 +31684463167</p>
          <p className="footer-contact">✉️ info@dutchstayrentals.com</p>
        </div>

      </div>
      
      <div className="footer-bottom">
        <div className="section-container footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} DutchStay Rentals. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
