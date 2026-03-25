import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaTicketAlt } from 'react-icons/fa';
import './TempleCard.css';

const TempleCard = ({ temple }) => {
  return (
    <div className="temple-card">
      <div className="temple-card-img-wrapper">
        <img
          src={temple.image || 'https://placehold.co/400x250/8B0000/FFD700?text=Temple'}
          alt={temple.name}
          className="temple-card-img"
          onError={(e) => { e.target.src = 'https://placehold.co/400x250/8B0000/FFD700?text=Temple'; }}
        />
        <div className="temple-badge">{temple.deity || 'Divine Temple'}</div>
      </div>
      <div className="temple-card-body">
        <h5 className="temple-name">{temple.name}</h5>
        <p className="temple-location">
          <FaMapMarkerAlt /> {temple.location}
        </p>
        <p className="temple-hours">
          <FaClock /> {temple.openingHours?.open} - {temple.openingHours?.close}
        </p>
        <p className="temple-desc">{temple.description?.substring(0, 80)}...</p>
        <Link to={`/temples/${temple._id}`} className="book-btn">
          <FaTicketAlt /> Book Darshan
        </Link>
      </div>
    </div>
  );
};

export default TempleCard;
