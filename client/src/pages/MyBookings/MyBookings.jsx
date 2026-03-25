import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../../services/api';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaMapMarkerAlt, FaClock, FaUsers, FaTimes, FaCheckCircle } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await getUserBookings();
      setBookings(data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const statusColor = (status) => {
    if (status === 'Confirmed') return 'status-confirmed';
    if (status === 'Cancelled') return 'status-cancelled';
    return 'status-pending';
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="my-bookings-page">
      <div className="bookings-hero">
        <h1><FaTicketAlt /> My Bookings</h1>
        <p>View and manage your darshan bookings</p>
      </div>

      <div className="bookings-content">
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <FaTicketAlt className="no-icon" />
            <h4>No bookings yet</h4>
            <p>Start your spiritual journey by booking a darshan.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-img">
                  <img
                    src={booking.templeId?.image || 'https://placehold.co/120x120/8B0000/FFD700?text=Temple'}
                    alt={booking.templeId?.name}
                    onError={(e) => { e.target.src = 'https://placehold.co/120x120/8B0000/FFD700?text=Temple'; }}
                  />
                </div>

                <div className="booking-details">
                  <div className="booking-header">
                    <h5>{booking.templeId?.name}</h5>
                    <span className={`booking-status ${statusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </div>

                  <p><FaMapMarkerAlt /> {booking.templeId?.location}</p>
                  <p><FaClock /> {booking.slotId?.startTime} - {booking.slotId?.endTime}</p>
                  <p><FaUsers /> {booking.numberOfPeople} Devotee(s)</p>
                  <p className="ticket-number">Ticket: <strong>{booking.ticketNumber}</strong></p>
                  <p className="booking-amount">Total Paid: <strong>₹{booking.totalAmount || 'Free'}</strong></p>
                  <p className="booking-date">
                    Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="booking-actions">
                  {booking.bookingStatus === 'Confirmed' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(booking._id)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  )}
                  {booking.bookingStatus === 'Confirmed' && (
                    <div className="confirmed-badge">
                      <FaCheckCircle /> Confirmed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
