import { Schema, model } from 'mongoose';

const busSchema = new Schema({
  code: {
    type: String,
    unique: [true, 'Bus already exist'],
    required: [true, 'Bus must have a plate number'],
  },
  seats: {
    type: Number,
    required: [true, 'Please provide number of seats in Bust'],
  },
  images: [String],
  agency: {
    type: Schema.ObjectId,
    ref: 'Agency',
    required: [true, 'Bus must belong to an agency'],
  },
});

const Bus = model('Bus', busSchema);

export default Bus;
