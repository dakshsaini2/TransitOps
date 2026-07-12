import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

/**
 * Middleware to authenticate requests via JWT
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Access denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // attaches id, email, role, full_name
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token.', 401);
  }
};
