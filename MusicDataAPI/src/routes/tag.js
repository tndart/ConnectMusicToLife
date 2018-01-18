const express = require('express')
const router = express.Router({mergeParams: true})
const TagService = require('../services/tag')

// Functions .Depracted.
const sendResponse = (res, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(JSON.stringify(data, null, 4));
    return res;
};

router.get('/top', (req, res) => {

    var tag = new TagService();
    tag.getTopTags((data) => {
        sendResponse(res, data);
    });

});

router.get('/:tagname/artists', (req, res) => {

    if (req.params.tagname) {
        var tag = new TagService();
        tag.getTopArtists(req.params.tagname, (data) => {
            res.json(data);
        });
    } else {
        res.redirect('/help')
    }
});

router.get('/:tagname/tracks', (req, res) => {

    if (req.params.tagname) {
        var tag = new TagService();
        tag.getTopTracks(req.params.tagname, (data) => {
            res.json(data);
        });
    } else {
        res.redirect('/help')
    }
});

router.get('/:tagname/albums', (req, res) => {

    if (req.params.tagname) {
        var tag = new TagService();
        tag.getTopAlbums(req.params.tagname, (data) => {
            res.json(data)
        });
    } else {
        res.redirect('/help')
    }
});

module.exports = router