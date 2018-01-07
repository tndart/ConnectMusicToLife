const express = require('express')
const router = express.Router()
const TrackService = require('../services/track')
const ArtistService = require('../services/artist')
const trackRouter = require('../routes/track')

router.get('/', (req, res) => {
    res.redirect('/help')
});
router.get('/:artistname', (req, res) => {

    if (req.params.artistname) {

        var srv = new ArtistService()
        srv.getArtistData(req.params.artistname, (response) => {
            res.json(response)
        });
    } else {
        res.redirect('/help')
    }
})

router.get('/:artistname/tophits', (req, res) => {
    var srv = new ArtistService()
    srv.getTopTrackByArtist(req.param.artistname, (response) => {
        sendResponse(res, response)
    });
})

router.use('/:artistname/track', trackRouter);

module.exports = router