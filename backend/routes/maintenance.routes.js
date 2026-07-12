import express from 'express';
import { getMaintenanceLogs, createMaintenanceLog, closeMaintenanceLog } from '../controllers/maintenance.controller.js';
import { validateCreateMaintenance, validateCloseMaintenance } from '../validators/maintenance.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getMaintenanceLogs);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER),
  validateCreateMaintenance,
  validateRequest,
  createMaintenanceLog
);

router.patch(
  '/:id/close',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER),
  validateCloseMaintenance,
  validateRequest,
  closeMaintenanceLog
);

export default router;
