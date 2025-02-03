const pg = require('pg');
const { Pool } = pg;
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = { query };
