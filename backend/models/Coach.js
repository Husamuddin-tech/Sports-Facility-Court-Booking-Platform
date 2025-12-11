const mongoose = require('mongoose');

const timeValidator = (value) => /^\d{2}:\d{2}$/.test(value);

const coachSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
      index: true,
    },
    phone: { type: String, trim: true, match: /^[0-9+\-\s()]*$/ },
    specialization: { type: String, trim: true, maxlength: 100 },
    experience: { type: Number, default: 0, min: 0 },
    hourlyRate: { type: Number, required: true, min: 0 },
    bio: { type: String, trim: true, maxlength: 500 },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    availability: {
      type: Map,
      of: [
        {
          start: {
            type: String,
            validate: [timeValidator, 'Invalid start time'],
          },
          end: { type: String, validate: [timeValidator, 'Invalid end time'] },
        },
      ],
      default: new Map([
        ['0', [{ start: '09:00', end: '18:00' }]],
        ['1', [{ start: '06:00', end: '21:00' }]],
        ['2', [{ start: '06:00', end: '21:00' }]],
        ['3', [{ start: '06:00', end: '21:00' }]],
        ['4', [{ start: '06:00', end: '21:00' }]],
        ['5', [{ start: '06:00', end: '21:00' }]],
        ['6', [{ start: '09:00', end: '18:00' }]],
      ]),
    },
  },
  { timestamps: true }
);

// Async-safe pre-validation
coachSchema.pre('validate', function () {
  if (this.availability) {
    for (const [day, slots] of this.availability.entries()) {
      for (const slot of slots) {
        if (!slot.start || !slot.end) continue;
        const [sh, sm] = slot.start.split(':').map(Number);
        const [eh, em] = slot.end.split(':').map(Number);
        if (eh * 60 + em <= sh * 60 + sm)
          throw new Error(
            `Availability for day ${day}: end must be after start`
          );
      }
    }
  }
});

// Virtual method
coachSchema.methods.isAvailableFor = function (date, startTime, endTime) {
  const day = new Date(date).getDay();
  const slots = this.availability.get(String(day));
  if (!slots) return false;
  const reqStart = parseInt(startTime.replace(':', ''), 10);
  const reqEnd = parseInt(endTime.replace(':', ''), 10);
  return slots.some((slot) => {
    const slotStart = parseInt(slot.start.replace(':', ''), 10);
    const slotEnd = parseInt(slot.end.replace(':', ''), 10);
    return reqStart >= slotStart && reqEnd <= slotEnd;
  });
};

// Indexes
coachSchema.index({ isActive: 1 });
coachSchema.index({ hourlyRate: 1 });
coachSchema.index({ specialization: 1 });

module.exports = mongoose.model('Coach', coachSchema);
