const express = require('express');
const router = express.Router();
const { Group } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')

router.get('/', async (req, res) => {
    const groups = await Group.findAll()

    return res.json(groups)
})

module.exports = router;
