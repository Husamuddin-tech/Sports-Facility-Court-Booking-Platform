const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Rule name is required'],
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    type: {
      type: String,
      enum: [
        'peak_hour',
        'weekend',
        'holiday',
        'indoor_premium',
        'early_bird',
        'custom'
      ],
      required: [true, 'Rule type is required']
    },

    // Time range (for peak hours / early bird)
    startTime: {
      type: String, // "18:00"
      validate: {
        validator: (v) => !v || /^\d{2}:\d{2}$/.test(v),
        message: 'startTime must be in HH:MM format'
      }
    },

    endTime: {
      type: String, // "21:00"
      validate: {
        validator: (v) => !v || /^\d{2}:\d{2}$/.test(v),
        message: 'endTime must be in HH:MM format'
      }
    },

    // Days of week (0-6)
    applicableDays: [
      {
        type: Number,
        min: [0, 'Day must be 0-6'],
        max: [6, 'Day must be 0-6']
      }
    ],

    // Specific dates (holidays)
    specificDates: [
      {
        type: Date
      }
    ],

    // How the rule modifies price
    modifierType: {
      type: String,
      enum: {
        values: [
          'multiplier',
          'fixed_addition',
          'fixed_subtraction',
          'percentage'
        ],
        message:
          'modifierType must be multiplier, fixed_addition, fixed_subtraction, or percentage'
      },
      required: true
    },

    modifierValue: {
      type: Number,
      required: [true, 'Modifier value is required'],
      validate: {
        validator: (v) => typeof v === 'number',
        message: 'Modifier value must be a number'
      }
    },

    // Target court type
    appliesTo: {
      type: String,
      enum: ['all', 'indoor', 'outdoor'],
      default: 'all'
    },

    // Priority (higher is applied later)
    priority: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// ⚡ Indexes for fast rule lookup during pricing calculation
pricingRuleSchema.index({ isActive: 1, type: 1 });
pricingRuleSchema.index({ appliesTo: 1, priority: -1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
