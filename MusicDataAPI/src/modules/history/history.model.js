'use strict';
const DB = require('../mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class HistoryEvent {
    constructor(category, name, metadata) {
        this.category = category;
        this.name = name;
        //this.metadata = metadata
        this.songName = metadata.songName
        this.songId = metadata.songId
        this.durationPrecentage = metadata.durationPrecentage
        this.userId = metadata.userId
        this.createdAt = new Date();
    }
}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    category: String,
    name: String,
    metadata: Schema.Types.Mixed,
    songName: String,
    songId: String,
    durationPrecentage: Number,
    userId: String,
    createdAt: Date,
});

schema.loadClass(HistoryEvent);
const HistoryEvents = DB.model('HistoryEvent', schema);

module.exports = {
    HistoryEvent: HistoryEvent,
    HistoryEvents: HistoryEvents
};
