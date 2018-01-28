'use strict';

const http = require('http');
const lastfm_api = require('../adapters/last-fm-api');
const DB = require('../adapters/db')

const global = require('../global')

const lastFmInstance = new lastfm_api();
const dbConn = new DB().getDbConn();

class ArtistService {

    constructor() {
    }

    getArtistData(artistName, artistId, callback) {
        if (artistName === "debug") {
            callback({"error": "not implimated"});
        } else {

            lastFmInstance.getArtistInfo(artistName, artistId, data => {
                callback(data);
            });
        }
    }

}

module.exports = ArtistService;
