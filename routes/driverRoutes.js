import { Router } from 'express';
import driverController from '../controllers/driverController';
import authController from '../controllers/authController';

const router = Router({ mergeParams: true });

router.use(authController.protect);
router.use(authController.restrictTo('manager', 'user'));

router
  .route('/')
  .get(driverController.getAllDrivers)
  .post(
    driverController.uploadDriverPhoto,
    driverController.resizeDriverPhoto,
    driverController.createDriver
  );

router
  .route('/:id')
  .get(driverController.getDriver)
  .patch(
    driverController.uploadDriverPhoto,
    driverController.resizeDriverPhoto,
    driverController.updateDriver
  )
  .delete(authController.restrictTo('manager'), driverController.deleteDriver);

export default router;
