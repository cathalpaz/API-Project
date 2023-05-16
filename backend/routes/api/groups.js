const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, Venue, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')


// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll()
    for (let group of groups) {
        const numMembers = await Membership.findAll({
            where: {
                groupId: group.id
            }
        })
        group.dataValues.numMembers = numMembers.length
        let images = await GroupImage.findAll({
            where: {
                groupId: group.id
            }
        })
        let urls = []
        for (let image of images) {
            urls.push(image.url)
        }
        group.dataValues.previewImage = urls
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
                groupId: group.id
            }
        })
        group.dataValues.numMembers = numMembers.length
        let images = await GroupImage.findAll({
            where: {
                groupId: group.id
            }
        })
        let urls = []
        for (let image of images) {
            urls.push(image.url)
        }
        group.dataValues.previewImage = urls
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
    const members = await Membership.findAll({where: {groupId: group.id}})
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
    const userId = req.user.id;
    const groupId = newGroup.id;
    const status = 'organizer'
    const newMembership = await Membership.create({userId, groupId, status})

    return res.status(201).json(newGroup);
})

// Add an Image to a Group based on the Group's id
router.post('/:groupId/images', requireAuth, async(req, res) => {
    const group = await Group.findByPk(req.params.groupId)
    const { url, preview } = req.body

    if (!group) return res.status(404).json({message: "Group couldn't be found"})
    if (group.organizerId !== req.user.id) return res.status(401).json({message: 'Only organizer is authorized'})
    const groupId = group.id
    const newGroupImage = await GroupImage.create({
        groupId,
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
    if (!private && typeof private != 'boolean') {
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

    group.save()
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

module.exports = router;
