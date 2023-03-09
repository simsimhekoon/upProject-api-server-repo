"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("postImgs", "postId", {
      type: Sequelize.INTEGER,
      references: {
        model: "postJoins",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("joinMembers", "postId", {
      type: Sequelize.INTEGER,
      references: {
        model: "postJoins",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addColumn("joinMembers", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("postImgs", "postId");
    await queryInterface.removeColumn("joinMembers", "postId");
    await queryInterface.removeColumn("joinMembers", "userId");
  },
};
