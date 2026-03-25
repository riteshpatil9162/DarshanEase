const express = require('express');
const router = express.Router();
const { createDonation, getDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createDonation);
router.get('/', protect, getDonations);

module.exports = router;
