
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.OWNER:
        return <Link to="/owner-dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link>;
      case UserRole.ADMIN:
        return <Link to="/admin-dashboard" className="hover:text-white transition-colors duration-300">Dashboard</Link>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            {/* Logo: Satoshi SemiBold, 22px, tracking 0.2px */}
            <Link to="/" className="font-display font-semibold text-[22px] tracking-[0.2px] text-white">
              Amsterdam<span className="text-indigo-400">Estates</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-[14px] font-medium tracking-[0.3px] text-gray-300 font-sans">
            <Link to="/" className="hover:text-white transition-colors duration-300">Home</Link>
            {getDashboardLink()}
            {user ? (
              <>
                <span className="text-gray-600">|</span>
                <span className="text-gray-300">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="bg-indigo-600/90 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/20">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md">
                Owner / Admin Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
