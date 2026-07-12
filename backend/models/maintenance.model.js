import db from '../config/db.js';

export const MaintenanceModel = {
  /**
   * Get all maintenance logs
   */
  async findAll() {
    const query = `
      SELECT m.*, v.registration_number, v.vehicle_name 
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      ORDER BY m.id DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  /**
   * Find a maintenance log by ID
   */
  async findById(id) {
    const query = `
      SELECT m.*, v.registration_number, v.vehicle_name 
      FROM maintenance_logs m
      JOIN vehicles v ON m.vehicle_id = v.id
      WHERE m.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create active maintenance log and set vehicle to IN_SHOP
   */
  async create({ vehicle_id, maintenance_type, description, cost = null, start_date = new Date() }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if vehicle exists
      const [vehicles] = await connection.execute('SELECT status FROM vehicles WHERE id = ? FOR UPDATE', [vehicle_id]);
      if (vehicles.length === 0) throw new Error('Vehicle not found');

      // Create log
      const [result] = await connection.execute(
        `INSERT INTO maintenance_logs (vehicle_id, maintenance_type, description, cost, start_date, status) 
         VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
        [vehicle_id, maintenance_type, description, cost, start_date]
      );

      // Set vehicle status to IN_SHOP
      await connection.execute('UPDATE vehicles SET status = "IN_SHOP" WHERE id = ?', [vehicle_id]);

      // Add to expenses table automatically (optional, but good since maintenance is an expense type)
      if (cost && cost > 0) {
        await connection.execute(
          `INSERT INTO expenses (vehicle_id, expense_type, amount, description, expense_date) 
           VALUES (?, 'MAINTENANCE', ?, ?, ?)`,
          [vehicle_id, cost, `Maintenance: ${maintenance_type}`, start_date]
        );
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Close an active maintenance log and restore vehicle status to AVAILABLE (unless RETIRED)
   */
  async close(id, { cost, end_date = new Date() }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get maintenance record
      const [logs] = await connection.execute('SELECT * FROM maintenance_logs WHERE id = ? FOR UPDATE', [id]);
      if (logs.length === 0) throw new Error('Maintenance log not found');
      const log = logs[0];

      if (log.status === 'COMPLETED') {
        throw new Error('Maintenance log is already completed');
      }

      // Update maintenance log
      await connection.execute(
        'UPDATE maintenance_logs SET status = "COMPLETED", cost = ?, end_date = ? WHERE id = ?',
        [cost, end_date, id]
      );

      // Fetch vehicle status
      const [vehicles] = await connection.execute('SELECT status FROM vehicles WHERE id = ? FOR UPDATE', [log.vehicle_id]);
      const vehicle = vehicles[0];

      if (vehicle && vehicle.status !== 'RETIRED') {
        await connection.execute('UPDATE vehicles SET status = "AVAILABLE" WHERE id = ?', [log.vehicle_id]);
      }

      // Log/Update expense log with the final cost
      await connection.execute(
        `INSERT INTO expenses (vehicle_id, expense_type, amount, description, expense_date) 
         VALUES (?, 'MAINTENANCE', ?, ?, ?)`,
        [log.vehicle_id, cost, `Completed Maintenance ID: ${id} - ${log.maintenance_type}`, end_date]
      );

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
