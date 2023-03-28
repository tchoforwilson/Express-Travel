import { Schema, model } from 'mongoose';
import validator from 'validator';

const agencySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide agency name'],
  },
  contact: {
    type: Number,
    unique: [true, 'Contact already exist'],
    validate: [validator.isMobilePhone, 'Please provide a valid contact'],
  },
  role: {
    type: String,
    enum: ['admin', 'agency'],
    default: 'agency',
  },
  address: {
    city: String,
    address_line: String,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**
 * @breif middleware to check for password hash
 */
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

/**
 * @breif middleware to check for password change
 */
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

/**
 * @breif Model method to check for correct password
 * @details This is done by comparing the submitted password with the saved password in the collection
 * @param {String} candidatePassword -> User submitted password
 * @param {String} userPassword -> User password in the collection
 */
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * @breif middleware to check for password change time
 * @details check if the password recently change after the user login
 * @param {Date} -> JWTTimestamp -> The JWT time is token
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const Agency = model('Agency', agencySchema);

export default User;
