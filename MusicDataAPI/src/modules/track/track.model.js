'use strict';
const DB = require('../mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class Track {
    constructor(name, artist) {
        this.name = name;
        this.artist = artist;
        this.subObjects = [];
    }

    addLastFmJson(LastFMJson){
        this.subObjects.push({LastFMJson})
    }

    addYoutubeJson(YoutubeJson){
        this.subObjects.push({YoutubeJson})
    }

}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    name: String,
    artist: [Schema.Types.Mixed],
    album: String,
    version: String,
    genre: [Schema.Types.Mixed],
    tags: [Schema.Types.Mixed],
    popularity: Schema.Types.Number,
    publishedYear: Schema.Types.Number,
    subObjects: Schema.Types.Mixed
});

schema.loadClass(Track);
const Tracks = DB.model('Track', schema);

module.exports = {
    Track: Track,
    Tracks: Tracks
};