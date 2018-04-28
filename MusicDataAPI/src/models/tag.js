'use strict';
const DB = require('../modules/mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class Tag {
    constructor(name, songCounter = -1, popularity = -1) {
        this.name = name;
        this.songCounter = songCounter;
        this.popularity = popularity;
        this.createdAt = Date.now();
        this.lastUpdated = Date.now();
    }

    addLastFmObject(jsonObject) {
        this.subObjects = {   
            "LastFMObject": {...jsonObject, "lastUpdated": Date.now()}
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

schema.loadClass(Tag);
var Tags = DB.model('Tag', schema);

module.exports = {
    Tag: Tag,
    Tags: Tags
};
