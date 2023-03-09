const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class joinMember extends Model {
    static associate(models) {
      this.belongsTo(models.postJoin, { onDelete: "cascade" });
      this.belongsTo(models.User, { onDelete: "cascade" });
    }
  }
  joinMember.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "joinMember",
    }
  );
  return joinMember;
};
