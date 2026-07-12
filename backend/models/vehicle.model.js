import db from '../config/db.js';

export const VehicleModel = {
  /**
   * Fetch all vehicles
   */
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM vehicles ORDER BY id DESC');
    return rows;
  },

  /**
   * Find a vehicle by ID
   */
  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a vehicle by registration number
   */
  async findByRegistrationNumber(registrationNumber) {
    const [rows] = await db.execute('SELECT * FROM vehicles WHERE registration_number = ?', [registrationNumber]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new vehicle
   */
  async create({ registration_number, vehicle_name, model, vehicle_type, max_load_capacity, odometer = 0, acquisition_cost = 0, status = 'AVAILABLE' }) {
    const [result] = await db.execute(
      `INSERT INTO vehicles 
       (registration_number, vehicle_name, model, vehicle_type, max_load_capacity, odometer, acquisition_cost, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [registration_number, vehicle_name, model, vehicle_type, max_load_capacity, odometer, acquisition_cost, status]
    );
    return result.insertId;
  },

  /**
   * Update a vehicle's properties dynamically
   */
  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);

    const [result] = await db.execute(
      `UPDATE vehicles SET ${setClauses} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a vehicle
   */
  async delete(id) {
    const [result] = await db.execute('DELETE FROM vehicles WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Update status of a vehicle
   */
  async updateStatus(id, status) {
    const [result] = await db.execute('UPDATE vehicles SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
};
