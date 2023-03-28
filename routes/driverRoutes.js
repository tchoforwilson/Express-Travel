import { Router } from 'express';
import driverController from '../controllers/driverController';
import authController from '../controllers/authController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(driverController.getAllDrivers)
  .post(
    authController.protect,
    authController.restrictTo('agency'),
    driverController.createDriver
  );

router
  .route('/:id')
  .get(driverController.getDriver)
  .patch(
    authController.protect,
    authController.restrictTo('agency'),
    driverController.updateDriver
  )
  .delete(
    authController.protect,
    authController.restrictTo('agency'),
    driverController.deleteDriver
  );

export default router;
