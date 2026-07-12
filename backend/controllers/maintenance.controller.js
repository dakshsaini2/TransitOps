import { MaintenanceModel } from '../models/maintenance.model.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * GET /maintenance
 */
export const getMaintenanceLogs = async (req, res, next) => {
  try {
    const logs = await MaintenanceModel.findAll();
    return sendSuccess(res, 'Maintenance logs retrieved successfully', logs);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /maintenance
 */
export const createMaintenanceLog = async (req, res, next) => {
  try {
    const insertId = await MaintenanceModel.create(req.body);
    const createdLog = await MaintenanceModel.findById(insertId);
    return sendSuccess(res, 'Maintenance log created. Vehicle status set to IN_SHOP.', createdLog, 201);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * PATCH /maintenance/:id/close
 */
export const closeMaintenanceLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cost, end_date } = req.body;

    await MaintenanceModel.close(id, {
      cost,
      end_date: end_date || new Date()
    });

    const updatedLog = await MaintenanceModel.findById(id);
    return sendSuccess(res, 'Maintenance log closed. Vehicle status restored to AVAILABLE (if not RETIRED).', updatedLog);
  } catch (error) {
    if (error.message.includes('already completed') || error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};
