const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Court name is required'],
    trim: true
  },

  type: {
    type: String,
    enum: {
      values: ['indoor', 'outdoor'],
      message: 'Court type must be either indoor or outdoor'
    },
    required: [true, 'Court type is required']
  },

  description: {
    type: String,
    trim: true
  },

  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative']
  },

  isActive: {
    type: Boolean,
    default: true
  },

  amenities: [
    {
      type: String,
      trim: true
    }
  ],

  image: {
    type: String,
    default: ''
  }
},
{
  timestamps: true
});

// Helpful index for querying active courts
courtSchema.index({ isActive: 1, type: 1 });

module.exports = mongoose.model('Court', courtSchema);
