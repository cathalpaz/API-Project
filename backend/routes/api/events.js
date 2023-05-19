const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Event, EventImage, Attendance } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize')

// Get all Events
router.get('/', async(req, res) => {
    // query filters:
    let { page, size, name, type, startDate } = req.query
    const errors = {}
    if (page && page < 1) errors.page = 'Page must be greater than or equal to 1';
    if (size && size < 1) errors.size = 'Size must be greater than or equal to 1';
    if (name && typeof name == 'string') errors.name = 'Name must be a string';
    if (type && type !== 'Online' && type !== 'In person') errors.type = 'Type must be Online or In person';
    if (startDate && typeof Date.parse(startDate) !== 'number') errors.startDate = 'Start date must be a valid datetime'
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        })
    }
    let pagination = {}
    page = !page ? 1 : page
    size = !size ? 20 : size
    pagination.limit = size
    pagination.offset = size * (page - 1)

    let where = {}
    if (name) where.name = name;
    if (type) where.type = type;
    if (startDate) where.startDate = startDate;
    // end of filters

    const events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description', 'capacity', 'price']
        },
        where,
        ...pagination
    })
    for (let event of events) {
        const numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: {
                    [Op.notIn]: ['pending', 'waitlist']
                }
            },
        })
        event.dataValues.numAttending = numAttending;
        const image = await EventImage.findOne({
            where: {
                eventId: event.id
            }
        })
        if (image) {
            event.dataValues.previewImage = image.url
        } else {
            event.dataValues.previewImage = 'no image'
        }
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
    return res.json({Events: events})
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
    const numAttending = await Attendance.count({
        where: {
            eventId: event.id
        }
    })
    event.dataValues.numAttending = numAttending;
    return res.json(event)
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
            },
            where: {
                id: req.user.id
            },
        }],
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
            },
        }
    })
    if (!isAttendee && !isOrganizerCohost.dataValues.Group) return res.status(401).json({message: 'Must be attendee, organizer, or co-host to add image'})

    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
        eventId: event.id,
        url,
        preview
    })
    return res.json({
        id: newEventImage.id,
        url: newEventImage.url,
        preview: newEventImage.preview
    })
})

// Edit an Event specified by its id
router.put('/:eventId', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const checkMembership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })
    if (!checkMembership || (checkMembership.status !== 'organizer' && checkMembership.status !== 'co-host')) {
        return res.status(401).json({message: "Unauthorized to edit this event"})
    }
    const {venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const errors = {};
    const checkVenue = await Venue.findByPk(venueId);
    if (venueId && !checkVenue) errors.venueId = 'Venue does not exist';
    if (name && name.length < 5) errors.name = 'Name must be at least 5 characters';
    if (type && (type !== 'Online' && type !== 'In person')) errors.type = 'Type must be Online or In person';
    if (capacity && typeof capacity !== 'number') errors.capacity = 'Capacity must be an integer';
    if (price && typeof price !== 'number') errors.price = 'Price is invalid';
    if (description && description.length < 1) errors.description = 'Description is required';
    if (startDate && Date.now() > Date.parse(startDate)) errors.startDate = 'Start date must be in the future';
    if (endDate && Date.parse(startDate) > Date.parse(endDate)) errors.endDate = 'End date is less than start date';

    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        })
    }
    if (venueId) event.venueId = venueId;
    if (name) event.name = name;
    if (type) event.type = type;
    if (capacity) event.capacity = capacity;
    if (price) event.price = price;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;

    await event.save()
    return res.json({
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
    })
})

// Delete an Event specified by its id
router.delete('/:eventId', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const membership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id
        }
    })
    if (!membership || (membership.status !== 'organizer' && membership.status !== 'co-host')) {
        return res.status(401).json({message: "Unauthorized to delete this event"})
    }
    await event.destroy();
    return res.json({message: "Successfully deleted"});
})

// Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})
    const myMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (myMembership && (myMembership.status === 'organizer' || myMembership.status === 'co-host')) {
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
    const myAttendance = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: req.user.id
        }
    })
    if (!myAttendance) {
        const newAttendance = await Attendance.create({
            eventId: event.id,
            userId: req.user.id,
            status: 'pending'
        })
        return res.json({
            userId: newAttendance.userId,
            status: newAttendance.status
        })
    } else if (myAttendance.status === 'attending') {
        return res.status(400).json({message: "User is already an attendee of the event"})
    } else {
        return res.status(400).json({message: "Attendance has already been requested"})
    }
})

// Change the status of an attendance for an event specified by id
router.put('/:eventId/attendance', requireAuth, async(req, res) => {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) return res.status(404).json({message: "Event couldn't be found"})

    const { userId, status } = req.body
    const currentAttendance = await Attendance.findOne({
        where: {
            eventId: event.id,
            userId: userId
        }
    })
    if (!currentAttendance) return res.status(404).json({message: "Attendance between the user and the event does not exist"})
    if (status === 'pending') return res.status(400).json({message: "Cannot change an attendance status to pending"})
    const myMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (!myMembership || (myMembership.status !== 'organizer' && myMembership.status !== 'co-host')) {
        return res.status(401).json({message: 'Unauthorized to change status'})
    }
    currentAttendance.status = status
    await currentAttendance.save()
    return res.json({
        id: currentAttendance.id,
        eventId: currentAttendance.eventId,
        userId: currentAttendance.userId,
        status: currentAttendance.status
    })

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
    if (!attendance) return res.status(404).json({message: "Attendance does not exist for this User"})
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: event.groupId
        }
    })
    if (!membership || (userId !== req.user.id && membership.status !== 'organizer')) {
        return res.status(401).json({message: "Unauthorized to delete attendance"})
    }
    await attendance.destroy()
    return res.json({message: "Successfully deleted attendance from event"})
})



module.exports = router;
