'use strict';
const DB = require('../adapters/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Track {
    constructor(lastfmJSON, name, artist, album,) {
        this.mainObject = {
            "name": lastfmJSON.track.name,
            "artist": lastfmJSON.track.artist.name,
            "album": (lastfmJSON.track.album
                ? lastfmJSON.track.album.title
                : "Single"),
            "pic": (lastfmJSON.track.album
                ? lastfmJSON.track.album.image[3].text
                : null)
        }
        this.subObjects = [
            {
                "LastFMObject": lastfmJSON
            }
        ];
    }

}

const schema = new Schema({
    mainObject: {
        Id: Schema.Types.ObjectId,
        name: String,
        artist: [String],
        album: String,
        version: String,
        genre: [String],
        tags: [String],
        publishedYear: {
            type: Number,
            min: 1900
        }
    },
    subObjects: [Schema.Types.Mixed]
});

schema.loadClass(Track);
var db = new DB().getDbConn();
var Tracks = db.model('Track', schema);

module.exports = {
    Track: Track,
    Tracks: Tracks
};

/* {
    "track": {
        "name": "Different Pulses",
        "mbid": "c6cdcf62-e6e8-4d7b-abf9-68b9f1ad820f",
        "url": "https://www.last.fm/music/Asaf+Avidan/_/Different+Pulses",
        "duration": "266000",
        "streamable": {
            "#text": "0",
            "fulltrack": "0"
        },
        "listeners": "35634",
        "playcount": "230114",
        "artist": {
            "name": "Asaf Avidan",
            "mbid": "5b9890b9-a2e8-4768-ad70-9f28bb81fc00",
            "url": "https://www.last.fm/music/Asaf+Avidan"
        },
        "album": {
            "artist": "Asaf Avidan",
            "title": "Different Pulses",
            "mbid": "1144d3aa-4f9c-4245-b43c-4750165d5e5e",
            "url": "https://www.last.fm/music/Asaf+Avidan/Different+Pulses",
            "image": [
                {
                    "#text": "https://lastfm-img2.akamaized.net/i/u/34s/d9c98cd7aaf0415ec115c4a6b42903ea.png",
                    "size": "small"
                }, {
                    "#text": "https://lastfm-img2.akamaized.net/i/u/64s/d9c98cd7aaf0415ec115c4a6b42903ea.png",
                    "size": "medium"
                }, {
                    "#text": "https://lastfm-img2.akamaized.net/i/u/174s/d9c98cd7aaf0415ec115c4a6b42903ea.png",
                    "size": "large"
                }, {
                    "#text": "https://lastfm-img2.akamaized.net/i/u/300x300/d9c98cd7aaf0415ec115c4a6b42903ea.p" +
                            "ng",
                    "size": "extralarge"
                }
            ],
            "@attr": {
                "position": "1"
            }
        },
        "toptags": {
            "tag": [
                {
                    "name": "melancholic",
                    "url": "https://www.last.fm/tag/melancholic"
                }, {
                    "name": "male vocal",
                    "url": "https://www.last.fm/tag/male+vocal"
                }, {
                    "name": "epic music",
                    "url": "https://www.last.fm/tag/epic+music"
                }, {
                    "name": "asaf avidan",
                    "url": "https://www.last.fm/tag/asaf+avidan"
                }, {
                    "name": "fip",
                    "url": "https://www.last.fm/tag/fip"
                }
            ]
        }
    }
}*/