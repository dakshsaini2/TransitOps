import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate a JWT token for a user
 * @param {object} payload - payload to sign
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

/**
 * Verify a JWT token
 * @param {string} token - token to verify
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
