import { sendError } from '../utils/response.js';

/**
 * Middleware to restrict route access by role
 * @param {...string} roles Allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'Access denied. No role associated with request.', 403);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Access denied. Insufficient permissions for this resource.', 403);
    }

    next();
  };
};
