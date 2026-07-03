const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defines the shape of a user document in MongoDB.
// We never store the plain-text password - only its bcrypt hash.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // this will hold the HASHED password, never plain text
    },
  },
  { timestamps: true }
);

// Mongoose "pre-save" hook: runs automatically right before a user document
// is saved. If the password field was changed (e.g. on registration),
// we hash it with bcrypt before it ever touches the database.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plain-text login password
// against the stored hash. Used during login.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
