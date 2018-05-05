const UserService = require('../user/user.service')
const TrackService = require('../track/track.service')

function getNext(userId, amount) {
    amount = (amount ? amount: 10)
    
    return new Promise((resolve, reject) => {
        UserService.getPreferencesByUserId(userId)
        .then(preferences => TrackService.getTracksByPreferences(preferences, amount))
        .then(sliceAndShuffleTheResult).then(data => {
            resolve(data)
        })
    })

    // get preferences(user) => user.preferences
    // if got, 
        // trying to get tracks => list<track> 
    // else 
        // getting top hits => list<track> 
    // get youtubeURLS (list<track>) => list<track>
    // returned list<trackss>
}

function sliceAndShuffleTheResult(list) {
    return new Promise((resolve, reject) => {
        const amount = list.length > 10 ? 10 : list.length
        let newList = [];
        
        for (let index = 0; index < amount; index++) {
            try {
                const key = Math.floor((Math.random() * list.length))
                const currItem = list[key]
                const newItem = {
                    name: `${currItem.artist[0]} - ${currItem.name}`,
                    youtubeId: currItem.subObjects[1].YoutubeJson[0].id.videoId
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