"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: "The Breakfast Club",
        about:
          "A group of highschool students in detention on a Saturday morning.",
        type: "In person",
        private: true,
        city: "Los Angeles",
        state: "CA",
      },
      {
        organizerId: 2,
        name: "The Avengers",
        about:
          "Superheroes from around the galaxy that come together to fight off world threats.",
        type: "Online",
        private: true,
        city: "New York",
        state: "NY",
      },
      {
        organizerId: 3,
        name: "Gym Enthusiasts",
        about:
          "A group for people who love lifting weights, open to bodybuilders, powerlifters, etc.",
        type: "In person",
        private: false,
        city: "Miami",
        state: "FL",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ["The Breakfast Club", "The Avengers", "Gym Enthusiasts"],
      },
    });
  },
};
