import { UserModel } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return sendError(res, 'A user with this email address already exists.', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const insertId = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    // Generate JWT
    const token = generateToken({
      id: insertId,
      email,
      role,
      fullName
    });

    return sendSuccess(res, 'User registered successfully', {
      token,
      user: {
        id: insertId,
        fullName,
        email,
        role
      }
    }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    });

    return sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user attached by auth.middleware.js
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }
    return sendSuccess(res, 'User profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};
