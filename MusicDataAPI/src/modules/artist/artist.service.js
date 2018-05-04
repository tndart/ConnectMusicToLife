const ArtistModel = require('./artist.model')
const LastFmAPI = require('../external-services/lastfm.service')
const ObjectId = require('mongoose').Schema.Types.ObjectId

function getArtistFromDB(_id, mbid, name) {

    let promise;

    if (_id) {
        promise = ArtistModel.Artists.findById(_id)
    } else if (mbid) {
        promise = ArtistModel.Artists.find({
            'subObjects.LastFMObject.mbid': mbid
        })
    } else if (name) {
        promise = ArtistModel.Artists.find({
            'name': name
        })
    }

    return promise;
}

function getArtistFromLastFM(mbid, name) {
    return LastFmAPI.getArtistInfo(mbid, name)
}

function getArtist(_id, mbid, name) {
    return new Promise((resolve, reject) => {
        getArtistFromDB(_id, mbid, name).then(data => {
            if (data) {
                resolve(data)
            } else {
                getArtistFromLastFM(mbid, name).then(resolve).catch(reject)
            }
        })
    })
}

function getArtistsFromDB(_idList) {
    return new Promise((resolve, reject) => {
        ArtistModel.Artists.find({
            '_id': {
                $in: [..._idList]
            }
        }).then(resolve)
        .catch(reject)
    })
}

module.exports = {
    getArtist,
    getArtistsFromDB
}