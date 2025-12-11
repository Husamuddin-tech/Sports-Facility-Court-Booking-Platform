import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-softSand shadow-md sticky top-0 z-50 border-b border-paleSteel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-graphite flex items-center justify-center rounded-full shadow-sm">
              <span className="text-frostWhite font-bold text-xl">CB</span>
            </div>
            <span className="font-bold text-xl text-graphite">CourtBook</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/booking" className="nav-link">Book Now</Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}

                <div className="flex items-center space-x-3 ml-6 pl-4 border-l border-paleSteel">
                  <span className="text-sm text-graphite">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn-outline px-3 py-1 rounded-md text-sm hover:bg-mutedCharcoal/10 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-graphite hover:text-mutedCharcoal focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-softSand border-t border-paleSteel shadow-sm animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="mobile-link">
              <FiHome /> <span>Home</span>
            </Link>
            <Link to="/booking" onClick={() => setIsOpen(false)} className="mobile-link">
              <FiCalendar /> <span>Book Now</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="mobile-link">
                  <FiUser /> <span>My Bookings</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="mobile-link">
                    <FiSettings /> <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 rounded-md w-full text-left"
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block btn-outline w-full text-center">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block btn-primary w-full text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
