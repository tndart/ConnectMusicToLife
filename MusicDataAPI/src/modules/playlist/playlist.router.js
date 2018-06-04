const express = require('express')
const router = express.Router()

const global = require('../../utils/extensions')
const PlaylistService = require('./playlist.service') 

router.get('/getNext', (req, res) => {

    if (!req.query.userid){
        res.redirect('/help')
    }

    PlaylistService.getNext(req.query.userid, req.query.amount, req.query.time).then(playlistData => {
        global.sendResponse(res, playlistData);
    }).catch(err => {
        global.sendResponse(res, err);
    })
})

module.exports = router