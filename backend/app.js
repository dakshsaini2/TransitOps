import express from 'express';
import cors from 'cors';

// Middleware imports
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import driverRoutes from './routes/driver.routes.js';
import tripRoutes from './routes/trip.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import fuelRoutes from './routes/fuel.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();

// Standard middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base message route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to the TransitOps API Server!' 
  });
});

// Feature routers
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel', fuelRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

// Fallbacks and error interceptors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
