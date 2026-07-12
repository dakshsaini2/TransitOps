import { body } from 'express-validator';

export const validateCreateFuelLog = [
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('A valid vehicle ID is required'),
  body('liters')
    .isFloat({ min: 0.01 })
    .withMessage('Liters must be a positive number'),
  body('cost')
    .isFloat({ min: 0.01 })
    .withMessage('Cost must be a positive number'),
  body('fuel_date')
    .notEmpty()
    .withMessage('Fuel date is required')
    .isISO8601()
    .withMessage('Fuel date must be a valid date (YYYY-MM-DD)'),
  body('odometer')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Odometer must be a non-negative number')
];
