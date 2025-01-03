const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5434,
    database: 'E-Commerce p1',
  })

const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = { query };
