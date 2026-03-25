const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple ID is required'],
    },
    donationAmount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: 1,
    },
    paymentId: {
      type: String,
      required: [true, 'Payment ID is required'],
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
