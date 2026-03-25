const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Temple = require('../models/Temple');
const DarshanSlot = require('../models/DarshanSlot');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Temple.deleteMany({});
  await DarshanSlot.deleteMany({});

  console.log('Cleared existing data...');

  // Create admin user
  const admin = await User.create({
    name: 'Admin DarshanEase',
    email: 'admin@darshanease.com',
    password: 'admin123',
    role: 'ADMIN',
    phone: '9999999999',
  });

  // Create organizer
  await User.create({
    name: 'Temple Organizer',
    email: 'organizer@darshanease.com',
    password: 'organizer123',
    role: 'ORGANIZER',
    phone: '8888888888',
  });

  // Create test user
  await User.create({
    name: 'Test Devotee',
    email: 'user@darshanease.com',
    password: 'user1234',
    role: 'USER',
    phone: '7777777777',
  });

  console.log('Users created...');

  // Create temples
  const temples = await Temple.insertMany([
    {
      name: 'Tirupati Balaji Temple',
      location: 'Tirupati, Andhra Pradesh',
      state: 'Andhra Pradesh',
      description: 'Sri Venkateswara Temple, also known as Tirumala Temple, is a famous Hindu temple situated in the hill town of Tirumala at Tirupati in Chittoor district of Andhra Pradesh, India.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Tirumala_temple003.jpg/640px-Tirumala_temple003.jpg',
      openingHours: { open: '05:00', close: '23:00' },
      deity: 'Lord Venkateswara',
      createdBy: admin._id,
    },
    {
      name: 'Shirdi Sai Baba Temple',
      location: 'Shirdi, Maharashtra',
      state: 'Maharashtra',
      description: 'The Shirdi Sai Baba Temple is one of the most visited pilgrimage centers in India. Millions of devotees from all faiths visit this temple every year.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Shirdi_Sai_Temple_at_Shirdi.jpg/640px-Shirdi_Sai_Temple_at_Shirdi.jpg',
      openingHours: { open: '04:00', close: '23:00' },
      deity: 'Sai Baba',
      createdBy: admin._id,
    },
    {
      name: 'Vaishno Devi Mandir',
      location: 'Katra, Jammu & Kashmir',
      state: 'Jammu & Kashmir',
      description: 'Vaishno Devi Temple is a Hindu shrine dedicated to Goddess Vaishno Devi located within the Trikuta Mountains in Katra, Jammu.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vaishno_Devi_Shrine.jpg/640px-Vaishno_Devi_Shrine.jpg',
      openingHours: { open: '00:00', close: '23:59' },
      deity: 'Mata Vaishno Devi',
      createdBy: admin._id,
    },
    {
      name: 'Somnath Temple',
      location: 'Somnath, Gujarat',
      state: 'Gujarat',
      description: 'The Somnath Temple is a Hindu temple located in Prabhas Patan near Veraval in Saurashtra, Gujarat, India. It is one of the twelve Jyotirlinga shrines of the Hindu god Shiva.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Somnath_temple_Gujrat.jpg/640px-Somnath_temple_Gujrat.jpg',
      openingHours: { open: '06:00', close: '22:00' },
      deity: 'Lord Shiva',
      createdBy: admin._id,
    },
    {
      name: 'Golden Temple',
      location: 'Amritsar, Punjab',
      state: 'Punjab',
      description: 'The Harmandir Sahib, informally referred to as the Golden Temple, is a Gurdwara located in the city of Amritsar, Punjab, India. It is the preeminent spiritual site of Sikhism.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_amritsar.jpg/640px-Golden_Temple_amritsar.jpg',
      openingHours: { open: '04:00', close: '23:00' },
      deity: 'Waheguru',
      createdBy: admin._id,
    },
    {
      name: 'Kashi Vishwanath Temple',
      location: 'Varanasi, Uttar Pradesh',
      state: 'Uttar Pradesh',
      description: 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. It is located in Vishwanath Gali, Varanasi, Uttar Pradesh, India.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Kashi_Vishwanath_Temple.jpg/640px-Kashi_Vishwanath_Temple.jpg',
      openingHours: { open: '03:00', close: '23:00' },
      deity: 'Lord Shiva',
      createdBy: admin._id,
    },
  ]);

  console.log('Temples created...');

  // Create slots for each temple
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const slotData = [];
  for (const temple of temples) {
    slotData.push(
      {
        templeId: temple._id,
        date: tomorrow,
        startTime: '06:00',
        endTime: '08:00',
        slotCapacity: 100,
        availableSeats: 100,
        poojaType: 'General Darshan',
        price: 0,
      },
      {
        templeId: temple._id,
        date: tomorrow,
        startTime: '10:00',
        endTime: '12:00',
        slotCapacity: 50,
        availableSeats: 50,
        poojaType: 'Special Darshan',
        price: 150,
      },
      {
        templeId: temple._id,
        date: tomorrow,
        startTime: '16:00',
        endTime: '18:00',
        slotCapacity: 20,
        availableSeats: 20,
        poojaType: 'VIP Darshan',
        price: 500,
      },
      {
        templeId: temple._id,
        date: dayAfter,
        startTime: '07:00',
        endTime: '09:00',
        slotCapacity: 80,
        availableSeats: 80,
        poojaType: 'Aarti',
        price: 200,
      }
    );
  }

  await DarshanSlot.insertMany(slotData);
  console.log('Slots created...');

  console.log('\n=== Seed data loaded successfully! ===');
  console.log('Admin: admin@darshanease.com / admin123');
  console.log('Organizer: organizer@darshanease.com / organizer123');
  console.log('User: user@darshanease.com / user1234');

  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
