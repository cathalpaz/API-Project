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
        userId: 1,
        groupId: 6,
        status: "member",
      },
      {
        userId: 2,
        groupId: 2,
        status: "organizer",
      },
      {
        userId: 2,
        groupId: 1,
        status: "co-host",
      },
      {
        userId: 2,
        groupId: 5,
        status: "pending",
      },
      {
        userId: 2,
        groupId: 6,
        status: "member",
      },
      {
        userId: 2,
        groupId: 5,
        status: "member",
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
        userId: 3,
        groupId: 6,
        status: "member",
      },
      {
        userId: 4,
        groupId: 4,
        status: "organizer",
      },
      {
        userId: 4,
        groupId: 3,
        status: "member",
      },
      {
        userId: 5,
        groupId: 7,
        status: "organizer",
      },
      {
        userId: 5,
        groupId: 1,
        status: "pending",
      },
      {
        userId: 6,
        groupId: 5,
        status: "organizer",
      },
      {
        userId: 6,
        groupId: 7,
        status: "member",
      },
      {
        userId: 6,
        groupId: 4,
        status: "member",
      },
      {
        userId: 7,
        groupId: 6,
        status: "organizer",
      },
      {
        userId: 7,
        groupId: 1,
        status: "member",
      },
      {
        userId: 7,
        groupId: 3,
        status: "co-host",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: {
        [Op.in]: [1, 2, 3, 4, 5, 6, 7],
      },
    });
  },
};
