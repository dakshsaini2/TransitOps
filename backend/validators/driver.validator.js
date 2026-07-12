import { body } from 'express-validator';
import { DRIVER_STATUS } from '../utils/constants.js';

export const validateDriver = [
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 100 })
    .withMessage('Full name cannot exceed 100 characters'),
  body('license_number')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .isLength({ max: 100 })
    .withMessage('License number cannot exceed 100 characters'),
  body('license_category')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('License category cannot exceed 20 characters'),
  body('license_expiry')
    .notEmpty()
    .withMessage('License expiry date is required')
    .isISO8601()
    .withMessage('License expiry must be a valid date (YYYY-MM-DD)'),
  body('contact_number')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Contact number cannot exceed 20 characters'),
  body('safety_score')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Safety score must be a number between 0 and 100'),
  body('status')
    .optional()
    .trim()
    .isIn(Object.values(DRIVER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(DRIVER_STATUS).join(', ')}`)
];
