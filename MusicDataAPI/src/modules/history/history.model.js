'use strict';
const DB = require('../mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class HistoryEvent {
    constructor(category, name, metadata) {
        this.category = category;
        this.name = name;
        this.metadata = metadata
        this.createdAt = new Date();
    }
}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    category: String,
    name: String,
    metadata: Schema.Types.Mixed,
    createdAt: Date,
});

schema.loadClass(HistoryEvent);
const HistoryEvents = DB.model('HistoryEvent', schema);

module.exports = {
    HistoryEvent: HistoryEvent,
    HistoryEvents: HistoryEvents
};
