const express = require('express')
const router = express.Router({mergeParams: true})
const TagService = require('../services/tag')

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