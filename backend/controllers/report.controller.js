import db from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /reports/fuel-efficiency
 */
export const getFuelEfficiencyReport = async (req, res, next) => {
  try {
    const query = `
      SELECT v.id as vehicle_id, 
             v.registration_number, 
             v.vehicle_name,
             CAST(COALESCE(SUM(t.actual_distance), 0) AS DECIMAL(10,2)) as total_distance_km,
             CAST(COALESCE(SUM(t.fuel_consumed), 0) AS DECIMAL(10,2)) as total_fuel_liters,
             CASE 
               WHEN SUM(t.fuel_consumed) > 0 THEN ROUND(SUM(t.actual_distance) / SUM(t.fuel_consumed), 2)
               ELSE 0.00
             END as efficiency_km_per_liter
      FROM vehicles v
      LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'COMPLETED'
      GROUP BY v.id, v.registration_number, v.vehicle_name
      ORDER BY efficiency_km_per_liter DESC
    `;
    const [rows] = await db.execute(query);
    return sendSuccess(res, 'Fuel efficiency report compiled successfully', rows);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /reports/operational-cost
 */
export const getOperationalCostReport = async (req, res, next) => {
  try {
    const query = `
      SELECT v.id as vehicle_id,
             v.registration_number,
             v.vehicle_name,
             CAST(COALESCE(e.total_expense, 0) AS DECIMAL(10,2)) as other_and_maintenance_costs,
             CAST(COALESCE(f.total_fuel, 0) AS DECIMAL(10,2)) as fuel_costs,
             CAST((COALESCE(e.total_expense, 0) + COALESCE(f.total_fuel, 0)) AS DECIMAL(10,2)) as total_operational_cost
      FROM vehicles v
      LEFT JOIN (
        SELECT vehicle_id, SUM(amount) as total_expense 
        FROM expenses 
        GROUP BY vehicle_id
      ) e ON v.id = e.vehicle_id
      LEFT JOIN (
        SELECT vehicle_id, SUM(cost) as total_fuel 
        FROM fuel_logs 
        GROUP BY vehicle_id
      ) f ON v.id = f.vehicle_id
      ORDER BY total_operational_cost DESC
    `;
    const [rows] = await db.execute(query);
    return sendSuccess(res, 'Operational cost report compiled successfully', rows);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /reports/roi
 */
export const getRoiReport = async (req, res, next) => {
  try {
    const query = `
      SELECT v.id as vehicle_id,
             v.registration_number,
             v.vehicle_name,
             CAST(COALESCE(v.acquisition_cost, 0) AS DECIMAL(12,2)) as acquisition_cost,
             CAST(COALESCE(t.total_revenue, 0) AS DECIMAL(12,2)) as total_revenue,
             CAST((COALESCE(e.total_expense, 0) + COALESCE(f.total_fuel, 0)) AS DECIMAL(12,2)) as total_expenses,
             CASE 
               WHEN (COALESCE(v.acquisition_cost, 0) + COALESCE(e.total_expense, 0) + COALESCE(f.total_fuel, 0)) > 0 
                 THEN ROUND(
                   (COALESCE(t.total_revenue, 0) / (COALESCE(v.acquisition_cost, 0) + COALESCE(e.total_expense, 0) + COALESCE(f.total_fuel, 0))) * 100, 
                   2
                 )
               ELSE 0.00
             END as roi_percentage
      FROM vehicles v
      LEFT JOIN (
        SELECT vehicle_id, SUM(revenue) as total_revenue 
        FROM trips 
        WHERE status = 'COMPLETED' 
        GROUP BY vehicle_id
      ) t ON v.id = t.vehicle_id
      LEFT JOIN (
        SELECT vehicle_id, SUM(amount) as total_expense 
        FROM expenses 
        GROUP BY vehicle_id
      ) e ON v.id = e.vehicle_id
      LEFT JOIN (
        SELECT vehicle_id, SUM(cost) as total_fuel 
        FROM fuel_logs 
        GROUP BY vehicle_id
      ) f ON v.id = f.vehicle_id
      ORDER BY roi_percentage DESC
    `;
    const [rows] = await db.execute(query);
    return sendSuccess(res, 'ROI report compiled successfully', rows);
  } catch (error) {
    next(error);
  }
};
