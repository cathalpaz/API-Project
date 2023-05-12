"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "event1img.png",
        preview: true,
      },
      {
        eventId: 2,
        url: "event2img.png",
        preview: true,
      },
      {
        eventId: 3,
        url: "event3img.png",
        preview: true,
      },
      {
        eventId: 4,
        url: "event4img.png",
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      eventId: {
        [Op.in]: [1, 2, 3, 4],
      },
    });
  },
};
