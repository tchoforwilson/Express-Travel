import { Router } from 'express';
import busController from '../controllers/busController.js';
import authController from '../controllers/authController.js';

const router = Router({ mergeParams: true });

// Protect all routes
router.use(authController.protect);

router.use(authController.restrictTo('manager'));

router
  .route('/')
  .get(busController.getAllBuses)
  .post(busController.setBusAgencyId, busController.createBus);

router
  .route('/:id')
  .get(busController.getBus)
  .patch(
    busController.uploadBusImages,
    busController.resizeBusImages,
    busController.updateBus
  )
  .delete(busController.deletBus);

export default router;
