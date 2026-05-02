const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // required for Supabase
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL error:', err);
});

const connectDB = async () => {
  const client = await pool.connect();
  client.release();
  logger.info('✅ PostgreSQL connected');
};

const query = (text, params) => pool.query(text, params);

module.exports = { connectDB, query, pool };