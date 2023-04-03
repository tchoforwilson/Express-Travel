import { Schema, model } from 'mongoose';
import validator from 'validator';

const agencySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide agency name'],
  },
  contact: {
    type: String,
    unique: [true, 'Contact already exist'],
    validate: [validator.isMobilePhone, 'Please provide a valid contact'],
  },
  address: {
    city: String,
    address_line: String,
  },
  logo: String,
});

agencySchema.index({ name: 1, address: 1 }, { unique: true });

const Agency = model('Agency', agencySchema);

export default Agency;
