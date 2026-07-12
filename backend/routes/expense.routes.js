import express from 'express';
import { getExpenses, createExpense } from '../controllers/expense.controller.js';
import { validateCreateExpense } from '../validators/expense.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

router.get('/', authenticateToken, getExpenses);

router.post(
  '/',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST),
  validateCreateExpense,
  validateRequest,
  createExpense
);

export default router;
