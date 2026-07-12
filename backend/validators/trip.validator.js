import { body } from 'express-validator';

export const validateCreateTrip = [
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source destination is required')
    .isLength({ max: 150 })
    .withMessage('Source location cannot exceed 150 characters'),
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required')
    .isLength({ max: 150 })
    .withMessage('Destination cannot exceed 150 characters'),
  body('vehicle_id')
    .isInt({ min: 1 })
    .withMessage('A valid vehicle ID is required'),
  body('driver_id')
    .isInt({ min: 1 })
    .withMessage('A valid driver ID is required'),
  body('cargo_weight')
    .isFloat({ min: 0.01 })
    .withMessage('Cargo weight must be a positive number'),
  body('planned_distance')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Planned distance must be a non-negative number'),
  body('revenue')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Revenue must be a non-negative number'),
  body('start_odometer')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Start odometer must be a non-negative number'),
  body('departure_time')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Departure time must be a valid date string')
];

export const validateCompleteTrip = [
  body('actual_distance')
    .isFloat({ min: 0.01 })
    .withMessage('Actual distance must be a positive number'),
  body('fuel_consumed')
    .isFloat({ min: 0.01 })
    .withMessage('Fuel consumed must be a positive number'),
  body('end_odometer')
    .isFloat({ min: 0.01 })
    .withMessage('End odometer must be a positive number'),
  body('arrival_time')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Arrival time must be a valid date string')
];
