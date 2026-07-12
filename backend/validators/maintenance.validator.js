import { body } from 'express-validator';

export const validateCreateMaintenance = [
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('A valid vehicle ID is required'),
  body('maintenance_type')
    .trim()
    .notEmpty()
    .withMessage('Maintenance type is required')
    .isLength({ max: 100 })
    .withMessage('Maintenance type cannot exceed 100 characters'),
  body('description')
    .optional({ checkFalsy: true })
    .trim(),
  body('cost')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('start_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid date (YYYY-MM-DD)')
];

export const validateCloseMaintenance = [
  body('cost')
    .isFloat({ min: 0 })
    .withMessage('Closing cost is required and must be a non-negative number'),
  body('end_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date (YYYY-MM-DD)')
];
