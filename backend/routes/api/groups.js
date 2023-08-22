const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Attendance, Event, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize')


// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    for (let group of groups) {
        const numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: {
                    [Op.notIn]: ['pending']
                }
            }
        })
        group.dataValues.numMembers = numMembers;
        const image = await GroupImage.findOne({
            where: {
                groupId: group.id,
            }
        })
        if (image) {
            group.dataValues.previewImage = image.url;
        } else {
            group.dataValues.previewImage = 'no image';
        }
    }
    return res.json({Groups: groups});
})

// Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async(req, res) => {
    const groups = await Group.findAll({
        include: {
            model: Membership,
            attributes: [],
            where: {
                userId: req.user.id
            }
        }
    });
    for (let group of groups) {
        const numMembers = await Membership.count({
            where: {
                groupId: group.id,
                status: {
                    [Op.notIn]: ['pending']
                }
            }
        });
        group.dataValues.numMembers = numMembers
        const image = await GroupImage.findOne({
            where: {
                groupId: group.id
            }
        });
        if (image) {
            group.dataValues.previewImage = image.url;
        } else {
            group.dataValues.previewImage = 'no image';
        }
    }
    return res.json({Groups: groups});
})

// Get details of a Group from an id
router.get('/:groupId', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [{
            model: GroupImage,
            attributes: ['id', 'url', 'preview']
        }, {
            model: User,
            as: 'Organizer',
            attributes: ['id', 'firstName', 'lastName']
        }, {
            model: Venue,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    ]
    });
    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    const members = await Membership.count({
        where: {
            groupId: group.id,
            status: {
                [Op.notIn]: ['pending']
            }
        }
    });
    group.dataValues.numMembers = members;
    return res.json(group);
})

// Create a Group
router.post('/', requireAuth, async(req, res) => {
    const {name, about, type, private, city, state} = req.body;
    const errors = {};
    if (!name || name.length > 60) {
        errors.name = 'Name must be 60 characters or less';
    }
    if (!about || about.length < 50) {
        errors.about = 'About must be 50 characters or more';
    }
    if (!type || type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'";
    }
    if (!private && typeof private !== 'boolean') {
        errors.private = 'Private must be a boolean'
    }
    if (!city) {
        errors.city = 'City is required';
    }
    if (!state) {
        errors.state = 'State is required';
    }
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        });
    }
    const organizerId = req.user.id;
    const newGroup = await Group.create({organizerId, name, about, type, private, city, state});

    // create membership association
    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: newGroup.id,
        status: 'organizer'
    });
    return res.status(201).json(newGroup);
})

// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    const { url, preview } = req.body

    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Unauthorized to add an image'});

    const newGroupImage = await GroupImage.create({
        groupId: group.id,
        url,
        preview
    });
    return res.json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    })
})

// Edit a Group
router.put('/:groupId', requireAuth, async(req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const errors = {};
    if (name && name.length > 60) {
        errors.name = 'Name must be 60 characters or less';
    }
    if (about && about.length < 50) {
        errors.about = 'About must be 50 characters or more';
    }
    if (type && type !== 'Online' && type !== 'In person') {
        errors.type = "Type must be 'Online' or 'In person'";
    }
    if (private && typeof private !== 'boolean') {
        errors.private = 'Private must be a boolean'
    }
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        });
    }
    const group = await Group.findByPk(req.params.groupId)

    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Unauthorized to edit this group'})

    if (name) group.name = name
    if (about) group.about = about
    if (type) group.type = type
    if (private) group.private = private
    if (city) group.city = city
    if (state) group.state = state

    await group.save()
    return res.json(group)
})

// Delete a Group
router.delete('/:groupId', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);

    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Unauthorized to delete this group'});

    await group.destroy();
    return res.json({message: "Successfully deleted"});
})

// Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if (!membership || (membership.status !== 'organizer' && membership.status !== 'co-host')) return res.status(401).json({message: 'Unauthorized to view venues for this group'});

    const venues = await Venue.findAll({
        where: {
            groupId: group.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })
    return res.json({Venues: venues})
})

// Create a new Venue for a Group specified by its id
router.post('/:groupId/venues', requireAuth, async(req, res) => {
    const { address, city, state, lat, lng } = req.body;

    const errors = {};
    if (!address) errors.address = "Street address is required"
    if (!city) errors.city = "City is required"
    if (!state) errors.state = "State is required"
    if (!lat) errors.lat = "Latitude is required"
    if (!lng) errors.lng = "Longitude is required"
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        })
    }
    const group = await Group.findByPk(req.params.groupId)
    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if (!membership || (membership.status !== 'organizer' && membership.status !== 'co-host')) return res.status(401).json({message: 'Unauthorized to add venues for this group'});

    const groupId = group.id
    const newVenue = await Venue.create({groupId, address, city, state, lat, lng})
    return res.json({
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng
    })
})

