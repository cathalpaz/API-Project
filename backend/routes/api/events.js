const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

// Get all Events
router.get('/', async(req, res) => {
    const events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    for (let event of events) {
        const numAttending = await Attendance.findAll({
            where: {
                eventId: event.id
            },
        })
        event.dataValues.numAttending = numAttending.length;
        const image = await EventImage.findOne({
            where: {
                eventId: event.id
            }
        })
        event.dataValues.previewImage = image.url
        const group = await Group.findOne({
            where: {
                id: event.groupId
            },
            attributes: ['id', 'name', 'city', 'state']
        })
        event.dataValues.Group = group
        const venue = await Venue.findOne({
            where: {
                id: event.venueId
            },
            attributes: ['id', 'city', 'state']
        })
        event.dataValues.Venue = venue
    }

    res.json({Events: events})
})

// Get details of an Event specified by its id


module.exports = router;
