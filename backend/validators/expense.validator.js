import { body } from 'express-validator';
import { EXPENSE_TYPE } from '../utils/constants.js';

export const validateCreateExpense = [
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('A valid vehicle ID is required'),
  body('expense_type')
    .trim()
    .notEmpty()
    .withMessage('Expense type is required')
    .isIn(Object.values(EXPENSE_TYPE))
    .withMessage(`Expense type must be one of: ${Object.values(EXPENSE_TYPE).join(', ')}`),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .optional({ checkFalsy: true })
    .trim(),
  body('expense_date')
    .notEmpty()
    .withMessage('Expense date is required')
    .isISO8601()
    .withMessage('Expense date must be a valid date (YYYY-MM-DD)')
];
