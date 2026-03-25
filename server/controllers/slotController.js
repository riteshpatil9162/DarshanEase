const DarshanSlot = require('../models/DarshanSlot');

// @desc    Get slots by temple
// @route   GET /api/slots/:templeId
// @access  Public
const getSlotsByTemple = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { templeId: req.params.templeId, isActive: true };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const slots = await DarshanSlot.find(query).sort({ date: 1, startTime: 1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all slots (admin)
// @route   GET /api/slots
// @access  Admin/Organizer
const getAllSlots = async (req, res) => {
  try {
    const slots = await DarshanSlot.find().populate('templeId', 'name location').sort({ date: -1 });
    res.json({ success: true, slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create slot
// @route   POST /api/slots
// @access  Admin/Organizer
const createSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.create(req.body);
    res.status(201).json({ success: true, message: 'Slot created successfully', slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update slot
// @route   PUT /api/slots/:id
// @access  Admin/Organizer
const updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot updated successfully', slot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete slot
// @route   DELETE /api/slots/:id
// @access  Admin/Organizer
const deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSlotsByTemple, getAllSlots, createSlot, updateSlot, deleteSlot };
