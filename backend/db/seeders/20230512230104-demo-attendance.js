"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 1,
        userId: 2,
        status: "waitlist",
      },
      {
        eventId: 2,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 2,
        userId: 2,
        status: "attending",
      },
      {
        eventId: 3,
        userId: 4,
        status: "attending",
      },
      {
        eventId: 3,
        userId: 6,
        status: "attending",
      },
      {
        eventId: 4,
        userId: 4,
        status: "waitlist",
      },
      {
        eventId: 4,
        userId: 5,
        status: "pending",
      },
      {
        eventId: 5,
        userId: 4,
        status: "pending",
      },
      {
        eventId: 6,
        userId: 7,
        status: "waitlist",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      eventId: {
        [Op.in]: [1, 2, 3, 4, 5, 6],
      },
    });
  },
};
