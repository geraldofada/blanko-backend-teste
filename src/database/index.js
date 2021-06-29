const { Sequelize } = require('sequelize');

const User = require('../models/users')

const sequelize = new Sequelize(process.env.JAWSDB_MARIA_URL, {
  define: {
    underscored: true,
  }
});

module.exports = sequelize;
