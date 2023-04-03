import { Schema, model } from 'mongoose';
import validator from 'validator';

const driverSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide driver name'],
  },
  contact: {
    type: String,
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

const Driver = model('Driver', driverSchema);

export default Driver;
