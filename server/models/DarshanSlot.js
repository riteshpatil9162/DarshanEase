const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    slotCapacity: {
      type: Number,
      required: [true, 'Slot capacity is required'],
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    poojaType: {
      type: String,
      required: [true, 'Pooja type is required'],
      enum: ['General Darshan', 'Special Darshan', 'VIP Darshan', 'Abhishek', 'Aarti', 'Prasad'],
      default: 'General Darshan',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Set availableSeats = slotCapacity on creation
darshanSlotSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.slotCapacity;
  }
  next();
});

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);
