import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemples } from '../../services/api';
import TempleCard from '../../components/TempleCard/TempleCard';
import { SkeletonCard } from '../../components/Skeleton/Skeleton';
import { FaSearch, FaPlaceOfWorship, FaPrayingHands, FaTicketAlt } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredTemples, setFeaturedTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const { data } = await getTemples({ limit: 3 });
        setFeaturedTemples(data.temples);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaPlaceOfWorship className="hero-icon" />
              DarshanEase
            </h1>
            <p className="hero-subtitle">
              Book your divine darshan online — Skip the queue, embrace the blessings.
            </p>
            <div className="hero-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search temples by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') window.location.href = `/temples?search=${search}`;
                }}
              />
              <Link to={`/temples?search=${search}`} className="search-btn">Search</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="feature-item">
            <FaPlaceOfWorship className="feature-icon" />
            <h5>100+ Temples</h5>
            <p>Explore sacred temples across India</p>
          </div>
          <div className="feature-item">
            <FaTicketAlt className="feature-icon" />
            <h5>Easy Booking</h5>
            <p>Book darshan tickets in seconds</p>
          </div>
          <div className="feature-item">
            <FaPrayingHands className="feature-icon" />
            <h5>Divine Experience</h5>
            <p>Secure payments with Razorpay</p>
          </div>
        </div>
      </section>

      {/* Featured Temples */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Temples</h2>
            <Link to="/temples" className="view-all-btn">View All</Link>
          </div>

          <div className="temples-grid">
            {loading
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="temple-grid-item">
                    <SkeletonCard />
                  </div>
                ))
              : featuredTemples.map((temple) => (
                  <div key={temple._id} className="temple-grid-item">
                    <TempleCard temple={temple} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Start Your Spiritual Journey</h2>
          <p>Register now and book darshan tickets for your favorite temples instantly.</p>
          <Link to="/register" className="cta-btn">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
