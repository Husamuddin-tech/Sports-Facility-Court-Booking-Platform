const mongoose = require("mongoose");

// Reusable time format validator (HH:MM)
const timeValidator = (value) => /^\d{2}:\d{2}$/.test(value);

const coachSchema = new mongoose.Schema(
  {
    // ------------------------------
    // Basic Information
    // -------------------------------
    name: {
      type: String,
      required: [true, "Coach name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]*$/, "Invalid phone format"]
    },

    specialization: {
      type: String,
      trim: true,
      maxlength: [100, "Specialization cannot exceed 100 characters"]
    },

    experience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"]
    },

    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Hourly rate cannot be negative"]
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"]
    },

    image: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // ------------------------------
    // Weekly Availability
    // ------------------------------
    availability: {
      type: Map,
      of: [
        {
          start: {
            type: String,
            validate: [timeValidator, "Invalid start time format (HH:MM)"]
          },
          end: {
            type: String,
            validate: [timeValidator, "Invalid end time format (HH:MM)"]
          }
        }
      ],

      // Default availability (Sunday → Saturday)
      default: new Map([
        ["0", [{ start: "09:00", end: "18:00" }]],
        ["1", [{ start: "06:00", end: "21:00" }]],
        ["2", [{ start: "06:00", end: "21:00" }]],
        ["3", [{ start: "06:00", end: "21:00" }]],
        ["4", [{ start: "06:00", end: "21:00" }]],
        ["5", [{ start: "06:00", end: "21:00" }]],
        ["6", [{ start: "09:00", end: "18:00" }]]
      ])
    }
  },
  {
    timestamps: true
  }
);


//
// --------------------------------------------------------
// 🔹 Pre-validation: ensure all availability slots have end > start
// --------------------------------------------------------
coachSchema.pre("validate", function (next) {
  if (this.availability) {
    for (const [day, slots] of this.availability.entries()) {
      for (const slot of slots) {
        if (!slot.start || !slot.end) continue;

        const [sh, sm] = slot.start.split(":").map(Number);
        const [eh, em] = slot.end.split(":").map(Number);

        if (eh * 60 + em <= sh * 60 + sm) {
          return next(
            new Error(
              `In availability for day ${day}, end time must be after start time`
            )
          );
        }
      }
    }
  }
  next();
});


//
// --------------------------------------------------------
// 🔹 Virtual method: Check if coach is available for a given date + time
// --------------------------------------------------------
coachSchema.methods.isAvailableFor = function (date, startTime, endTime) {
  const day = new Date(date).getDay();
  const slots = this.availability.get(String(day));
  if (!slots) return false;

  const reqStart = parseInt(startTime.replace(":", ""), 10);
  const reqEnd = parseInt(endTime.replace(":", ""), 10);

  return slots.some((slot) => {
    const slotStart = parseInt(slot.start.replace(":", ""), 10);
    const slotEnd = parseInt(slot.end.replace(":", ""), 10);

    return reqStart >= slotStart && reqEnd <= slotEnd;
  });
};


//
// --------------------------------------------------------
// 🔹 Indexes for fast search
// --------------------------------------------------------
coachSchema.index({ isActive: 1 });
coachSchema.index({ hourlyRate: 1 });
coachSchema.index({ specialization: 1 });

module.exports = mongoose.model("Coach", coachSchema);
