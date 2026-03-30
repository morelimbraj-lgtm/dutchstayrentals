import { motion } from 'framer-motion';
import './Hero.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

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
      
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero-badge" variants={itemVariants}>
          Welcome to Amsterdam
        </motion.span>
        <motion.h1 className="hero-title" variants={itemVariants}>
          Furnished long-term homes <br/> for expats in Amsterdam
        </motion.h1>
        <motion.p className="hero-subtitle" variants={itemVariants}>
          Experience the vibrant city life with premium, fully-furnished rental properties tailored for your comfort.
        </motion.p>
        <motion.div className="hero-actions" variants={itemVariants}>
          <a href="#properties" className="btn-primary hero-btn">
            Browse Amsterdam Rentals
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
