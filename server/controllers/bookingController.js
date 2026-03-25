const Booking = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { templeId, slotId, numberOfPeople, paymentId, razorpayOrderId } = req.body;

    const slot = await DarshanSlot.findById(slotId);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    if (slot.availableSeats < numberOfPeople) {
      return res.status(400).json({ success: false, message: 'Not enough available seats' });
    }

    const totalAmount = slot.price * numberOfPeople;

    const booking = await Booking.create({
      userId: req.user._id,
      templeId,
      slotId,
      numberOfPeople,
      totalAmount,
      paymentId,
      razorpayOrderId,
      bookingStatus: 'Confirmed',
    });

    // Reduce available seats
    slot.availableSeats -= numberOfPeople;
    await slot.save();

    await booking.populate([
      { path: 'templeId', select: 'name location image' },
      { path: 'slotId', select: 'date startTime endTime poojaType price' },
    ]);

    res.status(201).json({ success: true, message: 'Booking confirmed!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('templeId', 'name location image')
      .populate('slotId', 'date startTime endTime poojaType price')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const { templeId } = req.query;
    const query = {};
    if (templeId) query.templeId = templeId;

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('templeId', 'name location')
      .populate('slotId', 'date startTime endTime poojaType')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    // Restore available seats
    const slot = await DarshanSlot.findById(booking.slotId);
    if (slot) {
      slot.availableSeats += booking.numberOfPeople;
      await slot.save();
    }

    booking.bookingStatus = 'Cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, getAllBookings, cancelBooking };
