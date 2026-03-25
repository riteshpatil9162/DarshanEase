import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTempleById, getSlotsByTemple, createOrder, createDonation } from '../../services/api';
import SlotCard from '../../components/SlotCard/SlotCard';
import BookingModal from '../../components/BookingModal/BookingModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaPrayingHands, FaHeart } from 'react-icons/fa';
import './TempleDetails.css';

const TempleDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState(101);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templeRes, slotsRes] = await Promise.all([
          getTempleById(id),
          getSlotsByTemple(id, { date: selectedDate }),
        ]);
        setTemple(templeRes.data.temple);
        setSlots(slotsRes.data.slots);
      } catch (err) {
        toast.error('Failed to load temple details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    try {
      const { data } = await getSlotsByTemple(id, { date });
      setSlots(data.slots);
    } catch (err) {
      toast.error('Failed to load slots');
    }
  };

  const handleDonate = async () => {
    if (!user) { toast.warn('Please login to donate'); return; }
    if (donationAmount < 1) { toast.warn('Enter a valid donation amount'); return; }

    try {
      const { data: orderData } = await createOrder({ amount: donationAmount });
      const order = orderData.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'DarshanEase Donation',
        description: `Donation to ${temple.name}`,
        order_id: order.id,
        handler: async (response) => {
          await createDonation({
            templeId: temple._id,
            donationAmount,
            paymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          });
          toast.success('Thank you for your donation! Jai Shree Ram!');
        },
        theme: { color: '#8B0000' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Donation failed');
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!temple) return <div className="error-page">Temple not found</div>;

  return (
    <div className="temple-details-page">
      {/* Hero */}
      <div
        className="temple-hero"
        style={{ backgroundImage: `url(${temple.image || 'https://placehold.co/1400x500/8B0000/FFD700?text=Temple'})` }}
      >
        <div className="temple-hero-overlay">
          <div className="temple-hero-content">
            <h1>{temple.name}</h1>
            <p><FaMapMarkerAlt /> {temple.location}</p>
            <p><FaClock /> {temple.openingHours?.open} - {temple.openingHours?.close}</p>
            {temple.deity && <p><FaPrayingHands /> {temple.deity}</p>}
          </div>
        </div>
      </div>

      <div className="details-content">
        <div className="details-main">
          {/* Description */}
          <div className="details-card">
            <h3>About This Temple</h3>
            <p className="temple-description">{temple.description}</p>
          </div>

          {/* Slots */}
          <div className="details-card">
            <h3>Available Darshan Slots</h3>
            <div className="date-picker">
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            {slots.length === 0 ? (
              <p className="no-slots">No slots available for this date.</p>
            ) : (
              slots.map((slot) => (
                <SlotCard
                  key={slot._id}
                  slot={slot}
                  selected={selectedSlot?._id === slot._id}
                  onSelect={setSelectedSlot}
                />
              ))
            )}

            {selectedSlot && (
              <button
                className="proceed-btn"
                onClick={() => {
                  if (!user) { toast.warn('Please login to book'); return; }
                  setShowModal(true);
                }}
              >
                Proceed to Book
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
          <div className="donation-card">
            <h4><FaHeart /> Make a Donation</h4>
            <p>Support the temple with a heartfelt donation.</p>
            <div className="donation-presets">
              {[51, 101, 251, 501, 1001].map((amt) => (
                <button
                  key={amt}
                  className={`preset-btn ${donationAmount === amt ? 'active' : ''}`}
                  onClick={() => setDonationAmount(amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={donationAmount}
              min={1}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              className="donation-input"
              placeholder="Custom amount"
            />
            <button className="donate-btn" onClick={handleDonate}>
              Donate ₹{donationAmount}
            </button>
          </div>
        </div>
      </div>

      {showModal && selectedSlot && (
        <BookingModal
          temple={temple}
          slot={selectedSlot}
          onClose={() => { setShowModal(false); setSelectedSlot(null); }}
        />
      )}
    </div>
  );
};

export default TempleDetails;
