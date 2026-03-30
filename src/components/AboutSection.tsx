import { motion } from 'framer-motion';
import './AboutSection.css';

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, x: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <motion.div
        className="section-container about-container"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div className="about-content" variants={sectionVariants}>
          <motion.h2 className="section-title" variants={fadeUpVariants}>
            Who We Are
          </motion.h2>
          <motion.p className="about-text" variants={fadeUpVariants}>
            For over a decade, <span className="text-primary font-semibold">DutchStay Rentals</span> has been the premier choice for expats seeking comfortable, high-quality, fully-furnished homes in Amsterdam. We understand that moving to a new country is a big step, which is why we're dedicated to providing you with more than just an apartment—we provide a home.
          </motion.p>
          <motion.p className="about-text" variants={fadeUpVariants}>
            From the bustling city center to the peaceful canal districts, our carefully curated properties ensure you experience the vibrant Dutch energy the moment you step through your door.
          </motion.p>
          
          <motion.div
            className="about-stats"
            variants={sectionVariants}
          >
            <motion.div className="stat-card" variants={statVariants}>
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Expats</span>
            </motion.div>
            <motion.div className="stat-card" variants={statVariants}>
              <span className="stat-number">120+</span>
              <span className="stat-label">Premium Homes</span>
            </motion.div>
            <motion.div className="stat-card" variants={statVariants}>
              <span className="stat-number">24/7</span>
              <span className="stat-label">Local Support</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div className="about-image-wrapper" variants={imageVariants}>
          <div className="about-image-placeholder">
             {/* Using a bright stock image or CSS gradient as a placeholder */}
             <div className="image-overlay"></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
