const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    startTime: {
      type: String,
      required: true,
      validate: (v) => /^\d{2}:\d{2}$/.test(v),
    },
    endTime: {
      type: String,
      required: true,
      validate: (v) => /^\d{2}:\d{2}$/.test(v),
    },
    resources: {
      equipment: [
        {
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
          quantity: { type: Number, min: 1, default: 1 },
        },
      ],
      coach: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach' },
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'waitlist', 'pending'],
      default: 'confirmed',
      index: true,
    },
    pricingBreakdown: {
      basePrice: { type: Number, min: 0, default: 0 },
      courtFee: { type: Number, min: 0, default: 0 },
      equipmentFee: { type: Number, min: 0, default: 0 },
      coachFee: { type: Number, min: 0, default: 0 },
      appliedRules: [
        { ruleName: String, ruleType: String, adjustment: Number },
      ],
      subtotal: { type: Number, min: 0, default: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    notes: { type: String, trim: true, maxlength: 300 },
    waitlistPosition: { type: Number },
    notifiedAt: { type: Date },
  },
  { timestamps: true }
);

// 🔹 Validate endTime > startTime (async-safe)
bookingSchema.pre('validate', function () {
  if (this.startTime && this.endTime) {
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    if (eh * 60 + em <= sh * 60 + sm)
      throw new Error('End time must be later than start time');
  }
});

// 🔹 Virtual: duration
bookingSchema.virtual('durationHours').get(function () {
  if (!this.startTime || !this.endTime) return null;
  const [sh, sm] = this.startTime.split(':').map(Number);
  const [eh, em] = this.endTime.split(':').map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
});

// Indexes
bookingSchema.index({ court: 1, date: 1, status: 1 });
bookingSchema.index({ 'resources.coach': 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index(
  { user: 1, court: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: false }
);

module.exports = mongoose.model('Booking', bookingSchema);
