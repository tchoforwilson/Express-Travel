import factory from './handlerFactory.js';
import Booking from '../models/bookingModel.js';

const createBooking = factory.createOne(Booking);
const getBooking = factory.getOne(Booking);
const getAllBookings = factory.getAll(Booking);
const updateBooking = factory.updateOne(Booking);
const deletBooking = factory.deleteOne(Booking);

export default {
  createBooking,
  getBooking,
  getAllBookings,
  updateBooking,
  deletBooking,
};
