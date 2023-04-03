import { Schema, model } from 'mongoose';
import validator from 'validator';

const driverSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide driver name'],
  },
  contact: {
    type: Number,
    required: [true, 'Please provide driver contact'],
    validate: [validator.isMobilePhone, 'Please provide a valid contact'],
  },
  photo: String,
  agency: {
    type: Schema.ObjectId,
    ref: 'Agency',
    required: [true, 'Driver must belong to an agency'],
  },
});

// Query middleware
driverSchema.pre(/^find/, function (next) {
  this.populate({ path: 'agency', select: 'name id contact' });
  next();
});

const Driver = model('Driver', driverSchema);

export default Driver;
