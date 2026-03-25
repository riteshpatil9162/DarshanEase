const Temple = require('../models/Temple');

// @desc    Get all temples
// @route   GET /api/temples
// @access  Public
const getTemples = async (req, res) => {
  try {
    const { location, search, page = 1, limit = 9 } = req.query;
    const query = { isActive: true };

    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) query.name = { $regex: search, $options: 'i' };

    const total = await Temple.countDocuments(query);
    const temples = await Temple.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      temples,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single temple
// @route   GET /api/temples/:id
// @access  Public
const getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, temple });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create temple
// @route   POST /api/temples
// @access  Admin
const createTemple = async (req, res) => {
  try {
    const { name, location, state, description, openingHours, deity } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || '';

    const temple = await Temple.create({
      name, location, state, description, image, openingHours, deity,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Temple created successfully', temple });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
// @access  Admin
const updateTemple = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const temple = await Temple.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    });

    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, message: 'Temple updated successfully', temple });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete temple
// @route   DELETE /api/temples/:id
// @access  Admin
const deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, message: 'Temple deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTemples, getTempleById, createTemple, updateTemple, deleteTemple };
