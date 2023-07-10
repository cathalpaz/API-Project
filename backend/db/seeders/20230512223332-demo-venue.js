"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Venues";
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "123 Demo St",
        city: "Los Angeles",
        state: "CA",
        lat: 23.5315,
        lng: 572.6221,
      },
      {
        groupId: 2,
        address: "98 Stark Ave",
        city: "New York",
        state: "NY",
        lat: 512.7118,
        lng: 31.3483,
      },
      {
        groupId: 2,
        address: "47 Tony St",
        city: "Buffalo",
        state: "NY",
        lat: 33.4221,
        lng: 512.0191,
      },
      {
        groupId: 3,
        address: "01 Bradley St",
        city: "Miami",
        state: "FL",
        lat: 89.1234,
        lng: 121.5678,
      },
      {
        groupId: 3,
        address: "12 Bumstead Rd",
        city: "Orlando",
        state: "FL",
        lat: 312.1241,
        lng: 18.6161,
      },
      {
        groupId: 4,
        address: "Demo St",
        city: "Chicago",
        state: "IL",
        lat: 122.4151,
        lng: 49.1241,
      },
      {
        groupId: 5,
        address: "Demo Ave",
        city: "Honolulu",
        state: "HI",
        lat: 511.0191,
        lng: 73.5114,
      },
      {
        groupId: 6,
        address: "121 Chestnut St",
        city: "Brooklyn",
        state: "NY",
        lat: 51.2151,
        lng: 33.4514,
      },
      {
        groupId: 7,
        address: "9 Broadway Ave",
        city: "Atlanta",
        state: "GA",
        lat: 12.3141,
        lng: 41.7388,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3, 4, 5, 6, 7],
      },
    });
  },
};
