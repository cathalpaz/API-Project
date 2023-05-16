"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    await queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Event1",
        description: "Super duper cool event",
        type: "In person",
        capacity: 10,
        price: 1,
        startDate: "2023-12-01",
        endDate: "2023-12-02",
      },
      {
        venueId: 1,
        groupId: 2,
        name: "Event2",
        description: "Not so fun event",
        type: "In person",
        capacity: 50,
        price: 25,
        startDate: "2024-01-01",
        endDate: "2024-01-02",
      },
      {
        venueId: 2,
        groupId: 3,
        name: "Event3",
        description: "Amazing event!",
        type: "Online",
        capacity: 40,
        price: 50,
        startDate: "2023-10-10",
        endDate: "2023-10-10",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Event4",
        description: "Kind of boring event",
        type: "Online",
        capacity: 5,
        price: 0,
        startDate: "2023-08-24",
        endDate: "2023-08-24",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ["Event1", "Event2", "Event3", "Event4"],
      },
    });
  },
};
