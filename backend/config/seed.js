require('dotenv').config();
const mongoose = require('mongoose');

// Models
const User = require('../models/User');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

// Prevent accidental production seeding
if (process.env.NODE_ENV === 'production') {
  console.error('\x1b[31m❌ Seeding is disabled in production!\x1b[0m');
  process.exit(1);
}

// Ensure Mongo URI exists
if (!process.env.MONGODB_URI) {
  console.error('\x1b[31m❌ Missing MONGODB_URI in .env\x1b[0m');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\x1b[32m✔ MongoDB Connected (Seed Mode)\x1b[0m');
  } catch (err) {
    console.error('\x1b[31m❌ DB Connection Error:', err.message, '\x1b[0m');
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('\n\x1b[33m⚠ Clearing Existing Collections...\x1b[0m');
    await Promise.all([
      User.deleteMany({}),
      Court.deleteMany({}),
      Coach.deleteMany({}),
      Equipment.deleteMany({}),
      PricingRule.deleteMany({}),
    ]);
    console.log('\x1b[32m✔ Collections Cleared\x1b[0m\n');

    // ==========================
    // USERS (NO MANUAL HASHING)
    // ==========================
    await User.create([
      {
        name: 'Admin User',
        email: 'admin@courtbooking.com',
        password: 'admin123',
        phone: '+1234567890',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        phone: '+1987654321',
        role: 'user',
      },
    ]);
    console.log('\x1b[32m✔ Users Created\x1b[0m');

    // COURTS
    await Court.insertMany([
      {
        name: 'Indoor Court A',
        type: 'indoor',
        description:
          'Premium indoor court with air conditioning and professional lighting',
        basePrice: 30,
        amenities: [
          'Air Conditioning',
          'Professional Lighting',
          'Scoreboard',
          'Seating Area',
        ],
        isActive: true,
      },
      {
        name: 'Indoor Court B',
        type: 'indoor',
        description: 'Modern indoor court with excellent ventilation',
        basePrice: 30,
        amenities: ['Air Conditioning', 'LED Lighting', 'Sound System'],
        isActive: true,
      },
      {
        name: 'Outdoor Court 1',
        type: 'outdoor',
        description:
          'Open-air court with natural lighting, perfect for morning sessions',
        basePrice: 20,
        amenities: ['Night Lights', 'Water Fountain', 'Bench Seating'],
        isActive: true,
      },
      {
        name: 'Outdoor Court 2',
        type: 'outdoor',
        description: 'Spacious outdoor court with shade covers',
        basePrice: 20,
        amenities: ['Shade Covers', 'Night Lights', 'Locker Access'],
        isActive: true,
      },
    ]);
    console.log('\x1b[32m✔ Courts Created\x1b[0m');

    // COACHES
    await Coach.insertMany([
      {
        name: 'Coach Michael Johnson',
        email: 'michael@courtbooking.com',
        phone: '+1111222333',
        specialization: 'Singles Strategy',
        experience: 10,
        hourlyRate: 50,
        bio: 'Former national champion...',
        isActive: true,
      },
      {
        name: 'Coach Sarah Williams',
        email: 'sarah@courtbooking.com',
        phone: '+1444555666',
        specialization: 'Doubles Tactics',
        experience: 8,
        hourlyRate: 45,
        bio: 'Expert in doubles gameplay...',
        isActive: true,
      },
      {
        name: 'Coach David Chen',
        email: 'david@courtbooking.com',
        phone: '+1777888999',
        specialization: 'Beginner Training',
        experience: 5,
        hourlyRate: 35,
        bio: 'Perfect for beginners...',
        isActive: true,
      },
    ]);
    console.log('\x1b[32m✔ Coaches Added\x1b[0m');

    // EQUIPMENT
    await Equipment.insertMany([
      {
        name: 'Professional Racket',
        type: 'racket',
        description: 'High-quality carbon fiber racket',
        totalQuantity: 20,
        pricePerHour: 5,
        isActive: true,
      },
      {
        name: 'Beginner Racket',
        type: 'racket',
        description: 'Lightweight racket for beginners',
        totalQuantity: 15,
        pricePerHour: 3,
        isActive: true,
      },
      {
        name: 'Court Shoes',
        type: 'shoes',
        description: 'Non-marking court shoes',
        totalQuantity: 25,
        pricePerHour: 4,
        isActive: true,
      },
      {
        name: 'Shuttlecock Pack',
        type: 'shuttlecock',
        description: 'Pack of 3 feather shuttlecocks',
        totalQuantity: 50,
        pricePerHour: 2,
        isActive: true,
      },
    ]);
    console.log('\x1b[32m✔ Equipment Added\x1b[0m');

    // PRICING RULES
    await PricingRule.insertMany([
      {
        name: 'Peak Hour Surcharge',
        description: 'Higher rates from 6 PM - 9 PM',
        type: 'peak_hour',
        startTime: '18:00',
        endTime: '21:00',
        modifierType: 'multiplier',
        modifierValue: 1.5,
        appliesTo: 'all',
        priority: 10,
        isActive: true,
      },
      {
        name: 'Weekend Rate',
        description: 'Extra charge on weekends',
        type: 'weekend',
        applicableDays: [0, 6],
        modifierType: 'fixed_addition',
        modifierValue: 10,
        appliesTo: 'all',
        priority: 5,
        isActive: true,
      },
      {
        name: 'Indoor Premium',
        type: 'indoor_premium',
        description: 'Extra cost for indoor courts',
        modifierType: 'fixed_addition',
        modifierValue: 5,
        appliesTo: 'indoor',
        priority: 3,
        isActive: true,
      },
      {
        name: 'Early Bird Discount',
        type: 'early_bird',
        description: '6 AM - 9 AM discount',
        startTime: '06:00',
        endTime: '09:00',
        modifierType: 'percentage',
        modifierValue: -15,
        appliesTo: 'all',
        priority: 8,
        isActive: true,
      },
      {
        name: 'Christmas Holiday Rate',
        description: 'Special holiday pricing',
        type: 'holiday',
        specificDates: [new Date('2025-12-25'), new Date('2025-12-26')],
        modifierType: 'multiplier',
        modifierValue: 2,
        appliesTo: 'all',
        priority: 20,
        isActive: true,
      },
    ]);
    console.log('\x1b[32m✔ Pricing Rules Added\x1b[0m\n');

    // SUMMARY
    console.log('\x1b[35m===============================');
    console.log('        SEED SUMMARY');
    console.log('===============================\x1b[0m');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Courts: ${await Court.countDocuments()}`);
    console.log(`Coaches: ${await Coach.countDocuments()}`);
    console.log(`Equipment: ${await Equipment.countDocuments()}`);
    console.log(`Pricing Rules: ${await PricingRule.countDocuments()}`);

    console.log('\x1b[32m✔ Seeding Completed Successfully!\x1b[0m');
    console.log('\x1b[33m=== Test Credentials ===');
    console.log('Admin → admin@courtbooking.com  / admin123');
    console.log('User  → john@example.com        / user123\x1b[0m');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("\x1b[31m❌ Seeding Error:", err.message, "\x1b[0m");
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
