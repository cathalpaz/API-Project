const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')


// Edit a Venue specified by its id
router.put('/:venueId', requireAuth, async(req, res) => {
    const { address, city, state, lat, lng } = req.body
    const venue = await Venue.findByPk(req.params.venueId, {
        include: {
            model: Group,
            include: {
                model: Membership,
                where: {
                    userId: req.user.id
                },
            },
        }
    })
    if (!venue) return res.status(404).json({message: "Venue couldn't be found"});
    if (venue.dataValues.Group.Memberships[0].status !== 'organizer' && venue.dataValues.Group.Memberships[0].status !== 'co-host') {
        return res.status(401).json({message: 'Must be organizer or co-host to edit this venue'})
    }
    const errors = {}
    if (address) venue.address = address
    if (city) venue.city = city
    if (state) venue.state = state
    if (lat) {
        if (typeof lat == 'number') {
            venue.lat = lat
        } else {
            errors.lat = "Latitude is not valid"
        }
    }
    if (lng) {
        if (typeof lng == 'number') {
            venue.lng = lng
        } else {
            errors.lng = "Longitude is not valid"
        }
    }
    if (Object.keys(errors).length) return res.status(400).json({
        message: "Bad Request",
        errors
    })
    venue.save()
    const venueObj = {
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    }
    return res.json(venueObj)
})




module.exports = router;
