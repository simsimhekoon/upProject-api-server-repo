const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostImg extends Model {
    static associate(models) {
      this.belongsTo(models.postJoin, { onDelete: "cascade" });
    }
  }
  PostImg.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      img: DataTypes.STRING,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostImg",
    }
  );
  return PostImg;
};
