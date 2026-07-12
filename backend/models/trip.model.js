import db from '../config/db.js';

export const TripModel = {
  /**
   * Get all trips with vehicle registration and driver name
   */
  async findAll() {
    const query = `
      SELECT t.*, 
             v.registration_number as vehicle_registration, 
             v.vehicle_name,
             d.full_name as driver_name,
             u.full_name as creator_name
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.id DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  /**
   * Find a trip by ID
   */
  async findById(id) {
    const query = `
      SELECT t.*, 
             v.registration_number as vehicle_registration, 
             v.vehicle_name,
             d.full_name as driver_name,
             u.full_name as creator_name
      FROM trips t
      JOIN vehicles v ON t.vehicle_id = v.id
      JOIN drivers d ON t.driver_id = d.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new DRAFT trip
   */
  async create({ trip_number, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, revenue = 0, created_by }) {
    // Basic verification check before inserting to prevent invalid foreign keys
    // Let's get vehicle details
    const [vehicles] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [vehicle_id]);
    if (vehicles.length === 0) throw new Error('Vehicle not found');
    const vehicle = vehicles[0];

    const [drivers] = await db.execute('SELECT * FROM drivers WHERE id = ?', [driver_id]);
    if (drivers.length === 0) throw new Error('Driver not found');
    const driver = drivers[0];

    // Cargo weight validation against vehicle capacity
    if (Number(cargo_weight) > Number(vehicle.max_load_capacity)) {
      throw new Error(`Cargo weight (${cargo_weight} kg) exceeds vehicle max load capacity (${vehicle.max_load_capacity} kg)`);
    }

    const startOdometer = vehicle.odometer;

    const [result] = await db.execute(
      `INSERT INTO trips 
       (trip_number, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, start_odometer, revenue, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?)`,
      [trip_number, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, startOdometer, revenue, created_by]
    );
    return result.insertId;
  },

  /**
   * Dispatch a trip (updates statuses for trip, vehicle, and driver)
   */
  async dispatch(id, departureTime = new Date()) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [trips] = await connection.execute('SELECT * FROM trips WHERE id = ?', [id]);
      if (trips.length === 0) throw new Error('Trip not found');
      const trip = trips[0];

      if (trip.status !== 'DRAFT') {
        throw new Error(`Cannot dispatch a trip that is in status: ${trip.status}`);
      }

      // Check vehicle availability
      const [vehicles] = await connection.execute('SELECT status, max_load_capacity, odometer FROM vehicles WHERE id = ? FOR UPDATE', [trip.vehicle_id]);
      const vehicle = vehicles[0];
      if (!vehicle) throw new Error('Associated vehicle not found');
      if (vehicle.status !== 'AVAILABLE') {
        throw new Error(`Vehicle is not AVAILABLE (Current status: ${vehicle.status})`);
      }

      // Check driver availability
      const [drivers] = await connection.execute('SELECT status, license_expiry FROM drivers WHERE id = ? FOR UPDATE', [trip.driver_id]);
      const driver = drivers[0];
      if (!driver) throw new Error('Associated driver not found');
      if (driver.status !== 'AVAILABLE') {
        throw new Error(`Driver is not AVAILABLE (Current status: ${driver.status})`);
      }

      // Check license expiration
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const licenseExpiry = new Date(driver.license_expiry);
      licenseExpiry.setHours(0, 0, 0, 0);
      if (licenseExpiry < today) {
        throw new Error('Cannot dispatch: driver has an expired license');
      }

      // Update Trip Status
      await connection.execute(
        "UPDATE trips SET status = 'DISPATCHED', departure_time = ?, start_odometer = ? WHERE id = ?",
        [departureTime, vehicle.odometer, id]
      );

      // Update Vehicle Status
      await connection.execute(
        "UPDATE vehicles SET status = 'ON_TRIP' WHERE id = ?",
        [trip.vehicle_id]
      );

      // Update Driver Status
      await connection.execute(
        "UPDATE drivers SET status = 'ON_TRIP' WHERE id = ?",
        [trip.driver_id]
      );

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Complete a trip (restores availability and updates odometer metrics)
   */
  async complete(id, { actual_distance, fuel_consumed, end_odometer, arrival_time = new Date() }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [trips] = await connection.execute('SELECT * FROM trips WHERE id = ? FOR UPDATE', [id]);
      if (trips.length === 0) throw new Error('Trip not found');
      const trip = trips[0];

      if (trip.status !== 'DISPATCHED') {
        throw new Error(`Cannot complete a trip that is in status: ${trip.status}`);
      }

      if (Number(end_odometer) < Number(trip.start_odometer)) {
        throw new Error(`End odometer (${end_odometer}) cannot be less than start odometer (${trip.start_odometer})`);
      }

      // Update Trip
      await connection.execute(
        `UPDATE trips SET 
          status = 'COMPLETED', 
          actual_distance = ?, 
          fuel_consumed = ?, 
          end_odometer = ?, 
          arrival_time = ? 
         WHERE id = ?`,
        [actual_distance, fuel_consumed, end_odometer, arrival_time, id]
      );

      // Update Vehicle (available again, update odometer)
      await connection.execute(
        "UPDATE vehicles SET status = 'AVAILABLE', odometer = ? WHERE id = ?",
        [end_odometer, trip.vehicle_id]
      );

      // Update Driver (available again)
      await connection.execute(
        "UPDATE drivers SET status = 'AVAILABLE' WHERE id = ?",
        [trip.driver_id]
      );

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Cancel a trip (restores vehicle/driver to available if already dispatched)
   */
  async cancel(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [trips] = await connection.execute('SELECT * FROM trips WHERE id = ? FOR UPDATE', [id]);
      if (trips.length === 0) throw new Error('Trip not found');
      const trip = trips[0];

      if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
        throw new Error(`Cannot cancel a trip that is already ${trip.status}`);
      }

      const wasDispatched = trip.status === 'DISPATCHED';

      // Update Trip
      await connection.execute(
        "UPDATE trips SET status = 'CANCELLED' WHERE id = ?",
        [id]
      );

      if (wasDispatched) {
        // Restore Vehicle
        await connection.execute(
          "UPDATE vehicles SET status = 'AVAILABLE' WHERE id = ?",
          [trip.vehicle_id]
        );

        // Restore Driver
        await connection.execute(
          "UPDATE drivers SET status = 'AVAILABLE' WHERE id = ?",
          [trip.driver_id]
        );
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
