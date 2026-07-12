import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Global request validation parser middleware
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return sendError(res, 'Validation failed', 400, errorList);
  }
  next();
};
