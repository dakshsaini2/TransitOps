import { DriverModel } from '../models/driver.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /drivers
 */
export const getDrivers = async (req, res, next) => {
  try {
    const drivers = await DriverModel.findAll();
    return sendSuccess(res, 'Drivers retrieved successfully', drivers);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /drivers/:id
 */
export const getDriverById = async (req, res, next) => {
  try {
    const driver = await DriverModel.findById(req.params.id);
    if (!driver) {
      return sendError(res, 'Driver not found', 404);
    }
    return sendSuccess(res, 'Driver details retrieved successfully', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /drivers
 */
export const createDriver = async (req, res, next) => {
  try {
    const { license_number } = req.body;
    
    // License numbers are typically unique in a fleet
    const existing = await DriverModel.findByLicenseNumber(license_number);
    if (existing) {
      return sendError(res, `Driver with license number "${license_number}" already registered`, 400);
    }

    const insertId = await DriverModel.create(req.body);
    const createdDriver = await DriverModel.findById(insertId);
    return sendSuccess(res, 'Driver profile created successfully', createdDriver, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /drivers/:id
 */
export const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findById(id);
    if (!driver) {
      return sendError(res, 'Driver not found', 404);
    }

    if (req.body.license_number && req.body.license_number !== driver.license_number) {
      const existing = await DriverModel.findByLicenseNumber(req.body.license_number);
      if (existing) {
        return sendError(res, `Driver with license number "${req.body.license_number}" already registered`, 400);
      }
    }

    await DriverModel.update(id, req.body);
    const updated = await DriverModel.findById(id);
    return sendSuccess(res, 'Driver profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /drivers/:id
 */
export const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findById(id);
    if (!driver) {
      return sendError(res, 'Driver not found', 404);
    }
    await DriverModel.delete(id);
    return sendSuccess(res, 'Driver profile deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
