'use strict';

const http = require('http');
const lastfm_api = require('./last-fm-api');

class Tracks {

    constructor() {}

    getTrackData(songName) {
        var promise = new Promise((resolve, reject) => {
            if (songName === "debug") {
                resolve([
                    {
                        "name": "songName",
                        "artist": [
                            "artist1", "artist2"
                        ],
                        "album": "album",
                        "year": 2015
                    }
                ]);
            } else {
                var api = new lastfm_api()

                api
                    .auth()
                    .then(token => {
                        resolve(token);
                    })
                    .catch(err => {
                        reject(err)
                    });
            }
        });
        return promise;
    }
}

module.exports = Tracks;