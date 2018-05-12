const http = require('http');

const API_KEY = '8964453062a973666d1dbc55e892fa64';

function getArtistTopTracks(mbid, name) {
    return new Promise((resolve, reject) => {
        const method = 'artist.gettoptracks';
        let TRACK_REQUEST;
    
        if (mbid) {
            TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&mbid=${mbid}&api_key=${API_KEY}&format=json&autocorrect=1`;
        } else if (name) {
            TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${name}&api_key=${API_KEY}&format=json&autocorrect=1`;
        } 
    
        if (TRACK_REQUEST) {
            get(TRACK_REQUEST.replace(/\s/g, '%20')).then(data => {
                resolve(data.toptracks.track)
            }).catch(reject)
        }

        
    })
   
}

function getArtistInfo(mbid, name) {
    const method = 'artist.getInfo';
    let ARTIST_REQUEST;

    if (mbid){
        ARTIST_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&mbid=${mbid}&api_key=${API_KEY}&format=json`
    } else if (name) {
        ARTIST_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${name}&api_key=${API_KEY}&format=json&autocorrect=1`
    }

    if (ARTIST_REQUEST) {
        return get(ARTIST_REQUEST.replace(/\s/g, '%20'))
    }

    return null;    
}

function getTrackInfo(mbid, artistName, trackName) {
    const method = 'track.getInfo';
    let TRACK_REQUEST;

    if (mbid) {
        TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&mbid=${mbid}&api_key=${API_KEY}&format=json`;
    } else if (artistName && trackName) {
        TRACK_REQUEST = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${artistName}&track=${trackName}&api_key=${API_KEY}&format=json&autocorrect=1`;
    }

    if (TRACK_REQUEST){
        return get(TRACK_REQUEST.replace(/\s/g, '%20'))
    }

    return null;
}

function get(fullUrl){
    console.info(`LastFmApi:: Sending Request ${fullUrl}`);
    
    return new Promise((resolve, reject) => {
        http.get(fullUrl, (res) => {
            var data = '';
    
            // A chunk of data has been recieved.
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received.
            res.on('end', () => {
                var result = JSON.parse(data);
                if(result.error === 6){
                    console.log("Error: " + JSON.stringify(result));
                }
                resolve(result);
            });
    
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
        });
    })
}



module.exports = {
    getArtistTopTracks,
    getArtistInfo,
    getTrackInfo,
}