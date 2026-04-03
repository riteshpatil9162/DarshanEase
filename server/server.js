const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://darshanease-booking.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for uploaded images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/temples', require('./routes/templeRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'DarshanEase API is running', status: 'OK' });
});

// 404 handler - must be before error handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handler - must be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DarshanEase server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
