import { Schema, model } from 'mongoose';
import Bus from './busModel.js';

const travelSchema = new Schema(
  {
    departure: {
      type: Date,
      required: [true, 'Please provide bus departure time'],
    },
    nature: {
      type: String,
      enum: {
        values: ['Morning', 'Afternoon', 'Evening', 'Night'],
        message:
          'Departure nature is either Morning, Afternoon, Evening or Night',
      },
    },
    destination: {
      type: String,
      required: [true, 'Please provide destination'],
    },
    type: {
      type: 'String',
      enum: ['VIP', 'Normal'],
      default: 'Normal',
    },
    price: {
      type: Number,
      required: [true, 'Travel must have a price'],
    },
    agency: {
      type: Schema.ObjectId,
      ref: 'Agency',
      required: [true, 'Travel must belong to an agency'],
    },
    bus: {
      type: Schema.ObjectId,
      ref: 'Bus',
      required: [true, 'Please select bus'],
    },
    driver: {
      type: Schema.ObjectId,
      ref: 'Driver',
    },
    availableSeats: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

travelSchema.pre('save', async function (next) {
  // 1. Determine travel nature from date
  let now = new Date(this.departure);
  let value = '';
  // TODO: Use lodash or greeting-time for this
  if (now.getHours() > 5 && now.getHours() <= 12) value = 'Morning';
  if (now.getHours() > 12 && now.getHours() <= 18) value = 'Afternoon';
  if (now.getHours() > 18 && now.getHours() <= 22) value = 'Evening';
  if (now.getHours() > 22 && now.getHours() <= 5) value = 'Night';
  this.nature = value;

  // 2. Determine available seats from bus
  const bus = await Bus.findById(this.bus);
  this.availableSeats = bus.seats;
  next();
});

// QUERY MIDDLEWARE
travelSchema.pre(/^find/, function (next) {
  this.populate({ path: 'agency', select: 'name contact logo' });
  this.populate({ path: 'bus', select: 'code seats' });
  next();
});

const Travel = model('Travel', travelSchema);

export default Travel;
