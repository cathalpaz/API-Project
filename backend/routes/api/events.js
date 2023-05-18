const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize')

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
router.get('/:eventId', async(req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: Group,
            attributes: ['id', 'name', 'private', 'city', 'state']
        }, {
            model: Venue,
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
        }, {
            model: EventImage,
            attributes: ['id', 'url', 'preview']
        }
    ]
    })
    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const numAttending = await Attendance.findAll({
        where: {
            eventId: event.id
        }
    })
    event.dataValues.numAttending = numAttending.length
    res.json(event)
})

// Add an Image to a Event based on the Event's id
router.post('/:eventId/images', requireAuth, async(req, res) => {

    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const isAttendee = await Event.findByPk(req.params.eventId, {
        include: [{
            model: User,
            through: {
                model: Attendance,
                where: {
                    status: 'attending'
                },
                attributes: ['status']
            },
            where: {
                id: req.user.id
            },
            attributes: ['id'],
        }],
        attributes: ['id'],
    })
    const isOrganizerCohost = await Event.findByPk(req.params.eventId, {
        include: {
            model: Group,
            include: {
                model: Membership,
                where: {
                    status: {
                        [Op.or]: ['organizer', 'co-host']
                    },
                    userId: req.user.id
                },
                attributes: ['status']
            },
            attributes: ['id']
        }
    })
    if (!isAttendee && !isOrganizerCohost.dataValues.Group) return res.status(403).json({message: 'Must be attendee, organizer, or co-host to add image'})

    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
        eventId: req.params.eventId,
        url,
        preview
    })
    const imgObj = {
        id: newEventImage.id,
        url: newEventImage.url,
        preview: newEventImage.preview
    }
    res.json(imgObj)
})

// Edit an Event specified by its id
router.put('/:eventId', requireAuth, async(req, res) => {
    // errors
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const checkMembership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })
    if (!checkMembership || (checkMembership.dataValues.status !== 'organizer' && checkMembership.dataValues.status !== 'co-host')) {
        return res.status(403).json({message: "Must be organizer or co-host to edit this event"})
    }

    const {venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const errors = {}
    const checkVenue = await Venue.findByPk(venueId)
    if (venueId && !checkVenue) {
        errors.venueId = 'Venue does not exist'
    } else event.venueId = venueId
    if (name && name.length < 5) {
        errors.name = name
    } else event.name = name
    if (type && (type !== 'Online' && type !== 'In person')) {
        errors.type = 'Type must be Online or In person'
    } else {
        event.type = type
    }
    if (capacity && typeof capacity !== 'number') {
        errors.capacity = 'Capacity must be an integer'
    } else {
        event.capacity = capacity
    }
    if (price && typeof price !== 'number') {
        errors.price = 'Price is invalid'
    } else {
        event.price = price
    }
    if (description && description.length < 1) {
        errors.description = 'Description is required'
    } else {
        event.description = description
    }
    if (startDate && Date.now() > Date.parse(startDate)) {
        errors.startDate = 'Start date must be in the future'
    } else {
        event.startDate = startDate
    }
    if (endDate && Date.parse(startDate) > Date.parse(endDate)) {
        errors.endDate = 'End date is less than the start date'
    } else {
        event.endDate = endDate
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        })
    }
    await event.save()
    const eventObj = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
    }
    return res.json(eventObj)
})

// Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)

    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const checkMembership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })
    if (!checkMembership || (checkMembership.dataValues.status !== 'organizer' && checkMembership.dataValues.status !== 'co-host')) {
        return res.status(403).json({message: "Must be organizer or co-host to delete this event"})
    }

    await event.destroy()
    return res.json({message: "Successfully deleted"})
})

// Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const currentMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (currentMembership.status === 'organizer' || currentMembership.status === 'co-host') {
        const attendees = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Attendance,
                where: {
                    eventId: event.id
                },
                attributes: ['status'],
            },
        })
        return res.json({Attendees: attendees})
    } else {
        const attendees = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Attendance,
                where: {
                    eventId: event.id,
                    status: {
                        [Op.not]: 'pending'
                    }
                },
                attributes: ['status']
            }
        })
        return res.json({Attendees: attendees})
    }
})

// Request to Attend an Event based on the Event's id
router.post('/:eventId/attendance', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const checkAttendance = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: req.user.id
        }
    })
    if (!checkAttendance) {
        // set to pending here, create new attendance
        const newAttendance = await Attendance.create({
            eventId: event.id,
            userId: req.user.id,
            status: 'pending'
        })
        const attendanceObj = {
            userId: newAttendance.userId,
            status: newAttendance.status
        }
        return res.json(attendanceObj)
    } else if (checkAttendance.status === 'pending') {
        // attendance already been requested here
        return res.status(400).json({message: "Attendance has already been requested"})
    } else {
        // user already an attendee here
        return res.status(400).json({message: "User is already an attendee of the event"})
    }
})

// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const { userId, status } = req.body
    const checkAttendance = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: userId
        }
    })
    if (!checkAttendance) return res.status(404).json({message: "Attendance between the user and the event does not exist"})
    if (status === 'pending') return res.status(400).json({message: "Cannot change an attendance status to pending"})

    const currentMembership = await Membership.findOne({
        userId: req.user.id,
        groupId: event.groupId
    })
    if (currentMembership && (currentMembership.status === 'organizer' || currentMembership.status === 'co-host')) {
        checkAttendance.status = status
        await checkAttendance.save()
        return res.json({
            id: checkAttendance.id,
            eventId: checkAttendance.eventId,
            userId: checkAttendance.userId,
            status: checkAttendance.status
        })
    } else {
        return res.status(403).json({message: 'Unauthorized to change status'})
    }
})

// Delete attendance to an event specified by id
router.delete('/:eventId/attendance', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const { userId } = req.body
    const attendance = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: userId
        }
    })
    if (!attendance) return res.status.json({message: "Attendance does not exist for this User"})
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (userId != req.user.id || membership.status !== 'organizer') {
        return res.status(403).json({message: "Only the User or organizer may delete an Attendance"})
    } else {
        await attendance.destroy()
        return res.json({message: "Successfully deleted attendance from event"})
    }
})



module.exports = router;
