'use strict';
const DB = require('../modules/mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class Artist {
    constructor(name, tags = [], albums = [], pic = '') {
        this.name = name;
        this.albums = albums;
        this.tags = tags;
        this.pic = pic;
    }

    addLastFmObject(jsonObject) {
        this.subObjects = {
            "LastFMObject": {
                ...jsonObject,
                "lastUpdated": Date.now()
            }
        }
    }

}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    name: String,
    albums: [Schema.Types.Mixed],
    tags: [Schema.Types.Mixed],
    pic: String,
    subObjects: Schema.Types.Mixed
});

schema.loadClass(Artist);
var Artists = DB.model('Artist', schema);

module.exports = {
    Artist: Artist,
    Artists: Artists
};
