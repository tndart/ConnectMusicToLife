const https = require('https')
const TrackModel = require('./track.model')
const ArtistService = require('../artist/artist.service');
const ObjectId = require('mongoose').Schema.Types.ObjectId
const ObjectID = require('mongoose').mongo.ObjectID
const LastFmAPI = require('../external-services/lastfm.service')


function getTracksByPreferences(preferences, amount) {
    return new Promise((resolve, reject) => {
        const artists = preferences.artists
        const genres = preferences.genres

        getTracksByArtists(artists, amount).then(tracksByArtists => {
            console.log(`Got ${tracksByArtists.length} from getTracksByArtists and if it's greater that 10 it'll returned`)
            if (tracksByArtists && tracksByArtists.length >= amount){
               return resolve(tracksByArtists)
            }

           /* getTracksByGenres(genres, amount - tracksByArtists.length).then(tracksByGenres => {
                const fullList = tracksByArtists.concat(tracksByGenres)
                const sortedFullList = fullList.sort((a,b) => {
                    return a.popularity && b.popularity && a.popularity > b.popularity
                })
                resolve(sortedFullList);
            })*/
        }).catch(reject)
    })
}

function getTracksByArtists(artists, amount){
    return new Promise((resolve,reject) => {
        if (!artists || artists.length <= 0) {
            resolve([])
        } 
        if (!amount || amount <= 0) {
            resolve([])
        } 

        ArtistService.getArtistsFromDB(artists)
        .then(getTracksByArtistsFromDB)
        .then(dbTracks => {
            console.log(`Got ${dbTracks.length} tracks from db`)
            if (dbTracks && dbTracks.length > amount){
                return resolve(dbTracks)
            }
            else {
                ArtistService.getArtistsFromDB(artists)
                .then(getTracksByArtistsFromLastFM)
                .then(attachListLastFMFulldetails)
                .then(buildTrackListFromLastFMData)
                .then(getYoutubeURLList)
                .then(upsertList)
                .then(resolve)
                .catch(reject)
            }
        })
    })
}

function buildTrackListFromLastFMData(tracksFromLastFM){
    return new Promise((resolve, reject) => {
        const newList = tracksFromLastFM.map(lastFMTrack => {
            let newTrack = new TrackModel.Track(lastFMTrack.name, lastFMTrack.artist.name)
            newTrack.addLastFmJson(lastFMTrack);
            return newTrack
        })

        resolve(newList)
    })
}

function getTracksByArtistsFromLastFM(artists) {
    return new Promise((resolve, reject) => {
        const artistsMbid = artists.map(artist => artist.subObjects.LastFMObject.mbid)
        let promises = [];
        let tracks = [];
        console.log("Trying to get TrackByArtistsFromLastFM");

        for (let index = 0; index < artistsMbid.length; index++) {
            const mbid = artistsMbid[index];
            promises.push(LastFmAPI.getArtistTopTracks(mbid))
            
        }
        
        Promise.all(promises).then(results => {

            for (let index = 0; index < results.length; index++) {
                const tracksOfArtist = results[index];
                tracks = tracks.concat(tracksOfArtist);
            }
            
            console.log(`Got ${tracks.length} tracks from TrackByArtistsFromLastFM`);
            resolve(tracks)
        }).catch(reject)
    })
}

function getTracksByArtistsFromDB(artists) {
    const artistsId = artists.map(item => item.name);

    return new Promise((resolve, reject) => {
        TrackModel.Tracks.find({
            'artist': {
                $in: [...artistsId]
            }
        }).then(data => {
            resolve(data)
        })
        .catch(err => {
            reject(err)
        })
    }) 
}

function getTracksByGenresFromDB(genres) {
    return TrackModel.Tracks.find({
        'genres': [{
            $in: [...artistsId]
        }]
    })
}

function upsertList(list) {
    return new Promise((resolve, reject) => {

        console.log(`Trying Upserting ${list.length} tracks`)
        
        const promiseList = list.map((item) => {
            if (item._id){
                return TrackModel.Tracks.findByIdAndUpdate(item._id, item , {upsert: true, new: true}) 
            } else {
                return TrackModel.Tracks.findOneAndUpdate({ name: item.name, artist: item.artist }, item, {upsert: true, new: true})
            }
        })

        let newList = [];
        Promise.all(promiseList).then(results => {
            for (let index = 0; index < results.length; index++) {
                newList = newList.concat(results[index])
            }
            console.log(`After Upsert, we got ${newList.length} tracks`)
            resolve(newList)
        }).catch(reject)
    })
}

