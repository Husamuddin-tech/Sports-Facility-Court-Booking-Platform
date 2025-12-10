const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true
    },

    type: {
      type: String,
      enum: {
        values: ['racket', 'shoes', 'shuttlecock', 'other'],
        message: 'Equipment type must be racket, shoes, shuttlecock, or other'
      },
      required: [true, 'Equipment type is required']
    },

    description: {
      type: String,
      trim: true
    },

    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },

    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Hourly price cannot be negative']
    },

    isActive: {
      type: Boolean,
      default: true
    },

    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Helps fast filtering of available equipment in UI & booking flow
equipmentSchema.index({ isActive: 1, type: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
