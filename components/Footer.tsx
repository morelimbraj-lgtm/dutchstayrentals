
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="z-10 bg-gray-950/60 mt-12 backdrop-blur-md border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm font-sans">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
          <p>&copy; {new Date().getFullYear()} DutchStay Rentals. All rights reserved.</p>
          <span className="hidden md:inline text-gray-600">•</span>
          <p>
            Made by{' '}
            <a
              href="https://glitchaisolutions.framer.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Glitch AI Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
