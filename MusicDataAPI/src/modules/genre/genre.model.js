'use strict';
const DB = require('../mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class Genre {
    constructor(name, songCounter = -1, popularity = -1) {
        this.name = name;
        this.songCounter = songCounter;
        this.popularity = popularity;
        this.createdAt = Date.now();
        this.lastUpdated = Date.now();
    }

    addLastFmObject(jsonObject) {
        jsonObject.lastUpdated = Date.now()
        this.subObjects = {   
            "LastFMObject": { jsonObject }
        }
    }
}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    name: String,
    songCounter: Number,
    popularity: Number,
    createdAt: Date,
    lastUpdated: Date,
    subObjects: Schema.Types.Mixed
});

schema.loadClass(Genre);
var Genres = DB.model('Genre', schema);

module.exports = {
    Genre: Genre,
    Genres: Genres
};