function getYoutubeURL(name, artist) {
    return new Promise(( resolve ,reject ) => {
        const query = `${artist} - ${name}`
        const API_KEY = 'AIzaSyBsDq7MkffvHqm6zEOOiNiWNgrTShYq8CA';
        const url = `https://www.googleapis.com/youtube/v3/search?q=${query}&type=video&part=snippet&key=${API_KEY}`;
        console.log(`Asking for youtube for data on '${query}'`)

        https.get(url, (res) => {
           let data = '';
           res.on('data', (chunk) => {
             data += chunk;
           });
            res.on('end', () => {
              return resolve(JSON.parse(data));
           });
         }).on('error', (err) => {
            reject(err);
         });
       });
}

function attachYoutubeURL(name, artist, trackObj){
    return new Promise((resolve, reject) => {
        getYoutubeURL(name,artist).then(youtubeObj => {
            const trackList = youtubeObj.items;
            trackObj.addYoutubeJson(trackList);
            resolve(trackObj)
        }).catch(reject)
    })
}

function getYoutubeURLList(ListOfTracks) {
    return new Promise((resolve, reject) => {
        let returnedList = [];
        let promiseList = [];

        returnedList = ListOfTracks.filter(item => item && item.subObjects && item.subObjects.YoutubeJson);
        let listToGetYoutubeId = ListOfTracks.filter(item => item && ((!item.subObjects) || (!item.subObjects.YoutubeJson)) );

        for (let index = 0; index < listToGetYoutubeId.length; index++) {
            if (listToGetYoutubeId[index]){
                const name = listToGetYoutubeId[index].name;
                const artist = listToGetYoutubeId[index].artist;
                promiseList.push(attachYoutubeURL(name, artist, listToGetYoutubeId[index]))
            }
        }

        Promise.all(promiseList).then(elements => {
            for (let index2 = 0; index2 < elements.length; index2++) {
                const element = elements[index2];
                returnedList.push(element);
            }
            
            resolve(returnedList)
        })
    })
}

function attachListLastFMFulldetails(ListOfTracks){
    return new Promise((resolve, reject) => {
        let promiseList = [];
        let tracks = [];
        for (let index = 0; index < ListOfTracks.length; index++) {
            const element = ListOfTracks[index];
            const promiseElement = getLastFMFulldetails(element.mbid, element.artist.name, element.name);
            promiseList.push(promiseElement);
        }

        Promise.all(promiseList).then((results, errors) => {
            for (let index = 0; index < results.length; index++) {
                if (!results[index].error || results[index].error !== 6) {
                    tracks.push(results[index].track);            
                }
            }

            resolve(tracks)
        }).catch(err => {
            console.log(`Cannot attach full details ` + JSON.stringify(err))
        })
        
    })
}

function getLastFMFulldetails(mbid, artist, name){
    return LastFmAPI.getTrackInfo(mbid, artist, name)
}

module.exports = {
    getYoutubeURLList,
    getTracksByPreferences,
    upsertList,
}


/*
        if (artists && artists.length > 0) {
            const artistsId = artists.map(artist => artist.toString())
            TrackModel.Tracks.find({
                'artist._id': {
                    $in: [...artistsId]
                }
            }).then(tracksFromDB => {
                tracks = tracks.concat(tracksFromDB)

                if (tracks.length >= amount) {
                    resolve(tracks.slice(0, amount))
                } else {
                    ArtistService.getArtistsFromDB(artists).then(fullDetailedArtists => {
                        const artistsMbid = fullDetailedArtists.map(artist => artist.subObjects.LastFMObject.mbid)

                        let promises = [];

                        artistsMbid.forEach(mbid => {
                            promises.push(LastFmAPI.getArtistTopTracks(mbid))
                        });
                        
                        Promise.all(promises).then(results => {

                            for (let index = 0; index < results.length; index++) {
                                const tracksOfArtist = results[index];
                                tracks = tracks.concat(tracksOfArtist);
                            }
                            
                            resolve(tracks)
                        })
                    }).catch(err => {
                        console.error(err);
                    })
                }

                if (genres && genres.length > 0) {
                    TrackModel.Tracks.find({
                        'genres': [{
                            $in: [...artistsId]
                        }]
                    }).then(tracksFromDB2 => {
                        tracks = tracks.concat(tracksFromDB2)

                        if (tracks.length >= amount) {
                            resolve(tracks.slice(0, amount))
                        }
                    })
                }
            })*/