import db from '../config/db.js';

export const FuelModel = {
  /**
   * Fetch all fuel logs
   */
  async findAll() {
    const query = `
      SELECT f.*, v.registration_number, v.vehicle_name 
      FROM fuel_logs f
      JOIN vehicles v ON f.vehicle_id = v.id
      ORDER BY f.id DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  /**
   * Create a fuel log and update vehicle's odometer if higher
   */
  async create({ vehicle_id, liters, cost, fuel_date, odometer = null }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if vehicle exists
      const [vehicles] = await connection.execute('SELECT odometer FROM vehicles WHERE id = ? FOR UPDATE', [vehicle_id]);
      if (vehicles.length === 0) throw new Error('Vehicle not found');
      const vehicle = vehicles[0];

      // Save fuel log
      const [result] = await connection.execute(
        `INSERT INTO fuel_logs (vehicle_id, liters, cost, fuel_date, odometer) 
         VALUES (?, ?, ?, ?, ?)`,
        [vehicle_id, liters, cost, fuel_date, odometer]
      );

      // Update vehicle odometer if provided and greater
      if (odometer && Number(odometer) > Number(vehicle.odometer)) {
        await connection.execute('UPDATE vehicles SET odometer = ? WHERE id = ?', [odometer, vehicle_id]);
      }

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
};
