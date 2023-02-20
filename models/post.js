const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    static associate(models) {
      // define association here
    }
  }
  post.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.STRING,
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      viewCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "post",
    }
  );
  return post;
};