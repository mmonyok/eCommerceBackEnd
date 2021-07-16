// Necessary modules to run program.
const Sequelize = require('sequelize');
require('dotenv').config();

// Connects to MySQL.
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
  });

// Exports the connection for use elsewhere.
module.exports = sequelize;