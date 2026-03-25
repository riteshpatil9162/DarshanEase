const express = require('express');
const router = express.Router();
const {
  createBooking, getUserBookings, getAllBookings, cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/', protect, roleMiddleware('ADMIN'), getAllBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
