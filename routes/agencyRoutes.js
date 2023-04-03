import { Router } from 'express';
import authController from '../controllers/authController.js';
import agencyController from '../controllers/agencyController.js';

const router = Router();

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
