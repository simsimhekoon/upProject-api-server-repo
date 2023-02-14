const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const  {
  username, password, database, host, dialect,
} = config;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const Member = require('./member')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const RefreshToken = require("./refreshtoken")(sequelize, Sequelize.DataTypes);

const db = {};
db.Member = Member;
db.User = User;
db.RefreshToken = RefreshToken;

module.exports = db;
