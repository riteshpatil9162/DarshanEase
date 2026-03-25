import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTemples } from '../../services/api';
import TempleCard from '../../components/TempleCard/TempleCard';
import { SkeletonCard } from '../../components/Skeleton/Skeleton';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './Temples.css';

const Temples = () => {
  const [searchParams] = useSearchParams();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const { data } = await getTemples({ search, location, page, limit: 9 });
      setTemples(data.temples);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemples();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTemples();
  };

  return (
    <div className="temples-page">
      <div className="temples-hero">
        <h1>Explore Temples</h1>
        <p>Find and book darshan at sacred temples across India</p>
      </div>

      <div className="temples-content">
        {/* Filters */}
        <form className="temples-filter" onSubmit={handleSearch}>
          <div className="filter-input">
            <FaSearch className="filter-icon" />
            <input
              type="text"
              placeholder="Search temples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-input">
            <FaFilter className="filter-icon" />
            <input
              type="text"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="filter-btn">Search</button>
        </form>

        {/* Grid */}
        <div className="temples-grid-page">
          {loading
            ? Array(9).fill(0).map((_, i) => (
                <div key={i}><SkeletonCard /></div>
              ))
            : temples.length === 0
            ? (
                <div className="no-results">
                  <p>No temples found. Try a different search.</p>
                </div>
              )
            : temples.map((temple) => (
                <TempleCard key={temple._id} temple={temple} />
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Temples;
