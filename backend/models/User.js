const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/.test(
            v
          ),
        message: 'Invalid email format'
      }
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || /^[0-9+\-() ]{7,20}$/.test(v),
        message: 'Invalid phone number'
      }
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/* ======================================================
    🔐 PASSWORD HASHING
====================================================== */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if new/updated

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* ======================================================
    🔍 PASSWORD MATCHING (for login)
====================================================== */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/* ======================================================
    🧹 REMOVE PASSWORD IN API RESPONSES
====================================================== */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/* ======================================================
    ⚡ Indexes
====================================================== */
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
