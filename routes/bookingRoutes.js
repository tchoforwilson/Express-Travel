import { Router } from 'express';
import authController from '../controllers/authController.js';
import bookingController from '../controllers/bookingController.js';

const router = Router();

router.post('/', bookingController.createBooking);

router.use(
  authController.protect,
  authController.restrictTo('manager', 'user')
);

router.get('/', bookingController.getAllBookings);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deletBooking);

export default router;