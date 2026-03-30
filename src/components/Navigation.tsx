import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Navigation.css';

const linkVariants = {
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' as const },
  },
};

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
    <motion.nav
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        <a href="#" className="nav-logo">
          Dutch<span className="text-primary">Stay</span>
        </a>
        <div className="nav-links">
          <motion.a href="#" className="nav-link" variants={linkVariants} whileHover="hover">Home</motion.a>
          <motion.a href="#properties" className="nav-link" variants={linkVariants} whileHover="hover">Properties</motion.a>
          <motion.a href="#about" className="nav-link" variants={linkVariants} whileHover="hover">About Us</motion.a>
          <motion.a href="#contact" className="nav-link" variants={linkVariants} whileHover="hover">Contact</motion.a>
        </div>
        <motion.button
          className="nav-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          Book Viewing
        </motion.button>
      </div>
    </motion.nav>
  );
}
