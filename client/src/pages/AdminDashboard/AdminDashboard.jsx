import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getTemples, createTemple, updateTemple, deleteTemple,
  getAllSlots, createSlot, updateSlot, deleteSlot,
  getAllBookings,
} from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlaceOfWorship, FaCalendarAlt, FaTicketAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('temples');
  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showTempleForm, setShowTempleForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editTemple, setEditTemple] = useState(null);
  const [editSlot, setEditSlot] = useState(null);

  const [templeForm, setTempleForm] = useState({
    name: '', location: '', state: '', description: '', image: '', deity: '',
    openingHours: { open: '06:00', close: '20:00' },
  });

  const [slotForm, setSlotForm] = useState({
    templeId: '', date: '', startTime: '', endTime: '',
    slotCapacity: 50, poojaType: 'General Darshan', price: 0,
  });

  useEffect(() => {
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZER')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [templesRes, slotsRes, bookingsRes] = await Promise.all([
        getTemples({ limit: 100 }),
        getAllSlots(),
        getAllBookings(),
      ]);
      setTemples(templesRes.data.temples);
      setSlots(slotsRes.data.slots);
      setBookings(bookingsRes.data.bookings);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  // Temple CRUD
  const handleTempleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTemple) {
        await updateTemple(editTemple._id, templeForm);
        toast.success('Temple updated!');
      } else {
        await createTemple(templeForm);
        toast.success('Temple created!');
      }
      setShowTempleForm(false);
      setEditTemple(null);
      resetTempleForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteTemple = async (id) => {
    if (!window.confirm('Delete this temple?')) return;
    try {
      await deleteTemple(id);
      toast.success('Temple deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete temple');
    }
  };

  const startEditTemple = (temple) => {
    setEditTemple(temple);
    setTempleForm({
      name: temple.name, location: temple.location, state: temple.state || '',
      description: temple.description, image: temple.image || '',
      deity: temple.deity || '',
      openingHours: temple.openingHours || { open: '06:00', close: '20:00' },
    });
    setShowTempleForm(true);
  };

  const resetTempleForm = () => {
    setTempleForm({ name: '', location: '', state: '', description: '', image: '', deity: '', openingHours: { open: '06:00', close: '20:00' } });
  };

  // Slot CRUD
  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSlot) {
        await updateSlot(editSlot._id, slotForm);
        toast.success('Slot updated!');
      } else {
        await createSlot(slotForm);
        toast.success('Slot created!');
      }
      setShowSlotForm(false);
      setEditSlot(null);
      resetSlotForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await deleteSlot(id);
      toast.success('Slot deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete slot');
    }
  };

  const startEditSlot = (slot) => {
    setEditSlot(slot);
    setSlotForm({
      templeId: slot.templeId?._id || slot.templeId,
      date: slot.date?.split('T')[0],
      startTime: slot.startTime, endTime: slot.endTime,
      slotCapacity: slot.slotCapacity, poojaType: slot.poojaType, price: slot.price,
    });
    setShowSlotForm(true);
  };

  const resetSlotForm = () => {
    setSlotForm({ templeId: '', date: '', startTime: '', endTime: '', slotCapacity: 50, poojaType: 'General Darshan', price: 0 });
  };

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <h1>Admin Dashboard</h1>
        <p>Manage temples, slots, and bookings</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <FaPlaceOfWorship className="stat-icon" />
          <div><h3>{temples.length}</h3><p>Temples</p></div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div><h3>{slots.length}</h3><p>Slots</p></div>
        </div>
        <div className="stat-card">
          <FaTicketAlt className="stat-icon" />
          <div><h3>{bookings.length}</h3><p>Bookings</p></div>
        </div>
        <div className="stat-card">
          <FaTicketAlt className="stat-icon confirmed-icon" />
          <div>
            <h3>{bookings.filter(b => b.bookingStatus === 'Confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-container">
        <div className="admin-tabs">
          <button className={activeTab === 'temples' ? 'tab active' : 'tab'} onClick={() => setActiveTab('temples')}>
            <FaPlaceOfWorship /> Temples
          </button>
          <button className={activeTab === 'slots' ? 'tab active' : 'tab'} onClick={() => setActiveTab('slots')}>
            <FaCalendarAlt /> Slots
          </button>
          <button className={activeTab === 'bookings' ? 'tab active' : 'tab'} onClick={() => setActiveTab('bookings')}>
            <FaTicketAlt /> Bookings
          </button>
        </div>

        {/* Temples Tab */}
        {activeTab === 'temples' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Temple Management</h3>
              {user.role === 'ADMIN' && (
                <button className="add-btn" onClick={() => { resetTempleForm(); setEditTemple(null); setShowTempleForm(true); }}>
                  <FaPlus /> Add Temple
                </button>
              )}
            </div>

            {showTempleForm && (
              <div className="form-card">
                <h4>{editTemple ? 'Edit Temple' : 'Add New Temple'}</h4>
                <form onSubmit={handleTempleSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Temple Name *</label>
                      <input value={templeForm.name} onChange={(e) => setTempleForm({ ...templeForm, name: e.target.value })} required placeholder="Temple name" />
                    </div>
                    <div className="form-group">
                      <label>Deity</label>
                      <input value={templeForm.deity} onChange={(e) => setTempleForm({ ...templeForm, deity: e.target.value })} placeholder="e.g. Lord Shiva" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Location *</label>
                      <input value={templeForm.location} onChange={(e) => setTempleForm({ ...templeForm, location: e.target.value })} required placeholder="City, State" />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input value={templeForm.state} onChange={(e) => setTempleForm({ ...templeForm, state: e.target.value })} placeholder="State" />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>Description *</label>
                    <textarea value={templeForm.description} onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })} required rows={3} placeholder="Temple description" />
                  </div>
                  <div className="form-group full">
                    <label>Image URL</label>
                    <input value={templeForm.image} onChange={(e) => setTempleForm({ ...templeForm, image: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Opening Time</label>
                      <input type="time" value={templeForm.openingHours.open} onChange={(e) => setTempleForm({ ...templeForm, openingHours: { ...templeForm.openingHours, open: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label>Closing Time</label>
                      <input type="time" value={templeForm.openingHours.close} onChange={(e) => setTempleForm({ ...templeForm, openingHours: { ...templeForm.openingHours, close: e.target.value } })} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">{editTemple ? 'Update' : 'Create'} Temple</button>
                    <button type="button" className="cancel-form-btn" onClick={() => { setShowTempleForm(false); setEditTemple(null); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Location</th><th>Deity</th><th>Hours</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {temples.map((t) => (
                    <tr key={t._id}>
                      <td><strong>{t.name}</strong></td>
                      <td>{t.location}</td>
                      <td>{t.deity || '-'}</td>
                      <td>{t.openingHours?.open} - {t.openingHours?.close}</td>
                      <td className="action-btns">
                        <button className="edit-btn" onClick={() => startEditTemple(t)}><FaEdit /></button>
                        <button className="del-btn" onClick={() => handleDeleteTemple(t._id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Slots Tab */}
        {activeTab === 'slots' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>Slot Management</h3>
              <button className="add-btn" onClick={() => { resetSlotForm(); setEditSlot(null); setShowSlotForm(true); }}>
                <FaPlus /> Add Slot
              </button>
            </div>

            {showSlotForm && (
              <div className="form-card">
                <h4>{editSlot ? 'Edit Slot' : 'Add New Slot'}</h4>
                <form onSubmit={handleSlotSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Temple *</label>
                      <select value={slotForm.templeId} onChange={(e) => setSlotForm({ ...slotForm, templeId: e.target.value })} required>
                        <option value="">Select Temple</option>
                        {temples.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input type="date" value={slotForm.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input type="time" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>End Time *</label>
                      <input type="time" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Pooja Type *</label>
                      <select value={slotForm.poojaType} onChange={(e) => setSlotForm({ ...slotForm, poojaType: e.target.value })}>
                        {['General Darshan', 'Special Darshan', 'VIP Darshan', 'Abhishek', 'Aarti', 'Prasad'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Capacity *</label>
                      <input type="number" value={slotForm.slotCapacity} min={1} onChange={(e) => setSlotForm({ ...slotForm, slotCapacity: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input type="number" value={slotForm.price} min={0} onChange={(e) => setSlotForm({ ...slotForm, price: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">{editSlot ? 'Update' : 'Create'} Slot</button>
                    <button type="button" className="cancel-form-btn" onClick={() => { setShowSlotForm(false); setEditSlot(null); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Temple</th><th>Date</th><th>Time</th><th>Type</th><th>Seats</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s._id}>
                      <td>{s.templeId?.name || 'N/A'}</td>
                      <td>{new Date(s.date).toLocaleDateString('en-IN')}</td>
                      <td>{s.startTime} - {s.endTime}</td>
                      <td>{s.poojaType}</td>
                      <td>{s.availableSeats}/{s.slotCapacity}</td>
                      <td>{s.price === 0 ? 'Free' : `₹${s.price}`}</td>
                      <td className="action-btns">
                        <button className="edit-btn" onClick={() => startEditSlot(s)}><FaEdit /></button>
                        <button className="del-btn" onClick={() => handleDeleteSlot(s._id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="tab-content">
            <div className="tab-header">
              <h3>All Bookings ({bookings.length})</h3>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Ticket</th><th>User</th><th>Temple</th><th>People</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td><code>{b.ticketNumber}</code></td>
                      <td>{b.userId?.name}<br /><small>{b.userId?.email}</small></td>
                      <td>{b.templeId?.name}</td>
                      <td>{b.numberOfPeople}</td>
                      <td>{b.totalAmount === 0 ? 'Free' : `₹${b.totalAmount}`}</td>
                      <td>
                        <span className={`badge-status ${b.bookingStatus === 'Confirmed' ? 'bg-confirmed' : b.bookingStatus === 'Cancelled' ? 'bg-cancelled' : 'bg-pending'}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>{new Date(b.bookingDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
