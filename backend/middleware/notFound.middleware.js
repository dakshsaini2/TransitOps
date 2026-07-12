import { sendError } from '../utils/response.js';

/**
 * Fallback middleware for non-matching endpoints
 */
export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Resource not found: ${req.method} ${req.originalUrl}`, 404);
};
