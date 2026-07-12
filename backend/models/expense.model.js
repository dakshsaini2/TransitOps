import db from '../config/db.js';

export const ExpenseModel = {
  /**
   * Fetch all logged expenses
   */
  async findAll() {
    const query = `
      SELECT e.*, v.registration_number, v.vehicle_name 
      FROM expenses e
      JOIN vehicles v ON e.vehicle_id = v.id
      ORDER BY e.id DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  },

  /**
   * Create an expense log
   */
  async create({ vehicle_id, expense_type, amount, description, expense_date }) {
    // Check if vehicle exists
    const [vehicles] = await db.execute('SELECT id FROM vehicles WHERE id = ?', [vehicle_id]);
    if (vehicles.length === 0) throw new Error('Vehicle not found');

    const [result] = await db.execute(
      `INSERT INTO expenses (vehicle_id, expense_type, amount, description, expense_date) 
       VALUES (?, ?, ?, ?, ?)`,
      [vehicle_id, expense_type, amount, description, expense_date]
    );
    return result.insertId;
  }
};
