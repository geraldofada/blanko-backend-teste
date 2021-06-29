const { DataTypes } = require('sequelize');
const yup = require('yup');

const sequelize = require('../database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const UserValidation = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

module.exports = {
  User,
  UserValidation,
};
