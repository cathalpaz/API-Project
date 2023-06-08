"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://media.istockphoto.com/id/624695614/photo/university-students-doing-group-study.jpg?s=2048x2048&w=is&k=20&c=5eM7yS1ik_JE-U5X6pzCPiainJ_zZJMwxmKMe8EcGaE=",
        preview: true,
      },
      {
        groupId: 1,
        url: "group1img2.png",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://media.istockphoto.com/id/171116218/photo/the-avengers-screening-at-bruin-theater.jpg?s=1024x1024&w=is&k=20&c=fl15hxWnOaLhpZX6QKV3nxp_wXfG_obakjOfVO058BY=",
        preview: true,
      },
      {
        groupId: 2,
        url: "group2img2.png",
        preview: true,
      },
      {
        groupId: 3,
        url: "https://media.istockphoto.com/id/518121042/photo/clean-and-jerk.jpg?s=2048x2048&w=is&k=20&c=bIdBcD-RoV3LiIw6R13q_ZQnOWSUEJMCfaIt310IJ1U=",
        preview: true,
      },
      {
        groupId: 4,
        url: "https://media.istockphoto.com/id/898227924/vector/crowd-of-protesters-people-silhouettes-of-people-with-banners-and-megaphones-concept-of.jpg?s=2048x2048&w=is&k=20&c=soUHt4cEv4-Lq5fbTxy2bxt3Eh1GgWe-MQ2JMhdxki0=",
        preview: true,
      },
      {
        groupId: 4,
        url: "group4img2.png",
        preview: false,
      },
      {
        groupId: 5,
        url: "https://media.istockphoto.com/id/1206031687/vector/people-greeting-gesture-flat-vector-illustrations-set-different-nations-representatives.jpg?s=2048x2048&w=is&k=20&c=nMZyJkqUFdDOQ3MBd2CjqaM6L7EAxNLYSzuTPBLZ9bs=",
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: {
        [Op.in]: [1, 2, 3, 4, 5],
      },
    });
  },
};
