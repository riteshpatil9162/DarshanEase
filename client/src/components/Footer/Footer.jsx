import { Link } from 'react-router-dom';
import { FaPlaceOfWorship, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <FaPlaceOfWorship />
            <span>DarshanEase</span>
          </div>
          <p>Your trusted platform for online temple darshan ticket booking. Experience divine blessings from anywhere.</p>
        </div>

        <div className="footer-links">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/temples">Temples</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h5>Contact Us</h5>
          <p><FaMapMarkerAlt /> Pune, Maharashtra, India</p>
          <p><FaPhone /> +91 90000 00000</p>
          <p><FaEnvelope /> support@darshanease.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DarshanEase. All rights reserved. Made with devotion.</p>
      </div>
    </footer>
  );
};

export default Footer;
