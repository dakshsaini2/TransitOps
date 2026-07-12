import { sendError } from '../utils/response.js';

/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Authentication failed.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired. Please log in again.', 401);
  }

  // MySQL / Database errors
  if (err.code && err.code.startsWith('ER_')) {
    if (err.errno === 1062) {
      return sendError(res, 'Database conflict. A record with this unique value already exists.', 409);
    }
    if (err.errno === 1452) {
      return sendError(res, 'Database relation error. The referenced entity does not exist.', 400);
    }
    return sendError(res, `Database operation failed: ${err.sqlMessage || err.message}`, 500);
  }

  // General app errors
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, status);
};
