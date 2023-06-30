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
        name: "App Academy",
        about:
          "For students embarking on a wild and adventurous journey into the realm of full-stack development. From front-end sorcery with HTML, CSS, and JavaScript to back-end wizardry with databases and server-side scripting, they master the art of weaving together the threads of code across the entire tech tapestry.",
        type: "In person",
        private: true,
        city: "Los Angeles",
        state: "CA",
      },
      {
        organizerId: 2,
        name: "LeetCoders",
        about:
          "A group of fearless programmers immerse themselves in the world of algorithmic challenges. Armed with their coding swords, they tackle mind-bending LeetCode problems. These Leet Coders level up their problem-solving skills and forge bonds that can withstand any coding challenge.",
        type: "Online",
        private: true,
        city: "New York",
        state: "NY",
      },
      {
        organizerId: 3,
        name: "ChatGPT Haters",
        about:
          "A group of self-proclaimed Chat GPT haters. They passionately debate the merits and limitations of AI language models, expressing their skepticism with colorful flair. They explore alternative approaches to language processing and build a strong community that challenges the status quo with wit and conviction.",
        type: "In person",
        private: false,
        city: "Miami",
        state: "FL",
      },
      {
        organizerId: 4,
        name: "Ctrl+C, Crtl+V",
        about:
          "A group mastering in the art of efficiency by embracing the power of copy and paste. With lightning-fast fingers, our group of developers conquers tasks with rapid-fire copy-pasting skills. Together, we explore the realms of DRY programming, uniting the forces of speed and effectiveness in the world of coding.",
        type: "Online",
        private: false,
        city: "Chicago",
        state: "IL",
      },
      {
        organizerId: 5,
        name: "Demo Group",
        about:
          "A demo group for testing with random characters to fill the character limit. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nibh ipsum consequat nisl vel. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum.",
        type: "In person",
        private: true,
        city: "Seattle",
        state: "WA",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ["App Academy", "LeetCoders", "ChatGPT Haters", "Ctrl+C, Crtl+V", "Demo Group"],
      },
    });
  },
};
