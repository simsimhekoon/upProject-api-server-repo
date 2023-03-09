const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.joinMember, { onDelete: "cascade" });
    }

    // static initHooks(models) {
    //   this.addHook("beforeDestroy", async (postJoin, options) => {
    //     await models.joinMember.destroy({
    //       where: { userId: User.id },
    //     });
    //   });
    // }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.STRING,
      pw: DataTypes.STRING,
      name: DataTypes.STRING,
      emailAddress: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};