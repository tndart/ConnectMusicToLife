const UserService = require('../user/user.service')
const TrackService = require('../track/track.service')
const UserPlaylistModel = require('./userPlaylist.model')

function getNext(userId, amount) {
    amount = (amount ? amount : 10)

    return new Promise((resolve, reject) => {
        getSmartPlaylist(userId)
            .then(sliceAndShuffleTheResult)
            .then(playlist => {
                if (playlist && playlist.length >= amount) {
                    return resolve(playlist)
                }

                UserService.getPreferencesByUserId(userId)
                    .then(preferences => TrackService.getTracksByPreferences(preferences, amount))
                    .then(sliceAndShuffleTheResult).then(data => {
                        return resolve(data)
                }).catch(reject)
            })
            .catch(reject)

    })
}

function getSmartPlaylist(userId) {
    return new Promise((resolve, reject) => {
        UserPlaylistModel.UserPlaylists.find({
            userid: userId
        })
            .then(data => {
                console.log(`PlaylistService::getSmartPlaylist => Data received from UserPlaylist schema for ${userId} is: ` + JSON.stringify(data))
                if (data && data.length > 0 && data[0] && data[0].generalPlaylist && data[0].generalPlaylist.length > 10) {
                    TrackService.getTracksByMbidList(data[0].generalPlaylist)
                        .then(tracks => {
                            console.log(`PlaylistService::getSmartPlaylist => Data received from DB with TrackService ` + JSON.stringify(data))
                            return resolve(tracks)
                        })
                } else {
                    resolve([])
                }
            })
            .catch(err => {
                console.error("Error on receiving data from UserPlaylist schema. Error is: " + JSON.stringify(err))
                return reject(err)
            })
    })
}

function sliceAndShuffleTheResult(list) {
    return new Promise((resolve, reject) => {
        const amount = list.length > 10 ? 10 : list.length
        let newList = [];

        if (list.length < 10) {
            return resolve(list);
        }

        for (let index = 0; index < amount; index++) {
            try {
                const key = Math.floor((Math.random() * list.length))
                const currItem = list[key]
                const newItem = {
                    songId: currItem.subObjects.LastFMJson.mbid,
                    name: `${currItem.artist[0]} - ${currItem.name}`,
                    youtubeId: currItem.subObjects.YoutubeJson[0].id.videoId
                }

                newList.push(newItem)
            } catch (error) {
                console.error("sliceAndShuffleTheResult", error);
            }
        }

        resolve(newList);
    })
}

module.exports = {
    getNext
}