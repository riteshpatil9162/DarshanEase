const Donation = require('../models/Donation');

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
const createDonation = async (req, res) => {
  try {
    const { templeId, donationAmount, paymentId, razorpayOrderId, message } = req.body;

    const donation = await Donation.create({
      userId: req.user._id,
      templeId,
      donationAmount,
      paymentId,
      razorpayOrderId,
      message,
      status: 'Completed',
    });

    await donation.populate([
      { path: 'templeId', select: 'name location' },
      { path: 'userId', select: 'name email' },
    ]);

    res.status(201).json({ success: true, message: 'Donation recorded successfully!', donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations (admin) or user's donations
// @route   GET /api/donations
// @access  Private
const getDonations = async (req, res) => {
  try {
    const query = req.user.role === 'ADMIN' ? {} : { userId: req.user._id };
    const donations = await Donation.find(query)
      .populate('templeId', 'name location')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createDonation, getDonations };
