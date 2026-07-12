import { FuelModel } from '../models/fuel.model.js';
import { sendSuccess, sendError } from '../utils/response.js';
import db from '../config/db.js';

/**
 * GET /fuel
 */
export const getFuelLogs = async (req, res, next) => {
  try {
    const logs = await FuelModel.findAll();
    return sendSuccess(res, 'Fuel logs retrieved successfully', logs);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /fuel
 */
export const createFuelLog = async (req, res, next) => {
  try {
    const insertId = await FuelModel.create(req.body);
    
    const [rows] = await db.execute(
      `SELECT f.*, v.registration_number, v.vehicle_name 
       FROM fuel_logs f 
       JOIN vehicles v ON f.vehicle_id = v.id 
       WHERE f.id = ?`,
      [insertId]
    );

    return sendSuccess(res, 'Fuel log added successfully', rows[0], 201);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};
