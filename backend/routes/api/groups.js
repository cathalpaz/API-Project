const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')


// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll()
    for (let group of groups) {
        let numMembers = await Membership.findAll({
            where: {
                groupId: group.id
            }
        })
        group.dataValues.numMembers = numMembers.length
    }
    return res.json({Groups: groups})
})

// Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async(req, res) => {

})





module.exports = router;
