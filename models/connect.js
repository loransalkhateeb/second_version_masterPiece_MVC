const  {Pool}  = require('pg');
const pool = new Pool({
  user: 'postgres',
  password: 'loransalkhateebyazanalkhateeb123456789',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'cleanning_service_db'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};

