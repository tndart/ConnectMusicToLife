

const express = require('express')
const global = require('../utils/extensions')
const PlaylistService = require('../services/playlist')

const router = express.Router()

router.get('/get', (req, res) => {
    let amount = 5;
    if (req.query.amount){
        amount = req.query.amount;
    }

    if (req.cookies){
        amount = req.query.amount;
    }

    global.sendResponse(res, PlaylistService.getPlaylist(amount));
});

module.exports = router