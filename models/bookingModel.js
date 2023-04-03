import { Schema, model } from 'mongoose';
import validator from 'validator';
import Travel from './travelModel.js';

const bookingSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  contact: {
    type: String,
    required: [true, 'Please provide your contact or email'],
    validate: [validator.isMobilePhone, 'Please provide a valid contact'],
  },
  identity: {
    type: String,
    required: [true, 'Please provide us your ID number'],
    length: 7,
  },
  seats: [Number],
  amount: Number,
  status: {
    type: String,
    enum: ['Pending', 'Passed', 'Missed', 'Reschedule'],
    default: 'Pending',
  },
  travel: {
    type: Schema.ObjectId,
    ref: 'Travel',
    required: [true, 'Please choose travel'],
  },
});

// Query Schema
bookingSchema.pre(/^find/, function (next) {
  this.populate({ path: 'travel', select: '-__v' });
  next();
});

// Pre save
bookingSchema.pre('save', async function (next) {
  // Calculate amount
  const travel = await Travel.findById(this.travel);
  this.amount = travel.price * this.seats.length;

  // Update travel available seats
  await Travel.findByIdAndUpdate(this.travel, {
    availableSeats: travel.availableSeats - this.seats.length,
  });
  next();
});

const Booking = model('Booking', bookingSchema);

export default Booking;
