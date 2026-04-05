require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'password123',
      },
    ]);
    console.log('Created test users');

    // Create some sample bookings for today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    await Booking.create([
      {
        user: users[0]._id,
        date: formatDate(today),
        timeSlot: '9:00 AM - 10:00 AM',
        status: 'confirmed',
      },
      {
        user: users[1]._id,
        date: formatDate(today),
        timeSlot: '2:00 PM - 3:00 PM',
        status: 'confirmed',
      },
      {
        user: users[2]._id,
        date: formatDate(tomorrow),
        timeSlot: '10:00 AM - 11:00 AM',
        status: 'confirmed',
      },
      {
        user: users[0]._id,
        date: formatDate(tomorrow),
        timeSlot: '4:00 PM - 5:00 PM',
        status: 'confirmed',
      },
    ]);
    console.log('Created sample bookings');

    console.log('\nSeed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('  Email: alice@example.com  |  Password: password123');
    console.log('  Email: bob@example.com    |  Password: password123');
    console.log('  Email: charlie@example.com|  Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
