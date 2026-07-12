import db from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/dashboard
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Gather statistics using parallelized DB promises
    const [vehicleRows] = await db.execute('SELECT status, COUNT(*) as count FROM vehicles GROUP BY status');
    const [tripRows] = await db.execute('SELECT status, COUNT(*) as count FROM trips GROUP BY status');
    const [driverRows] = await db.execute("SELECT COUNT(*) as count FROM drivers WHERE status IN ('AVAILABLE', 'ON_TRIP')");

    // Initialize metrics
    let activeVehicles = 0;     // ON_TRIP
    let availableVehicles = 0;  // AVAILABLE
    let vehiclesInShop = 0;     // IN_SHOP
    
    vehicleRows.forEach(row => {
      if (row.status === 'ON_TRIP') activeVehicles = parseInt(row.count, 10);
      else if (row.status === 'AVAILABLE') availableVehicles = parseInt(row.count, 10);
      else if (row.status === 'IN_SHOP') vehiclesInShop = parseInt(row.count, 10);
    });

    let activeTrips = 0;        // DISPATCHED
    let pendingTrips = 0;       // DRAFT

    tripRows.forEach(row => {
      if (row.status === 'DISPATCHED') activeTrips = parseInt(row.count, 10);
      else if (row.status === 'DRAFT') pendingTrips = parseInt(row.count, 10);
    });

    const driversOnDuty = driverRows[0] ? parseInt(driverRows[0].count, 10) : 0;

    // Fleet utilization = Active Vehicles / (Active + Available + In Shop) * 100
    const totalFleet = activeVehicles + availableVehicles + vehiclesInShop;
    const fleetUtilization = totalFleet > 0 
      ? parseFloat(((activeVehicles / totalFleet) * 100).toFixed(2))
      : 0.00;

    return sendSuccess(res, 'Dashboard metrics compiled successfully', {
      activeVehicles,
      availableVehicles,
      vehiclesInShop,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization
    });
  } catch (error) {
    next(error);
  }
};
