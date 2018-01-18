'use strict';
const DB = require('../adapters/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class Tag {
    constructor(name, songCounter = -1, popularity = -1) {
        this.name = name;
        this.songCounter = songCounter;
        this.popularity = popularity;
        this.createdAt = Date.now();
        this.lastUpdated = Date.now();
    }

    addLastFmObject(jsonObject) {
        this.subObjects = [{   
            "LastFMObject": jsonObject,
            "lastUpdated": Date.now()
        }]
    }
}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    name: String,
    songCounter: Number,
    popularity: Number,
    createdAt: Date,
    lastUpdated: Date,
    subObjects: [Schema.Types.Mixed]
});

schema.loadClass(Tag);
var db = new DB().getDbConn();
var Tags = db.model('Tag', schema);

module.exports = {
    Tag: Tag,
    Tags: Tags
};
