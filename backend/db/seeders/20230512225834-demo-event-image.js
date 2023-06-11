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
        url: "https://media.istockphoto.com/id/182844478/photo/mad-teacher.jpg?s=2048x2048&w=is&k=20&c=bYzxXLGRajCZRYLux0Xzx32RyNyukUe0Rh_wLIo0uU4=",
        preview: true,
      },
      {
        eventId: 2,
        url: "https://media.istockphoto.com/id/472337014/vector/biking-to-school.jpg?s=2048x2048&w=is&k=20&c=h0ppmN3MAzfEZWKHi5AANZnXJYfPnq1gD25Mt_m21e4=",
        preview: true,
      },
      {
        eventId: 3,
        url: "https://media.istockphoto.com/id/1408716657/photo/landing-strip-spaceship-interior-3d-rendering.jpg?s=2048x2048&w=is&k=20&c=rsRqUUWmWYCFVOIy9_KmUVzHx6ZD49Yo1v0terPH2ng=",
        preview: true,
      },
      {
        eventId: 4,
        url: "https://media.istockphoto.com/id/518121042/photo/clean-and-jerk.jpg?s=2048x2048&w=is&k=20&c=bIdBcD-RoV3LiIw6R13q_ZQnOWSUEJMCfaIt310IJ1U=",
        preview: true,
      },
      {
        eventId: 5,
        url: "https://media.istockphoto.com/id/1277242852/photo/holding-weight-and-sitting.jpg?s=2048x2048&w=is&k=20&c=d0xsKp-TW7fgBGzkoP3XBU8s1kOtOWbCKgL6Xu0jnhM=",
        preview: true,
      },
      {
        eventId: 6,
        url: "https://media.istockphoto.com/id/519331452/photo/multi-generation-family-watching-tv-at-home-back-view.jpg?s=2048x2048&w=is&k=20&c=OuaqxsDR-I1yWifL2rG4GS5Oyyc3RKKkcB2Zn9moKjs=",
        preview: false,
      },
      {
        eventId: 7,
        url: "https://media.istockphoto.com/id/1147516791/vector/man-stands-walk-and-run-icon-set-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=DFYrR3p5iXAfw24HmVA-4ldCRDyf3TYAzwZ4HbKat34=",
        preview: false,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      eventId: {
        [Op.in]: [1, 2, 3, 4, 5, 6, 7],
      },
    });
  },
};
