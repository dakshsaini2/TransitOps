import { ExpenseModel } from '../models/expense.model.js';
import { sendSuccess, sendError } from '../utils/response.js';
import db from '../config/db.js';

/**
 * GET /expenses
 */
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await ExpenseModel.findAll();
    return sendSuccess(res, 'Expenses retrieved successfully', expenses);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /expenses
 */
export const createExpense = async (req, res, next) => {
  try {
    const insertId = await ExpenseModel.create(req.body);
    
    const [rows] = await db.execute(
      `SELECT e.*, v.registration_number, v.vehicle_name 
       FROM expenses e 
       JOIN vehicles v ON e.vehicle_id = v.id 
       WHERE e.id = ?`,
      [insertId]
    );

    return sendSuccess(res, 'Expense logged successfully', rows[0], 201);
  } catch (error) {
    if (error.message.includes('not found')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
};
