"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: "organizer",
      },
      {
        userId: 1,
        groupId: 2,
        status: "member",
      },
      {
        userId: 2,
        groupId: 1,
        status: "co-host",
      },
      {
        userId: 2,
        groupId: 2,
        status: "organizer",
      },
      {
        userId: 3,
        groupId: 3,
        status: "organizer",
      },
      {
        userId: 3,
        groupId: 2,
        status: "member",
      },
      {
        userId: 4,
        groupId: 3,
        status: "pending",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3, 4],
      },
    });
  },
};
