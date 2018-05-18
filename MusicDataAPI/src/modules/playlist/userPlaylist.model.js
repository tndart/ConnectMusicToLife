'use strict';
const DB = require('../mongo/mongo.adapter');
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

class UserPlaylist {
    constructor(id, generalPlaylist, userid){
        this.Id = id;
        this.generalPlaylist = generalPlaylist;
        this.userid = userid;
    }
}

const schema = new Schema({
    Id: Schema.Types.ObjectId,
    generalPlaylist: Schema.Types.Mixed,
    userid: String,
});

schema.loadClass(UserPlaylist);
const UserPlaylists = DB.model('UserPlaylist', schema, 'users_playlist');

module.exports = {
    UserPlaylist: UserPlaylist,
    UserPlaylists: UserPlaylists
};
