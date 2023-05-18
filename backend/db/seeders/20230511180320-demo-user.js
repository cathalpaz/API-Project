"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Steve",
          lastName: "Jobs",
          email: "demo@user.com",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Elon",
          lastName: "Musk",
          email: "user1@user.com",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Mark",
          lastName: "Zuckerberg",
          email: "user2@user.com",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Jeff",
          lastName: "Bezos",
          email: "user3@user.com",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Bill",
          lastName: "Gates",
          email: "user4@user.com",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          firstName: "Mark",
          lastName: "Cuban",
          email: "user5@user.com",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          firstName: "Henry",
          lastName: "Ford",
          email: "user6@user.com",
          username: "FakeUser6",
          hashedPassword: bcrypt.hashSync("password7"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2", "FakeUser3", "FakeUser4", "FakeUser5", "FakeUser6"],
        },
      },
      {}
    );
  },
};
