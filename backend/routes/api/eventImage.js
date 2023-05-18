const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

// Delete an Image for an Event
router.delete('/:imageId', requireAuth, async(req, res) => {
    const image = await EventImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({message: "Event Image couldn't be found"})

    const event = await Event.findByPk(image.eventId)
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (!membership || (membership.status !== 'organizer' && membership.status !== 'co-host')) {
        return res.status(403).json({message: 'Unauthorized to delete this image'})
    }
    await image.destroy()
    return res.json({message: "Successfully deleted"})
})


module.exports = router;
