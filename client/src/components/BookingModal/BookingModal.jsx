import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment, createBooking } from '../../services/api';
import { toast } from 'react-toastify';
import { FaTimes, FaMapMarkerAlt, FaClock, FaUsers, FaRupeeSign } from 'react-icons/fa';
import './BookingModal.css';

const BookingModal = ({ temple, slot, onClose }) => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalAmount = slot.price * numberOfPeople;

  const handlePayment = async () => {
    if (numberOfPeople > slot.availableSeats) {
      toast.error(`Only ${slot.availableSeats} seats available`);
      return;
    }

    setLoading(true);
    try {
      if (slot.price === 0) {
        // Free booking - no payment needed
        const { data } = await createBooking({
          templeId: temple._id,
          slotId: slot._id,
          numberOfPeople,
          paymentId: 'FREE',
          razorpayOrderId: 'FREE',
        });
        toast.success('Darshan booked successfully!');
        onClose();
        navigate('/my-bookings');
        return;
      }

      // Create Razorpay order
      const { data: orderData } = await createOrder({ amount: totalAmount });
      const order = orderData.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'DarshanEase',
        description: `${temple.name} - ${slot.poojaType}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create booking
            await createBooking({
              templeId: temple._id,
              slotId: slot._id,
              numberOfPeople,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });

            toast.success('Booking confirmed! May God bless you.');
            onClose();
            navigate('/my-bookings');
          } catch (err) {
            toast.error('Booking failed after payment. Please contact support.');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#8B0000' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>

        <h4 className="modal-title">Book Darshan</h4>

        <div className="booking-summary">
          <h5>{temple.name}</h5>
          <p><FaMapMarkerAlt /> {temple.location}</p>

          <div className="slot-info">
            <p><strong>Pooja Type:</strong> {slot.poojaType}</p>
            <p><FaClock /> {slot.startTime} - {slot.endTime}</p>
            <p><FaUsers /> Available: {slot.availableSeats} seats</p>
            <p><FaRupeeSign /> Price per person: {slot.price === 0 ? 'Free' : `₹${slot.price}`}</p>
          </div>

          <div className="people-selector">
            <label>Number of Devotees</label>
            <div className="counter">
              <button onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}>-</button>
              <span>{numberOfPeople}</span>
              <button onClick={() => setNumberOfPeople(Math.min(slot.availableSeats, numberOfPeople + 1))}>+</button>
            </div>
          </div>

          <div className="total-amount">
            Total: <strong>{slot.price === 0 ? 'Free' : `₹${totalAmount}`}</strong>
          </div>
        </div>

        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : slot.price === 0 ? 'Book Free Darshan' : `Pay ₹${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
