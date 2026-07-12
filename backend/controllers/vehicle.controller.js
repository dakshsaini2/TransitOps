import { VehicleModel } from '../models/vehicle.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /vehicles
 */
export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleModel.findAll();
    return sendSuccess(res, 'Vehicles retrieved successfully', vehicles);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /vehicles/:id
 */
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await VehicleModel.findById(req.params.id);
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }
    return sendSuccess(res, 'Vehicle details retrieved successfully', vehicle);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /vehicles
 */
export const createVehicle = async (req, res, next) => {
  try {
    const { registration_number } = req.body;
    
    // Enforce unique registration number rule
    const existing = await VehicleModel.findByRegistrationNumber(registration_number);
    if (existing) {
      return sendError(res, `Vehicle with registration number "${registration_number}" already exists`, 400);
    }

    const insertId = await VehicleModel.create(req.body);
    const createdVehicle = await VehicleModel.findById(insertId);
    return sendSuccess(res, 'Vehicle created successfully', createdVehicle, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /vehicles/:id
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }

    // Check unique registration if registration number is being changed
    if (req.body.registration_number && req.body.registration_number !== vehicle.registration_number) {
      const existing = await VehicleModel.findByRegistrationNumber(req.body.registration_number);
      if (existing) {
        return sendError(res, `Vehicle with registration number "${req.body.registration_number}" already exists`, 400);
      }
    }

    await VehicleModel.update(id, req.body);
    const updated = await VehicleModel.findById(id);
    return sendSuccess(res, 'Vehicle updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /vehicles/:id
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }
    await VehicleModel.delete(id);
    return sendSuccess(res, 'Vehicle deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
