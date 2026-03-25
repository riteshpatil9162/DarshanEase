const express = require('express');
const router = express.Router();
const {
  getSlotsByTemple, getAllSlots, createSlot, updateSlot, deleteSlot,
} = require('../controllers/slotController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/', protect, roleMiddleware('ADMIN', 'ORGANIZER'), getAllSlots);
router.get('/:templeId', getSlotsByTemple);
router.post('/', protect, roleMiddleware('ADMIN', 'ORGANIZER'), createSlot);
router.put('/:id', protect, roleMiddleware('ADMIN', 'ORGANIZER'), updateSlot);
router.delete('/:id', protect, roleMiddleware('ADMIN', 'ORGANIZER'), deleteSlot);

module.exports = router;
