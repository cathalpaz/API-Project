const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

// Delete an Image for a Group
router.delete('/:imageId', requireAuth, async(req, res) => {
    const image = await GroupImage.findByPk(req.params.imageId)
    if (!image) return res.status(404).json({message: "Group Image couldn't be found"});

    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: image.groupId
        }
    })
    if (!membership || (membership.status !== 'organizer' && membership.status !== 'co-host')) {
        return res.status(403).json({message: 'Unauthorized to delete this image'})
    }
    await image.destroy()
    return res.json({message: "Successfully deleted"})
})


module.exports = router;
