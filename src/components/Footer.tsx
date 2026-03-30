import { motion } from 'framer-motion';
import './Footer.css';

const footerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <motion.div
        className="section-container footer-container"
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        
        <motion.div className="footer-brand" variants={itemVariants}>
          <a href="#" className="footer-logo">
            Dutch<span className="text-secondary">Stay</span>
          </a>
          <p className="footer-desc">
            Premium furnished homes for expats, designed to make your transition to Amsterdam entirely seamless.
          </p>
        </motion.div>

        <motion.div className="footer-links-group" variants={itemVariants}>
          <h4 className="footer-title">Explore</h4>
          <a href="#" className="footer-link">Home</a>
          <a href="#properties" className="footer-link">Properties</a>
          <a href="#about" className="footer-link">About Us</a>
        </motion.div>

        <motion.div className="footer-links-group" variants={itemVariants}>
          <h4 className="footer-title">Contact</h4>
          <p className="footer-contact">📞 +31684463167</p>
          <p className="footer-contact">✉️ info@dutchstayrentals.com</p>
        </motion.div>

      </motion.div>
      
      <motion.div
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="section-container footer-bottom-container">
          <p>&copy; {new Date().getFullYear()} DutchStay Rentals. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
