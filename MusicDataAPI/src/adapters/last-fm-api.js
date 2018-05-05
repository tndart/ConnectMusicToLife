'use strict';

const http = require('http');

const API_KEY = '8964453062a973666d1dbc55e892fa64';

var instance = null;

class LastFmApi {
    constructor() {
        if (!instance) {
            instance = this;
            instance.isValidToken = false;
            instance.token = undefined;
            console.info('LastFmApi:: New instance created!');
        }

        return instance;
    }

    auth(callback) {
        const AUTH_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=auth.gettoken&api_key=${API_KEY}&format=json`;

        if (instance.token !== undefined && instance.isValidToken) {
            console.info(`LastFmApi:: Reuse of a token ${instance.token}`);
            callback(instance.token);
        } else {

            http.get(AUTH_REQUEST, (res) => {
                var data = '';

                // A chunk of data has been recieved.
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received.
                res.on('end', () => {
                    instance.token = JSON
                        .parse(data)
                        .token;
                    instance.isValidToken = true;
                    console.info(`LastFmApi:: New token created! The new token is ${instance.token}`);
                    callback(instance.token);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                callback(err);
            });
        }
    }

    getArtistInfo(artistName, artistId, callback) {
        const method = 'artist.getInfo';
        var ARTIST_REQUEST = ``;

        if (artistId){
            ARTIST_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&mbid=${artistId}&api_key=${API_KEY}&format=json`
        } else if (artistName) {
            ARTIST_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${artistName}&api_key=${API_KEY}&format=json&autocorrect=1`
        }

        if (ARTIST_REQUEST !== '') {
            _getInfo(ARTIST_REQUEST.replace(/\s/g, '%20'), data => {
                callback(data);
            })
        }
        else{
            callback(null)
        }
    }

    getArtistTopTracks(artistName, mbid, callback) {
        const method = 'artist.gettoptracks';
        const TRACK_REQUEST = '';
        if (mid) {
            TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${artistName}&api_key=${API_KEY}&format=json&autocorrect=1`;
        } else if (artistName) {
            TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&mbid=${artistName}&api_key=${API_KEY}&format=json&autocorrect=1`;
        } else {
            callback({"error": "send artist name or mbid as param"});
        }
        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }

    getTrackInfo(artistName, trackName, callback) {
        const method = 'track.getInfo';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${artistName}&track=${trackName}&api_key=${API_KEY}&format=json&autocorrect=1`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }

    searchTrack(trackName, callback) {
        const method = 'track.search';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&track=${trackName}&api_key=${API_KEY}&format=json&autocorrect=1`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }

    getTagTopArtists(tagName, callback) {
        const method = 'tag.gettopartists';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&tag=${tagName}&api_key=${API_KEY}&format=json&autocorrect=1`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            
            callback(data);
        })
    }

    getTagTopTracks(tagName, callback) {
        const method = 'tag.gettoptracks';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&tag=${tagName}&api_key=${API_KEY}&format=json&autocorrect=1`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }

    getTagTopAlbums(tagName, callback) {
        const method = 'tag.gettopalbums';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&tag=${tagName}&api_key=${API_KEY}&format=json&autocorrect=1`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }

    getTopTags(callback) {
        const method = 'tag.gettoptags';
        const TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&api_key=${API_KEY}&format=json`;

        _getInfo(TRACK_REQUEST.replace(/\s/g, '%20'), data => {
            callback(data);
        })
    }
}

function _getInfo(URL, callback) {
        
    console.info(`LastFmApi:: Sending Request ${URL}`);
    instance.auth(token => {
        http.get(URL, (res) => {
            var data = '';

            // A chunk of data has been recieved.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                var result = JSON.parse(data);
                if(result.error === 6){
                    console.log("error");
                }
                callback(result);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
            callback(err);
        });
    });
}

module.exports = LastFmApi;