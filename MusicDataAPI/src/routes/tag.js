const express = require('express')
const router = express.Router({mergeParams: true})

const TagService = require('../services/tag')
const global = require('../utils/extensions')

router.get('/top', (req, res) => {

    var tag = new TagService();
    tag.getTopTags((data) => {
        global.sendResponse(res, data);
    });

});

router.get('/:tagname/artists', (req, res) => {

    if (req.params.tagname) {
        console.log(`Start handle http request for "artists by tags", with tag ${req.params.tagname} `)
        var tag = new TagService();
        tag.getTopArtists(req.params.tagname, (data) => {
            console.log(`End handle http request for "artists by tags", with tag ${req.params.tagname} `)
            global.sendResponse(res, data);
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