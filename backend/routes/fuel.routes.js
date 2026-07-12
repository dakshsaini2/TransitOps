import express from 'express';
import { getFuelLogs, createFuelLog } from '../controllers/fuel.controller.js';
import { validateCreateFuelLog } from '../validators/fuel.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getFuelLogs);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER),
  validateCreateFuelLog,
  validateRequest,
  createFuelLog
);

export default router;
