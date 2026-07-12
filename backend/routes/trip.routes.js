import express from 'express';
import { getTrips, getTripById, createTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip } from '../controllers/trip.controller.js';
import { validateCreateTrip, validateCompleteTrip } from '../validators/trip.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getTrips);
router.get('/:id', authenticateToken, getTripById);

// Trip dispatch and adjustments typically handled by DISPATCHER, FLEET_MANAGER, ADMIN
const tripOperators = [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER];

router.post(
  '/',
  authenticateToken,
  authorizeRoles(...tripOperators),
  validateCreateTrip,
  validateRequest,
  createTrip
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(...tripOperators),
  validateCreateTrip,
  validateRequest,
  updateTrip
);

router.patch(
  '/:id/dispatch',
  authenticateToken,
  authorizeRoles(...tripOperators),
  dispatchTrip
);

router.patch(
  '/:id/complete',
  authenticateToken,
  authorizeRoles(...tripOperators),
  validateCompleteTrip,
  validateRequest,
  completeTrip
);

router.patch(
  '/:id/cancel',
  authenticateToken,
  authorizeRoles(...tripOperators),
  cancelTrip
);

export default router;
