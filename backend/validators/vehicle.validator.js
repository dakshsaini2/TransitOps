import { body } from 'express-validator';
import { VEHICLE_STATUS } from '../utils/constants.js';

export const validateVehicle = [
  body('registration_number')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required')
    .isLength({ max: 50 })
    .withMessage('Registration number cannot exceed 50 characters'),
  body('vehicle_name')
    .trim()
    .notEmpty()
    .withMessage('Vehicle name is required')
    .isLength({ max: 100 })
    .withMessage('Vehicle name cannot exceed 100 characters'),
  body('model')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Model cannot exceed 100 characters'),
  body('vehicle_type')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Vehicle type cannot exceed 50 characters'),
  body('max_load_capacity')
    .notEmpty()
    .withMessage('Max load capacity is required')
    .isFloat({ min: 0 })
    .withMessage('Max load capacity must be a non-negative number'),
  body('odometer')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Odometer must be a non-negative number'),
  body('acquisition_cost')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Acquisition cost must be a non-negative number'),
  body('status')
    .optional()
    .trim()
    .isIn(Object.values(VEHICLE_STATUS))
    .withMessage(`Status must be one of: ${Object.values(VEHICLE_STATUS).join(', ')}`)
];
