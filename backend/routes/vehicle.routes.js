import express from 'express';
import { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from '../controllers/vehicle.controller.js';
import { validateVehicle } from '../validators/vehicle.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getVehicles);
router.get('/:id', authenticateToken, getVehicleById);

// Create, Update, Delete restricted to ADMIN and FLEET_MANAGER
router.post(
  '/', 
  authenticateToken, 
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), 
  validateVehicle, 
  validateRequest, 
  createVehicle
);

router.put(
  '/:id', 
  authenticateToken, 
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), 
  validateVehicle, 
  validateRequest, 
  updateVehicle
);

router.delete(
  '/:id', 
  authenticateToken, 
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), 
  deleteVehicle
);

export default router;
