"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://d1psgljc389n8q.cloudfront.net/discussions/posts/qHddZMInp",
        preview: true,
      },
      {
        groupId: 1,
        url: "group1img2.png",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://leetcode.com/static/images/LeetCode_Sharing.png",
        preview: true,
      },
      {
        groupId: 2,
        url: "group2img2.png",
        preview: false,
      },
      {
        groupId: 3,
        url: "https://www.digitaltrends.com/wp-content/uploads/2023/03/OpenAI-and-ChatGPT-logos-are-marked-do-not-enter-with-a-red-circle-and-line-symbol.jpg?p=1",
        preview: true,
      },
      {
        groupId: 4,
        url: "https://static.vecteezy.com/system/resources/previews/004/871/788/original/keyboard-keys-ctrl-c-and-ctrl-v-copy-and-paste-the-key-shortcuts-computer-icon-on-yellow-background-free-vector.jpg",
        preview: true,
      },
      {
        groupId: 4,
        url: "group4img2.png",
        preview: false,
      },
      {
        groupId: 5,
        url: "https://media.istockphoto.com/id/898227924/vector/crowd-of-protesters-people-silhouettes-of-people-with-banners-and-megaphones-concept-of.jpg?s=2048x2048&w=is&k=20&c=soUHt4cEv4-Lq5fbTxy2bxt3Eh1GgWe-MQ2JMhdxki0=",
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3, 4, 5],
      },
    });
  },
};