// Get all Events of a Group specified by its id
router.get('/:groupId/events', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    if (!group) return res.status(404).json({message: "Group couldn't be found"})

    const events = await Event.findAll({
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate', 'description'],
        include: [{
            model: Group,
            where: {
                id: req.params.groupId
            },
            attributes: ['id', 'name', 'city', 'state']
        }, {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }]
    })
    for (let event of events) {
        const numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: {
                    [Op.notIn]: ['pending', 'waitlist']
                }
            }
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
    }
    return res.json({Events: events})
})

// Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async(req, res) => {
    // eagerly loaded:
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id
            },
        }
    })
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.Memberships[0].status !== 'organizer' && group.Memberships[0].status !== 'co-host') return res.status(401).json({message: 'Unauthorized to add events for this group'});

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const errors = {}
    const checkVenue = await Venue.findByPk(venueId)
    if (!venueId || !checkVenue) errors.venueId = 'Venue does not exist'
    if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters'
    if (!type || type !== 'Online' && type !== 'In person') errors.type = 'Type must be Online or In person'
    if (!capacity || typeof capacity !== 'number') errors.capacity = 'Capacity must be an integer'
    if (!price || typeof price !== 'number') errors.price = 'Price is invalid'
    if (!description) errors.description = 'Description is required'
    if (!startDate || Date.parse(startDate) < Date.now()) errors.startDate = 'Start date must be in the future';
    if (!endDate || Date.parse(endDate) < Date.parse(startDate)) errors.endDate = 'End date is less than start date';
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        })
    }

    const newEvent = await Event.create({
        venueId,
        groupId: group.id,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })
    return res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate
    })
})

// Get all Members of a Group specified by its id
router.get('/:groupId/members', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    let membership = null
    if (req.user) {
        membership = await Membership.findOne({
            where: {
                groupId: group.id,
                userId: req?.user.id
            }
        })
    }
    if (membership && (membership.status === 'organizer' || membership.status === 'co-host')) {
        const members = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Membership,
                where: {
                    groupId: group.id
                },
                attributes: ['status']
            }
        })
        return res.json({Members: members})
    } else {
        // if not organizer or co-host
        const members = await User.findAll({
            attributes: ['id', 'firstName', 'lastName'],
            include: {
                model: Membership,
                where: {
                    // status: {
                    //     [Op.not]: 'pending'
                    // },
                    groupId: group.id
                },
                attributes: ['status']
            }
        })
        return res.json({Members: members})
    }
})

// Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if (!membership) {
        const newMembership = await Membership.create({
            userId: req.user.id,
            groupId: group.id,
            status: 'member'
        })
        return res.json({
            memberId: newMembership.userId,
            status: newMembership.status
        })
    } else if (membership.status === 'pending') {
        return res.status(400).json({message: "Membership has already been requested"})
    } else {
        return res.status(400).json({message: "User is already a member of the group"})
    }
})

// Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    const myMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    const { memberId, status } = req.body

    const errors = {};
    if (status === 'pending') errors.status = 'Cannot change a membership status to pending';
    const checkUser = await User.findByPk(memberId);
    if (!checkUser) errors.memberId = "User couldn't be found"
    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: 'Validation Error',
            errors
        })
    }
    const newMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: group.id
        }
    })
    if (!newMembership) return res.status(404).json({message: "Membership between the user and the group does not exist"})
    if (myMembership && myMembership.status === 'organizer') {
        newMembership.status = status
        await newMembership.save()
        return res.json({
            id: newMembership.id,
            groupId: newMembership.groupId,
            memberId: newMembership.memberId,
            status: newMembership.status
        })

    } else if (myMembership && myMembership.status === 'co-host' && newMembership.status == 'pending') {
        newMembership.status = 'member'
        await newMembership.save()
        return res.json({
            id: newMembership.id,
            groupId: newMembership.groupId,
            memberId: newMembership.memberId,
            status: newMembership.status
        })
    } else {
        return res.status(401).json({message: 'Unauthorized to update status'})
    }
})

// Delete membership to a group specified by id
router.delete('/:groupId/membership', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    const { memberId } = req.body
    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: group.id
        }
    })
    if (!membership) return res.status(404).json({message: "Membership does not exist for this User"})
    const myMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: group.id
        }
    })
    if (myMembership.status !== 'organizer' && memberId !== req.user.id) {
        return res.status(401).json({message: 'Unauthorized to delete this member'})
    }
    await membership.destroy()
    return res.json({message: "Successfully deleted membership from group"})
})



module.exports = router;
