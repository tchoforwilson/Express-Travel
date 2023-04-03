import { Router } from 'express';
import authController from '../controllers/authController.js';
import travelController from '../controllers/travelController.js';

const router = Router({ mergeParams: true });

router.get('/', travelController.getAllTravels);
router.get('/:id', travelController.getTravel);

// PROTECT ROUTE
router.use(authController.protect);
// RESTRICT ROUTE
router.use(authController.restrictTo('manager', 'user'));

router.post(
  '/',
  travelController.setTravelAgencyId,
  travelController.createTravel
);

router
  .route('/:id')
  .patch(travelController.updateTravel)
  .delete(travelController.deletTravel);

export default router;
