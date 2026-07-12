import app from './app.js';
import env from './config/env.js';
import pool from './config/db.js';

const server = app.listen(env.port, () => {
  console.log(`==================================================`);
  console.log(`TransitOps Backend Server started successfully.`);
  console.log(`Listening on: http://localhost:${env.port}`);
  console.log(`Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================`);
});

// Graceful shutdown hooks
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('Express HTTP server terminated.');
    try {
      await pool.end();
      console.log('MySQL database connection pool ended successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MySQL connection pool:', err.message);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
