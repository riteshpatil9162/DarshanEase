import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlaceOfWorship, FaUser, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaPlaceOfWorship className="brand-icon" />
          <span>DarshanEase</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/temples" onClick={() => setMenuOpen(false)}>Temples</Link></li>
          {user && (
            <li><Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link></li>
          )}
          {user && (user.role === 'ADMIN' || user.role === 'ORGANIZER') && (
            <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          )}
          {user ? (
            <li className="user-menu">
              <span className="user-name"><FaUser /> {user.name}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <>
              <li><Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
