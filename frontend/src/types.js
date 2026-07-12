/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} password
 * @property {'ADMIN' | 'FLEET_MANAGER' | 'DISPATCHER' | 'SAFETY_OFFICER' | 'FINANCIAL_ANALYST'} role
 * @property {boolean} is_active
 * @property {string|null} last_login - DATETIME string
 * @property {string} created_at - TIMESTAMP string
 * @property {string} updated_at - TIMESTAMP string
 */

/**
 * @typedef {Object} Vehicle
 * @property {number} id
 * @property {string} registration_number
 * @property {string} vehicle_name
 * @property {string|null} model
 * @property {string|null} vehicle_type
 * @property {number} max_load_capacity
 * @property {number} odometer
 * @property {number|null} acquisition_cost
 * @property {'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED'} status
 * @property {string} created_at - TIMESTAMP string
 * @property {string} updated_at - TIMESTAMP string
 */

/**
 * @typedef {Object} Driver
 * @property {number} id
 * @property {string} full_name
 * @property {string} license_number
 * @property {string|null} license_category
 * @property {string} license_expiry - DATE string
 * @property {string|null} contact_number
 * @property {number} safety_score
 * @property {'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED'} status
 * @property {string} created_at - TIMESTAMP string
 * @property {string} updated_at - TIMESTAMP string
 */

/**
 * @typedef {Object} Trip
 * @property {number} id
 * @property {string|null} trip_number
 * @property {string} source
 * @property {string} destination
 * @property {number} vehicle_id
 * @property {number} driver_id
 * @property {number|null} created_by
 * @property {number} cargo_weight
 * @property {number|null} planned_distance
 * @property {number|null} actual_distance
 * @property {number|null} fuel_consumed
 * @property {number|null} start_odometer
 * @property {number|null} end_odometer
 * @property {number} revenue
 * @property {string|null} departure_time - DATETIME string
 * @property {string|null} arrival_time - DATETIME string
 * @property {'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED'} status
 * @property {string} created_at - TIMESTAMP string
 * @property {string} updated_at - TIMESTAMP string
 */

/**
 * @typedef {Object} MaintenanceLog
 * @property {number} id
 * @property {number} vehicle_id
 * @property {string|null} maintenance_type
 * @property {string|null} description
 * @property {number|null} cost
 * @property {string|null} start_date - DATE string
 * @property {string|null} end_date - DATE string
 * @property {'ACTIVE' | 'COMPLETED'} status
 * @property {string} created_at - TIMESTAMP string
 */

/**
 * @typedef {Object} FuelLog
 * @property {number} id
 * @property {number} vehicle_id
 * @property {number} liters
 * @property {number} cost
 * @property {string} fuel_date - DATE string
 * @property {number|null} odometer
 * @property {string} created_at - TIMESTAMP string
 */

/**
 * @typedef {Object} Expense
 * @property {number} id
 * @property {number} vehicle_id
 * @property {'TOLL' | 'MAINTENANCE' | 'PARKING' | 'OTHER' | null} expense_type
 * @property {number} amount
 * @property {string|null} description
 * @property {string|null} expense_date - DATE string
 * @property {string} created_at - TIMESTAMP string
 */

export {};
