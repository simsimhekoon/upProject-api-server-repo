const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const  {
  username, password, database, host, dialect,
} = config;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  logging: false
});

const Member = require('./member')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const RefreshToken = require("./refreshtoken")(sequelize, Sequelize.DataTypes);
const Post = require("./post")(sequelize, Sequelize.DataTypes);
const Comment = require("./comment")(sequelize, Sequelize.DataTypes);
const PostImg = require("./postImg")(sequelize, Sequelize.DataTypes);
const PostJoin = require("./postJoin")(sequelize, Sequelize.DataTypes);
const JoinMember = require("./joinMember")(sequelize, Sequelize.DataTypes);

const db = {};
db.Member = Member;
db.User = User;
db.RefreshToken = RefreshToken;
db.Post = Post;
db.Comment = Comment;
db.PostImg = PostImg;
db.PostJoin = PostJoin;
db.JoinMember = JoinMember;

module.exports = db;
