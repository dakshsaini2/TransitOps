import db from '../config/db.js';

export const UserModel = {
  /**
   * Find a user by their email address
   * @param {string} email 
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find a user by their unique ID
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, role, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Create a new user record
   * @param {object} user 
   * @returns {Promise<number>} Inserted record ID
   */
  async create({ fullName, email, password, role }) {
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, password, role]
    );
    return result.insertId;
  },

  /**
   * Update last login timestamp
   * @param {number} id 
   */
  async updateLastLogin(id) {
    await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
  }
};
