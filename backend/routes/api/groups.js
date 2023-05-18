const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User, Attendance, Event, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize')


// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll()
    for (let group of groups) {
        const numMembers = await Membership.findAll({
            where: {
                groupId: group.id,
                status: {
                    [Op.notIn]: ['pending']
                }
            }
        })
        group.dataValues.numMembers = numMembers.length
        const image = await GroupImage.findOne({
            where: {
                groupId: group.id
            }
        })
        if (image) {
            group.dataValues.previewImage = image.url
        }
    }
    return res.json({Groups: groups})
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
    })
    for (let group of groups) {
        const numMembers = await Membership.findAll({
            where: {
                groupId: group.id,
                status: {
                    [Op.notIn]: ['pending']
                }
            }
        })
        group.dataValues.numMembers = numMembers.length
        const image = await GroupImage.findOne({
            where: {
                groupId: group.id
            }
        })
        if (image) {
            group.dataValues.previewImage = image.url
        }
    }
    return res.json({Groups: groups})
})

// Get details of a Group from an id
router.get('/:groupId', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [{
            model: GroupImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'groupId']
            }
        }, {
            model: User,
            as: 'Organizer',
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'hashedPassword', 'username', 'email']
            }
        }, {
            model: Venue,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    ]
    })
    if (!group) return res.status(404).json({message: "Group couldn't be found"})

    const members = await Membership.findAll({
        where: {
            groupId: group.id,
            status: {
                [Op.notIn]: ['pending']
            }
        }
    })
    group.dataValues.numMembers = members.length

    return res.json(group)
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
    if (!private && typeof private != 'boolean') {
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
    const newGroup = await Group.create({organizerId, name, about, type, private, city, state})

    // create membership association
    const newMembership = await Membership.create({
        userId: req.user.id,
        groupId: newGroup.id,
        status: 'organizer'
    })

    return res.status(201).json(newGroup);
})

// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    const { url, preview } = req.body

    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Only organizer is authorized'})

    const newGroupImage = await GroupImage.create({
        groupId: group.id,
        url,
        preview
    });
    const imgObj = {
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    }
    return res.json(imgObj)
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
    if (private && typeof private != 'boolean') {
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
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Only organizer is authorized'})

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
    if (group.organizerId != req.user.id) return res.status(401).json({message: 'Only organizer is authorized'});

    await group.destroy();
    return res.json({message: "Successfully deleted"});
})

// Get All Venues for a Group specified by its id
router.get('/:groupId/venues', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id
            },
        }
    })
    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    if (group.dataValues.Memberships[0].status != 'organizer' && group.dataValues.Memberships[0].status != 'co-host') return res.status(401).json({message: 'Must be organizer or co-host to view venues for this group'});

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

    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id
            },
        }
    })
    if (!group) return res.status(404).json({message: "Group couldn't be found"});
    if (group.dataValues.Memberships[0].status != 'organizer' && group.dataValues.Memberships[0].status != 'co-host') return res.status(401).json({message: 'Must be organizer or co-host to add venues for this group'});

    const groupId = group.id
    const newVenue = await Venue.create({groupId, address, city, state, lat, lng})
    const venueObj = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng
    }
    return res.json(venueObj)
})

// Get all Events of a Group specified by its id
router.get('/:groupId/events', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    if (!group) return res.status(404).json({message: "Group couldn't be found"})

    const events = await Event.findAll({
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
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
        const numAttending = await Attendance.findAll({
            where: {
                eventId: event.id
            }
        })
        event.dataValues.numAttending = numAttending.length
        const previewImage = await EventImage.findOne({
            where: {
                eventId: event.id
            }
        })
        event.dataValues.previewImage = previewImage.url
    }

    return res.json({Events: events})
})

// Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: {
            model: Membership,
            where: {
                userId: req.user.id
            },
        }
    })
    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.dataValues.Memberships[0].status != 'organizer' && group.dataValues.Memberships[0].status != 'co-host') return res.status(401).json({message: 'Must be organizer or co-host to add events for this group'});

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    const errors = {}
    const checkVenue = await Venue.findByPk(venueId)
    if (!venueId && !checkVenue) errors.venueId = 'Venue does not exist'
    if (!name || name.length < 5) errors.name = 'Name must be at least 5 characters'
    if (!type || type !== 'Online' && type!== 'In person') errors.type = 'Type must be Online or In person'
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
        groupId: group.dataValues.id,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    })
    return res.json(newEvent)
})

// Get all Members of a Group specified by its id
router.get('/:groupId/members', async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    const currentMembership = await Membership.findOne({
        where: {
            groupId: group.id,
            userId: req.user.id
        }
    })

    if (!group) return res.status(404).json({message: "Group couldn't be found"})

    if (currentMembership.status === 'organizer' || currentMembership.status === 'co-host') {
        const members = await User.findAll({
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
                    status: {
                        [Op.not]: 'pending'
                    },
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
            status: 'pending'
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
    if (status === 'pending') {
        return res.status(400).json({
            message: "Validations Error",
            errors: {
              status : "Cannot change a membership status to pending"
            }
        })
    }
    const newMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: group.id
        }
    })
    if (!newMembership) return res.status(404).json({message: "Membership between the user and the group does not exist"})
    if (myMembership.status === 'co-host' || myMembership.status === 'organizer') {
        if (newMembership.status === 'pending') {
            newMembership.status = 'member'
            await newMembership.save()
            return res.json(newMembership)
        }
    } else if (myMembership === 'organizer') {
        if (newMembership.status === 'member') {
            newMembership.status = 'co-host'
            await newMembership.save()
            return res.json(newMembership)
        }
    } else {
        return res.status(403).json({message: 'Only co-hosts and organizers can update status'})
    }


})

// Delete membership to a group specified by id
router.delete(':groupId/membership', requireAuth, async(req, res) => {
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
    const checkOwnerMembership = await Membership.findOne({
        where: {
            userId: req.user.id,
            group: group.id
        }
    })
    if (checkOwnerMembership.status != 'organizer' && memberId != req.user.id) {
        return res.status(403).json({message: 'Unauthorized to delete this member'})
    }
    await membership.destroy()
    return res.json({message: "Successfully deleted membership from group"})
})



module.exports = router;
