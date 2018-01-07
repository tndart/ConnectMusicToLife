'use strict';

const http = require('http')

const DB = require('../adapters/db')
const lastfm_api = require('../adapters/last-fm-api')

const global = require('../global')

const fs = require('fs')

class TagService {
    constructor() {
        this.api = new lastfm_api();
        this.dbConn = new DB().getDbConn();
    }

    getTopArtists(tagName, callback) {
        this
            .api
            .getTagTopArtists(tagName, jsonData => {
                console.info("TrackService:: The data returned from Last.FM API");
                callback(jsonData);
            });
    }

    getTopTracks(tagName, callback) {
        this
            .api
            .getTagTopTracks(tagName, jsonData => {
                console.info("TrackService:: The data returned from Last.FM API");
                callback(jsonData);
            });
    }

    getTopAlbums(tagName, callback) {
        this
            .api
            .getTagTopAlbums(tagName, jsonData => {
                console.info("TrackService:: The data returned from Last.FM API");
                callback(jsonData);
            });
    }
}

module.exports = TagService;