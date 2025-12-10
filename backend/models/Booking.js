const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    
    // Required References
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: [true, "Court is required"],
      index: true,
    },

    
    // Booking Times
    
    date: {
      type: Date,
      required: [true, "Booking date is required"],
      index: true,
    },

    startTime: {
      type: String, // Format: "14:00"
      required: [true, "Start time is required"],
      validate: {
        validator: function (v) {
          return /^\d{2}:\d{2}$/.test(v);
        },
        message: "Start time must be in HH:MM format",
      },
    },

    endTime: {
      type: String, // Format: "15:00"
      required: [true, "End time is required"],
      validate: {
        validator: function (v) {
          return /^\d{2}:\d{2}$/.test(v);
        },
        message: "End time must be in HH:MM format",
      },
    },

    
    // Optional Equipment + Coach
    
    resources: {
      equipment: [
        {
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipment",
          },
          quantity: {
            type: Number,
            min: 1,
            default: 1,
          },
        },
      ],
      coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach",
      },
    },

    
    // Booking Status
    
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "waitlist", "pending"],
      default: "confirmed",
      index: true,
    },

    
    // Pricing Breakdown
    
    pricingBreakdown: {
      basePrice: { type: Number, min: 0, default: 0 },
      courtFee: { type: Number, min: 0, default: 0 },
      equipmentFee: { type: Number, min: 0, default: 0 },
      coachFee: { type: Number, min: 0, default: 0 },

      appliedRules: [
        {
          ruleName: String,
          ruleType: String,
          adjustment: Number,
        },
      ],

      subtotal: { type: Number, min: 0, default: 0 },
      total: {
        type: Number,
        required: [true, "Total price is required"],
        min: [0, "Total price cannot be negative"],
      },
    },

    // User Notes
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    // Waitlist functionality
    waitlistPosition: { type: Number },
    notifiedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// 🔹 Custom Validation: End time must be after start time
bookingSchema.pre("validate", function (next) {
  if (this.startTime && this.endTime) {
    const [sh, sm] = this.startTime.split(":").map(Number);
    const [eh, em] = this.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (end <= start) {
      return next(new Error("End time must be later than start time"));
    }
  }

  next();
});

// 🔹 Virtual Field: Duration in Hours
bookingSchema.virtual("durationHours").get(function () {
  if (!this.startTime || !this.endTime) return null;

  const [sh, sm] = this.startTime.split(":").map(Number);
  const [eh, em] = this.endTime.split(":").map(Number);

  return (eh * 60 + em - (sh * 60 + sm)) / 60;
});


// 🔹 Indexes for Fast Searching / Availability

// Existing indexes:
bookingSchema.index({ court: 1, date: 1, status: 1 });
bookingSchema.index({ "resources.coach": 1, date: 1, status: 1 });
bookingSchema.index({ user: 1, status: 1 });


// Prevent same user from booking 2 overlapping slots on same date

bookingSchema.index(
  { user: 1, court: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: false } // Set to true only if you want strict no-duplicates
);

module.exports = mongoose.model("Booking", bookingSchema);
