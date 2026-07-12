import 'dotenv/config';

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'transitops',
  },
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_token_123!@#',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

export default config;
