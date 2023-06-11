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
        name: "Detention",
        description: "Not so super duper cool event",
        type: "In person",
        capacity: 10,
        price: 1,
        startDate: "2023-12-01 18:00:00",
        endDate: "2023-12-02 19:00:00",
      },
      {
        venueId: 2,
        groupId: 1,
        name: "After School",
        description: "Super duper cool event",
        type: "In person",
        capacity: 10,
        price: 1,
        startDate: "2023-11-01 18:00:00",
        endDate: "2023-11-01 19:00:00",
      },
      {
        venueId: 1,
        groupId: 2,
        name: "Saving the day",
        description: "Not so fun event",
        type: "In person",
        capacity: 50,
        price: 25,
        startDate: "2024-01-01 14:30:00",
        endDate: "2024-01-02 15:00:00",
      },
      {
        venueId: 2,
        groupId: 3,
        name: "CrossFit",
        description: "Amazing event!",
        type: "Online",
        capacity: 40,
        price: 50,
        startDate: "2023-10-10 16:00:00",
        endDate: "2023-10-10 17:00:00",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Body building",
        description: "Kind of boring event",
        type: "Online",
        capacity: 5,
        price: 0,
        startDate: "2023-08-24 16:00:00",
        endDate: "2023-08-24 17:00:00",
      },
      {
        venueId: 4,
        groupId: 4,
        name: "Event5",
        description: "Demo event",
        type: "Online",
        capacity: 5,
        price: 0,
        startDate: "2023-08-24 16:00:00",
        endDate: "2023-08-24 17:00:00",
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Event6",
        description: "Another demo event",
        type: "In person",
        capacity: 10,
        price: 5,
        startDate: "2023-10-11 16:00:00",
        endDate: "2023-10-11 17:00:00",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ["Detention", "After School", "Event2", "Event3", "Event4", "Event5", "Event6"],
      },
    });
  },
};
