'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("posts", [
      {
        id: 1,
        userId: "관리자",
        name: "관리자",
        title: "관리자의 게시글 입니다.",
        content: "이 글은 관리자의 게시글로서 항상 첫 글로 위치합니다.",
        viewCount: 0,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
