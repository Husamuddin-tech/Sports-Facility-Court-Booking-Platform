require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

// Validate ENV
if (!process.env.MONGODB_URI) {
  console.error("\x1b[31m❌ ERROR: MONGODB_URI is missing in .env file\x1b[0m");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("\x1b[32m✔ MongoDB Connected (Seeding Mode)\x1b[0m");
  } catch (error) {
    console.error("\x1b[31m❌ MongoDB Connection Error:", error.message, "\x1b[0m");
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log("\n\x1b[33m⚠ Clearing Existing Collections...\x1b[0m");
    await Promise.all([
      User.deleteMany({}),
      Court.deleteMany({}),
      Coach.deleteMany({}),
      Equipment.deleteMany({}),
      PricingRule.deleteMany({})
    ]);

    console.log("\x1b[32m✔ Collections Cleared\x1b[0m\n");

    
    // Create Admin + User
    
    console.log("\x1b[36m👉 Creating Users...\x1b[0m");

    const salt = await bcrypt.genSalt(10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@courtbooking.com',
      password: await bcrypt.hash('admin123', salt),
      phone: '+1234567890',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('user123', salt),
      phone: '+1987654321',
      role: 'user'
    });

    console.log("\x1b[32m✔ Users Created\x1b[0m");

    
    // Courts
    
    console.log("\n\x1b[36m👉 Seeding Courts...\x1b[0m");

    await Court.insertMany([
      {
        name: 'Indoor Court A',
        type: 'indoor',
        description: 'Premium indoor court with air conditioning and professional lighting',
        basePrice: 30,
        amenities: ['Air Conditioning', 'Professional Lighting', 'Scoreboard', 'Seating Area'],
        isActive: true
      },
      {
        name: 'Indoor Court B',
        type: 'indoor',
        description: 'Modern indoor court with excellent ventilation',
        basePrice: 30,
        amenities: ['Air Conditioning', 'LED Lighting', 'Sound System'],
        isActive: true
      },
      {
        name: 'Outdoor Court 1',
        type: 'outdoor',
        description: 'Open-air court with natural lighting, perfect for morning sessions',
        basePrice: 20,
        amenities: ['Night Lights', 'Water Fountain', 'Bench Seating'],
        isActive: true
      },
      {
        name: 'Outdoor Court 2',
        type: 'outdoor',
        description: 'Spacious outdoor court with shade covers',
        basePrice: 20,
        amenities: ['Shade Covers', 'Night Lights', 'Locker Access'],
        isActive: true
      }
    ]);

    console.log("\x1b[32m✔ Courts Created\x1b[0m");

    
    // Coaches
    
    console.log("\n\x1b[36m👉 Adding Coaches...\x1b[0m");

    await Coach.insertMany([
      {
        name: 'Coach Michael Johnson',
        email: 'michael@courtbooking.com',
        phone: '+1111222333',
        specialization: 'Singles Strategy',
        experience: 10,
        hourlyRate: 50,
        bio: 'Former national champion...',
        isActive: true
      },
      {
        name: 'Coach Sarah Williams',
        email: 'sarah@courtbooking.com',
        phone: '+1444555666',
        specialization: 'Doubles Tactics',
        experience: 8,
        hourlyRate: 45,
        bio: 'Expert in doubles gameplay...',
        isActive: true
      },
      {
        name: 'Coach David Chen',
        email: 'david@courtbooking.com',
        phone: '+1777888999',
        specialization: 'Beginner Training',
        experience: 5,
        hourlyRate: 35,
        bio: 'Perfect for beginners...',
        isActive: true
      }
    ]);

    console.log("\x1b[32m✔ Coaches Added\x1b[0m");

    
    // Equipment
    
    console.log("\n\x1b[36m👉 Adding Equipment...\x1b[0m");

    await Equipment.insertMany([
      {
        name: 'Professional Racket',
        type: 'racket',
        description: 'High-quality carbon fiber racket',
        totalQuantity: 20,
        pricePerHour: 5,
        isActive: true
      },
      {
        name: 'Beginner Racket',
        type: 'racket',
        description: 'Lightweight racket for beginners',
        totalQuantity: 15,
        pricePerHour: 3,
        isActive: true
      },
      {
        name: 'Court Shoes',
        type: 'shoes',
        description: 'Non-marking court shoes',
        totalQuantity: 25,
        pricePerHour: 4,
        isActive: true
      },
      {
        name: 'Shuttlecock Pack',
        type: 'shuttlecock',
        description: 'Pack of 3 feather shuttlecocks',
        totalQuantity: 50,
        pricePerHour: 2,
        isActive: true
      }
    ]);

    console.log("\x1b[32m✔ Equipment Added\x1b[0m");

    
    // Pricing Rules
    
    console.log("\n\x1b[36m👉 Adding Pricing Rules...\x1b[0m");

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
        isActive: true
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
        isActive: true
      },
      {
        name: 'Indoor Premium',
        type: 'indoor_premium',
        description: 'Extra cost for indoor courts',
        modifierType: 'fixed_addition',
        modifierValue: 5,
        appliesTo: 'indoor',
        priority: 3,
        isActive: true
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
        isActive: true
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
        isActive: true
      }
    ]);

    console.log("\x1b[32m✔ Pricing Rules Added\x1b[0m\n");


    // Summary

    console.log("\x1b[35m===============================");
    console.log("        SEEDING SUMMARY        ");
    console.log("===============================\x1b[0m");

    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Courts: ${await Court.countDocuments()}`);
    console.log(`Coaches: ${await Coach.countDocuments()}`);
    console.log(`Equipment: ${await Equipment.countDocuments()}`);
    console.log(`Pricing Rules: ${await PricingRule.countDocuments()}`);

    console.log("\n\x1b[32m✔ Seeding Completed Successfully!\x1b[0m\n");

    console.log("\x1b[33m=== Test Credentials ===");
    console.log("Admin → admin@courtbooking.com  / admin123");
    console.log("User  → john@example.com        / user123\x1b[0m");

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("\x1b[31m❌ Seeding Error:", error.message, "\x1b[0m");
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();