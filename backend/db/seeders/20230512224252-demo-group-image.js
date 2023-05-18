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
        url: "group1img1.png",
        preview: true,
      },
      {
        groupId: 1,
        url: "group1img2.png",
        preview: true,
      },
      {
        groupId: 2,
        url: "group2img1.png",
        preview: true,
      },
      {
        groupId: 2,
        url: "group2img2.png",
        preview: true,
      },
      {
        groupId: 3,
        url: "group3img1.png",
        preview: true,
      },
      {
        groupId: 4,
        url: "group4img1.png",
        preview: true,
      },
      {
        groupId: 4,
        url: "group4img2.png",
        preview: false,
      },
      {
        groupId: 5,
        url: "group5img1.png",
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
