import { FaClock, FaUsers, FaRupeeSign } from 'react-icons/fa';
import './SlotCard.css';

const SlotCard = ({ slot, onSelect, selected }) => {
  const isFull = slot.availableSeats === 0;

  return (
    <div
      className={`slot-card ${selected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
      onClick={() => !isFull && onSelect && onSelect(slot)}
    >
      <div className="slot-pooja-type">{slot.poojaType}</div>
      <div className="slot-details">
        <span><FaClock /> {slot.startTime} - {slot.endTime}</span>
        <span><FaUsers /> {slot.availableSeats}/{slot.slotCapacity} seats</span>
        <span>
          <FaRupeeSign />
          {slot.price === 0 ? 'Free' : `₹${slot.price}`}
        </span>
      </div>
      <div className={`slot-status ${isFull ? 'status-full' : 'status-available'}`}>
        {isFull ? 'Full' : `${slot.availableSeats} available`}
      </div>
      {selected && <div className="slot-selected-badge">Selected</div>}
    </div>
  );
};

export default SlotCard;
