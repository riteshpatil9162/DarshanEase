const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getTemples, getTempleById, createTemple, updateTemple, deleteTemple,
} = require('../controllers/templeController');
const { protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `temple-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getTemples);
router.get('/:id', getTempleById);
router.post('/', protect, roleMiddleware('ADMIN'), upload.single('image'), createTemple);
router.put('/:id', protect, roleMiddleware('ADMIN'), upload.single('image'), updateTemple);
router.delete('/:id', protect, roleMiddleware('ADMIN'), deleteTemple);

module.exports = router;
