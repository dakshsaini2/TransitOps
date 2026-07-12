# TransitOps Backend Scaffold

TransitOps is a Node.js + Express + MySQL fleet management and operations backend structured under the MVC (Model-View-Controller) architecture. It manages vehicles, drivers, trips, maintenance, and expenses without an ORM, leveraging SQL transactions for data integrity.

## Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** MySQL via `mysql2/promise` connection pooling
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** bcryptjs (password hashing)
* **Validation:** `express-validator`

---

## Directory Structure

```
backend/
├── config/
│   ├── db.js              # Database pool instance
│   └── env.js              # Environment variable configurations
│
├── controllers/
│   ├── auth.controller.js
│   ├── dashboard.controller.js
│   ├── vehicle.controller.js
│   ├── driver.controller.js
│   ├── trip.controller.js
│   ├── maintenance.controller.js
│   ├── fuel.controller.js
│   ├── expense.controller.js
│   └── report.controller.js
│
├── models/
│   ├── user.model.js
│   ├── vehicle.model.js
│   ├── driver.model.js
│   ├── trip.model.js
│   ├── maintenance.model.js
│   ├── fuel.model.js
│   └── expense.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── vehicle.routes.js
│   ├── driver.routes.js
│   ├── trip.routes.js
│   ├── maintenance.routes.js
│   ├── fuel.routes.js
│   ├── expense.routes.js
│   └── report.routes.js
│
├── middleware/
│   ├── auth.middleware.js       # Authenticates JWT tokens
│   ├── role.middleware.js       # Enforces role permissions
│   ├── validation.middleware.js # Formats express-validator errors
│   ├── error.middleware.js      # Global error and database exception logs handler
│   └── notFound.middleware.js   # 404 endpoint catch-all
│
├── validators/
│   ├── auth.validator.js
│   ├── vehicle.validator.js
│   ├── driver.validator.js
│   ├── trip.validator.js
│   ├── maintenance.validator.js
│   ├── fuel.validator.js
│   └── expense.validator.js
│
├── utils/
│   ├── constants.js       # Statuses, Roles, and Types
│   ├── response.js        # Normalized response generators
│   ├── password.js        # Hashing and comparison helpers
│   ├── jwt.js             # Token generators and decoders
│   └── helpers.js         # Miscellaneous algorithms (like trip number generator)
│
├── database/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Database initial mockup data seed
│
├── app.js                 # Express setups & routers registry
├── server.js              # Startup entry-point & server bootstrapper
├── .env                   # Configuration credentials
├── package.json
└── README.md
```

---

## Getting Started

### 1. Database Setup
Ensure you have a running MySQL server. Log in to the mysql CLI or your client of choice and execute the schema and seed files:

```bash
# Set up tables
mysql -u your_user -p < database/schema.sql

# Seed mockup data
mysql -u your_user -p < database/seed.sql
```

### 2. Environment Configurations
Configure the `.env` file at the root level of `backend/`:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=transitops
JWT_SECRET=your_jwt_signing_key_here
JWT_EXPIRES_IN=24h
```

### 3. Installation
Install all required modules:
```bash
npm install
```

### 4. Running the Server
To run in development mode (using nodemon for reloading):
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

---

## Endpoint API Documentation

All request payloads and query responses return standard JSON.

### 1. Authentication
* **Signup:** `POST /api/auth/signup`
  * Body: `fullName`, `email`, `password`, `role` (Admin/Fleet Manager/Dispatcher/etc.)
* **Login:** `POST /api/auth/login`
  * Body: `email`, `password`
* **Me (Profile):** `GET /api/auth/me` (Auth Required)

### 2. Dashboard
* **Get Dashboard Stats:** `GET /api/dashboard` (Auth Required)
  * Returns counts of active, available, in-shop vehicles, active/pending trips, drivers on-duty, and overall fleet utilization percentage.

### 3. Vehicles
* `GET /api/vehicles` (Auth Required)
* `GET /api/vehicles/:id` (Auth Required)
* `POST /api/vehicles` (Auth Required, FLEET_MANAGER/ADMIN)
* `PUT /api/vehicles/:id` (Auth Required, FLEET_MANAGER/ADMIN)
* `DELETE /api/vehicles/:id` (Auth Required, FLEET_MANAGER/ADMIN)

### 4. Drivers
* `GET /api/drivers` (Auth Required)
* `GET /api/drivers/:id` (Auth Required)
* `POST /api/drivers` (Auth Required, FLEET_MANAGER/ADMIN/SAFETY_OFFICER)
* `PUT /api/drivers/:id` (Auth Required, FLEET_MANAGER/ADMIN/SAFETY_OFFICER)
* `DELETE /api/drivers/:id` (Auth Required, FLEET_MANAGER/ADMIN)

### 5. Trips
* `GET /api/trips` (Auth Required)
* `GET /api/trips/:id` (Auth Required)
* `POST /api/trips` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
* `PUT /api/trips/:id` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
* `PATCH /api/trips/:id/dispatch` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
  * Moves trip status to `DISPATCHED` and vehicle/driver statuses to `ON_TRIP`.
* `PATCH /api/trips/:id/complete` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
  * Body: `actual_distance`, `fuel_consumed`, `end_odometer`, `arrival_time` (optional). Restores vehicle/driver to `AVAILABLE` and increments vehicle odometer.
* `PATCH /api/trips/:id/cancel` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
  * Cancels the trip. If already dispatched, restores vehicle and driver availability status.

### 6. Maintenance
* `GET /api/maintenance` (Auth Required)
* `POST /api/maintenance` (Auth Required, FLEET_MANAGER/ADMIN)
  * Creates an active maintenance log. Sets vehicle status to `IN_SHOP`.
* `PATCH /api/maintenance/:id/close` (Auth Required, FLEET_MANAGER/ADMIN)
  * Body: `cost`, `end_date` (optional). Closes log and restores vehicle status to `AVAILABLE` (unless `RETIRED`).

### 7. Fuel
* `GET /api/fuel` (Auth Required)
* `POST /api/fuel` (Auth Required, FLEET_MANAGER/ADMIN/DISPATCHER)
  * Logs fuel purchase. Updates vehicle odometer if the log's odometer value is higher.

### 8. Expenses
* `GET /api/expenses` (Auth Required)
* `POST /api/expenses` (Auth Required, FLEET_MANAGER/ADMIN/FINANCIAL_ANALYST)
  * Logs toll, parking, or general business expenses.

### 9. Reports
* **Fuel Efficiency:** `GET /api/reports/fuel-efficiency` (Auth Required, FLEET_MANAGER/ADMIN/FINANCIAL_ANALYST)
* **Operational Cost:** `GET /api/reports/operational-cost` (Auth Required, FLEET_MANAGER/ADMIN/FINANCIAL_ANALYST)
* **ROI Report:** `GET /api/reports/roi` (Auth Required, FLEET_MANAGER/ADMIN/FINANCIAL_ANALYST)
