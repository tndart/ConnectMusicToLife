'use strict';

const http = require('http');
const lastfm_api = require('../adapters/last-fm-api');
const DB = require('../adapters/db')

const global = require('../global')

class ArtistService {

    constructor() {
        this.api = new lastfm_api();
        this.dbConn = new DB().getDbConn();
    }

    getArtistData(artistName, callback) {
        if (artistName === "debug") {
            callback({"error": "not implimated"});
        } else {

            this
                .api
                .getArtistInfo(artistName, data => {
                    callback(data);
                });

        }
    }

    getArtistTopTracks(artistName, callback) {
        if (artistName === "debug") {
            callback({"error": "not implimated"});
        } else {

            this
                .api
                .getArtistInfo(artistName, data => {
                    callback(data);
                });

        }
    }

}

module.exports = ArtistService;
