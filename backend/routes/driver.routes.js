import express from 'express';
import { getDrivers, getDriverById, createDriver, updateDriver, deleteDriver } from '../controllers/driver.controller.js';
import { validateDriver } from '../validators/driver.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getDrivers);
router.get('/:id', authenticateToken, getDriverById);

// Create and update restricted to ADMIN, FLEET_MANAGER, SAFETY_OFFICER
router.post(
  '/',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER),
  validateDriver,
  validateRequest,
  createDriver
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER),
  validateDriver,
  validateRequest,
  updateDriver
);

// Delete restricted to ADMIN, FLEET_MANAGER
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER),
  deleteDriver
);

export default router;
