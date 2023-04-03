import { Router } from 'express';
import authController from '../controllers/authController.js';
import agencyController from '../controllers/agencyController.js';
import userRouter from './userRoutes.js';
import driverRouter from './driverRoutes.js';
import busRouter from './busRoutes.js';
import travelRouter from './travelRoutes.js';

const router = Router();

// Merge parameters
router.use('/:agencyId/users', userRouter);
router.use('/:agencyId/drivers', driverRouter);
router.use('/:agencyId/buses', busRouter);
router.use('/:agencyId/travels', travelRouter);

// Unprotected route
router.get('/', agencyController.getAllAgencies);
router.get('/:id', agencyController.getAgency);

// Protect and restrict all routes after this
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', agencyController.createAgency);

router
  .route('/:id')
  .patch(
    agencyController.uploadAgencyLogo,
    agencyController.resizeAgencyLogo,
    agencyController.updateAgency
  )
  .delete(agencyController.deleteAgency);

export default router;
