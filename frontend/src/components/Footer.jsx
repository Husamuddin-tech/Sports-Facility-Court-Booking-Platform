import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-softSand text-graphite shadow-inner border-t border-paleSteel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-graphite flex items-center justify-center rounded-full shadow-sm">
                <span className="text-frostWhite font-bold text-xl">CB</span>
              </div>
              <span className="font-bold text-xl text-graphite">CourtBook</span>
            </div>
            <p className="text-sm text-mutedCharcoal">
              Your premier destination for badminton court bookings, equipment rentals, and professional coaching sessions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-graphite font-semibold mb-4 border-b border-mutedCharcoal pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/booking" className="footer-link">Book a Court</Link>
              </li>
              <li>
                <Link to="/booking" className="footer-link">Our Courts</Link>
              </li>
              <li>
                <Link to="/booking" className="footer-link">Equipment Rental</Link>
              </li>
              <li>
                <Link to="/booking" className="footer-link">Our Coaches</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-graphite font-semibold mb-4 border-b border-mutedCharcoal pb-2">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="footer-link">FAQ</a>
              </li>
              <li>
                <a href="#" className="footer-link">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="footer-link">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer-link">Cancellation Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-graphite font-semibold mb-4 border-b border-mutedCharcoal pb-2">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-mutedCharcoal" /> <span>ABC Sports Complex, City</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-mutedCharcoal" /> <span>+9 876 543 210</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-mutedCharcoal" /> <span>info@courtbook.com</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="social-icon" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-paleSteel mt-8 pt-6 text-center text-sm text-mutedCharcoal">
          &copy; {new Date().getFullYear()} CourtBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
