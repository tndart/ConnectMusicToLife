'use strict';

const http = require('http')

const DB = require('../adapters/db')
const lastfm_api = require('../adapters/last-fm-api')
const TrackModel = require('../models/track')

const global = require('../global')

const fs = require('fs')

class TrackService {

    constructor() {
        this.api = new lastfm_api();
        this.dbConn = new DB().getDbConn();
    }

    getTrackData(songName, artistName, callback) {
        console.log('got here 1 ');

        if (songName === "debug") {
            var demoObject = JSON.parse(fs.readFileSync('./demoObjects/track1.json', 'utf8'))
            callback(demoObject);
        } else if (songName) {
            console.log('got here 2 ');

            TrackModel
                .Tracks
                .find({
                    "mainObject.name": new RegExp('\\b^' + songName + '$\\b', 'i')
                }, (err, trackList) => {
                    if (err) {
                        callback(err);
                    } else if (trackList.length > 0) {
                        console.info("TrackService:: The data returned from DB");
                        callback(trackList[0]);
                    } else if (artistName) {
                        // Getting here if cannot find a data of this track in db. Request a data from
                        // web api's like Last.FM API.
                        this
                            .api
                            .getTrackInfo(artistName, songName, jsonData => {

                                // Save the data that returned to the DB
                                var newTrack = new TrackModel.Track(jsonData);
                                var trackModel = new TrackModel.Tracks(newTrack);
                                trackModel.save();
                                console.info("TrackService:: The data returned from Last.FM API and saved to DB");

                                callback(jsonData);
                            });
                    } else {
                        this
                            .api
                            .searchTrack(songName, jsonData => {

                                console.info("TrackService:: The data returned from Last.FM API");

                                callback(jsonData);
                            });
                    }
                });
        } else {
            callback(null);
        }
    };

    getTopTrackByArtist(artistName, callback) {}

}

module.exports = TrackService;