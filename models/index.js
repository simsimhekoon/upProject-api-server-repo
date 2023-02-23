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
const Post = require("./post")(sequelize, Sequelize.DataTypes);
const Comment = require("./comment")(sequelize, Sequelize.DataTypes);

const db = {};
db.Member = Member;
db.User = User;
db.RefreshToken = RefreshToken;
db.Post = Post;
db.Comment = Comment;

module.exports = db;
