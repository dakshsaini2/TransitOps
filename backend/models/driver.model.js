import db from '../config/db.js';

export const DriverModel = {
  /**
   * Fetch all drivers
   */
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM drivers ORDER BY id DESC');
    return rows;
  },

  /**
   * Find a driver by ID
   */
  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM drivers WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a driver by license number
   */
  async findByLicenseNumber(licenseNumber) {
    const [rows] = await db.execute('SELECT * FROM drivers WHERE license_number = ?', [licenseNumber]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new driver
   */
  async create({ full_name, license_number, license_category, license_expiry, contact_number, safety_score = 100, status = 'AVAILABLE' }) {
    const [result] = await db.execute(
      `INSERT INTO drivers 
       (full_name, license_number, license_category, license_expiry, contact_number, safety_score, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, license_number, license_category, license_expiry, contact_number, safety_score, status]
    );
    return result.insertId;
  },

  /**
   * Update a driver dynamically
   */
  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);

    const [result] = await db.execute(
      `UPDATE drivers SET ${setClauses} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  /**
   * Delete a driver
   */
  async delete(id) {
    const [result] = await db.execute('DELETE FROM drivers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Update a driver's status
   */
  async updateStatus(id, status) {
    const [result] = await db.execute('UPDATE drivers SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  }
};
