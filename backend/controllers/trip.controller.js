import { TripModel } from '../models/trip.model.js';
import { generateTripNumber } from '../utils/helpers.js';
import { sendSuccess, sendError } from '../utils/response.js';
import db from '../config/db.js';

/**
 * GET /trips
 */
export const getTrips = async (req, res, next) => {
  try {
    const trips = await TripModel.findAll();
    return sendSuccess(res, 'Trips retrieved successfully', trips);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /trips/:id
 */
export const getTripById = async (req, res, next) => {
  try {
    const trip = await TripModel.findById(req.params.id);
    if (!trip) {
      return sendError(res, 'Trip not found', 404);
    }
    return sendSuccess(res, 'Trip retrieved successfully', trip);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /trips
 */
export const createTrip = async (req, res, next) => {
  try {
    const tripData = {
      ...req.body,
      trip_number: req.body.trip_number || generateTripNumber(),
      created_by: req.user ? req.user.id : null
    };

    const insertId = await TripModel.create(tripData);
    const createdTrip = await TripModel.findById(insertId);
    return sendSuccess(res, 'Trip created successfully in DRAFT status', createdTrip, 201);
  } catch (error) {
    // If our custom validation rules in model throw an error, format nicely as a 400
    if (error.message.includes('exceeds vehicle') || error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * PUT /trips/:id
 */
export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await TripModel.findById(id);
    if (!trip) {
      return sendError(res, 'Trip not found', 404);
    }

    if (trip.status !== 'DRAFT') {
      return sendError(res, 'Only trips in DRAFT status can be modified', 400);
    }

    const keysToUpdate = ['source', 'destination', 'vehicle_id', 'driver_id', 'cargo_weight', 'planned_distance', 'revenue'];
    const fieldsToUpdate = {};
    keysToUpdate.forEach(k => {
      if (req.body[k] !== undefined) {
        fieldsToUpdate[k] = req.body[k];
      }
    });

    if (Object.keys(fieldsToUpdate).length > 0) {
      // Execute simple query update in model
      const keys = Object.keys(fieldsToUpdate);
      const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
      const values = Object.values(fieldsToUpdate);
      values.push(id);
      
      await db.execute(`UPDATE trips SET ${setClauses} WHERE id = ?`, values);
    }

    const updated = await TripModel.findById(id);
    return sendSuccess(res, 'Trip updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /trips/:id/dispatch
 */
export const dispatchTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TripModel.dispatch(id);
    const updatedTrip = await TripModel.findById(id);
    return sendSuccess(res, 'Trip dispatched successfully. Vehicle and driver status set to ON_TRIP.', updatedTrip);
  } catch (error) {
    // Gracefully handle model status/availability checks
    if (error.message.includes('not AVAILABLE') || error.message.includes('expired') || error.message.includes('status')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * PATCH /trips/:id/complete
 */
export const completeTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { actual_distance, fuel_consumed, end_odometer, arrival_time } = req.body;

    await TripModel.complete(id, {
      actual_distance,
      fuel_consumed,
      end_odometer,
      arrival_time: arrival_time || new Date()
    });

    const updatedTrip = await TripModel.findById(id);
    return sendSuccess(res, 'Trip completed successfully. Vehicle and driver availability restored.', updatedTrip);
  } catch (error) {
    if (error.message.includes('cannot be less') || error.message.includes('status')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * PATCH /trips/:id/cancel
 */
export const cancelTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    await TripModel.cancel(id);
    const updatedTrip = await TripModel.findById(id);
    return sendSuccess(res, 'Trip cancelled successfully. Vehicle and driver status restored if dispatched.', updatedTrip);
  } catch (error) {
    if (error.message.includes('already')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};
