const express = require('express')
const router = express.Router({mergeParams: true})
const TrackService = require('../services/track')

router.get('/:songname', (req, res) => {

    if (req.params.artistname && req.params.songname) {
        var srv = new TrackService();
        srv.getTrackData(req.params.songname, req.params.artistname, (response) => {
            res.json(response)
        });
    } else if (req.params.songname) {
        var srv = new TrackService();
        srv.getTrackData(req.params.songname, null, (response) => {
            res.json(response)
        });
    } else {
        res.redirect('/help')
    }
});

module.exports = router