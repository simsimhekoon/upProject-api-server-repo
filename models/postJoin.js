const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class postJoin extends Model {
    static associate(models) {
      this.hasMany(models.joinMember, { onDelete: "cascade" });
      this.hasMany(models.PostImg, { onDelete: "cascade" });
    }

    // static initHooks(models) {
    //   this.addHook("beforeDestroy", async (postJoin, options) => {
    //     await models.joinMember.destroy({
    //       where: { postId: postJoin.id },
    //     });
    //     await models.PostImg.destroy({
    //       where: { postId: postJoin.id },
    //     });
    //   });
    // }
  }
  postJoin.init(
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
      subtitle: DataTypes.STRING,
      place: DataTypes.STRING,
      content: DataTypes.STRING,
      ps: DataTypes.STRING,
      date: DataTypes.DATE,
      period: DataTypes.DATE,
      limit: DataTypes.INTEGER,
      confirm: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "postJoin",
    }
  );
  return postJoin;
};
