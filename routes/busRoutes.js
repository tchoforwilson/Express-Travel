import { Router } from 'express';
import busController from '../controllers/busController';
import authController from '../controllers/authController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(busController.getAllBuses)
  .post(
    authController.protect,
    authController.restrictTo('agency'),
    busController.createBus
  );

router
  .route('/:id')
  .get(busController.getBus)
  .patch(
    authController.protect,
    authController.restrictTo('agency'),
    busController.uploadBusImages,
    busController.resizeBusImages,
    busController.updateBus
  )
  .delete(
    authController.protect,
    authController.restrictTo('agency'),
    busController.deletBus
  );

export default Router;
