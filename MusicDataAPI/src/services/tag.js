'use strict';

const http = require('http')

const DB = require('../adapters/db')
const lastfm_api = require('../adapters/last-fm-api')
const TagModel = require('../models/tag')
const ArtistModel = require('../models/artist')
const ArtistService = require('./artist');

const global = require('../utils/extensions')

const lastFmInstance = new lastfm_api();
const dbConn = new DB().getDbConn();

const getTopTagsFromDb = (callback) => {
         
    TagModel.Tags.find({},[],{skip: 0, limit: 50, sort: { popularity: -1, songCounter: -1 }}, (err, tagList) => {
        if (err) {
            callback (err);
        } else {
            console.info("TagService:: The topTags returned from DB with " + tagList.length + " sorted records");
            callback (tagList);
        }
    });
}

const getArtistsByTagFromDb = (tagName, callback) => {
    ArtistModel.Artists.find(
            { "tags": { "$elemMatch": { "name": new RegExp('\\b^' + tagName + '$\\b', 'i') } } }, 
            [], 
            {skip: 0, limit: 100, sort: { popularity: -1, "subObjects.LastFMObject.stats.playcount": -1}}, 
            (err, artistList) => {
        if (err) {
            callback(err)
        } else {
            callback(artistList)
        }
    })
}

const saveLastFmTagToDbIfNeeded = (tag) => {
    checkIfTagExist(tag.name, (tagsCount) => {
        console.info('not exist? ' + tagsCount);
        if(tagsCount === 0) {
            var newTag = new TagModel.Tag(tag.name, tag.count);
            newTag.addLastFmObject(tag);
            var tagModel = new TagModel.Tags(newTag);
            tagModel.save();
            console.info(`TagService:: The '${tag.name}' Tag from Last.FM API saved to DB`);
        }
    })
}

const saveLastFmArtistToDbIfNeeded = (artist) => {
    checkIfArtistExist(artist.name, (artistsCount) => {
        console.info(artist.name +  ' exist? ' + artistsCount);
        if(artistsCount === 0) {
            var newArtist = new ArtistModel.Artist(artist.name, artist.tags.tag, undefined, artist.image[2]["#text"]);
            newArtist.addLastFmObject(artist);
            var artistModel = new ArtistModel.Artists(newArtist);
            artistModel.save();
            console.info(`TagService:: The '${artist.name}' Artist from Last.FM API saved to DB`);
        }
    })
}


const checkIfArtistExist = (name, callback) => {
    if(name){
        ArtistModel.Artists.count({"name": new RegExp('\\b^' + name + '$\\b', 'i')}, (err, artistsCount) => {
            if (err) {
                callback(err);
            } else {
                callback(artistsCount);
            }
        });
    }
}

const checkIfTagExist = (tagName, callback) => {
    TagModel.Tags.count({"name": new RegExp('\\b^' + tagName + '$\\b', 'i')}, (err, tagsCount) => {
        if (err) {
            callback(err);
        } else {
            callback(tagsCount);
        }
    })
}



class TagService {
    constructor() { }

    getTopTags(callback) {

        getTopTagsFromDb((tagList) => {
            console.info('TagService:: tagList.length is ' + tagList.length)
            if (tagList.length > 20) {
                callback(tagList);
            } else {
                lastFmInstance.getTopTags(lastFmJson => {
                    console.info('TagService:: got data from api')

                    lastFmJson.toptags.tag.forEach(tag => {
                        saveLastFmTagToDbIfNeeded(tag);
                    })

                    getTopTagsFromDb(tagList => {callback(tagList)});
                })
            }
        });
        
        
    }

    getTopArtists(tagName, callback) {
        var index = 0;

        if(tagName){
            var artistService = new ArtistService();
            console.log(`Trying to get artists by ${tagName} tag from db`);
            getArtistsByTagFromDb(tagName, data => {
                if(data && data.length >= 50) {
                    console.log(`Got ${data.length} artists from db`)
                    callback(data);
                } else {
                    console.log(`There is no enough data in db, Try to get data from Last.FM API`)
                    lastFmInstance.getTagTopArtists(tagName, lastFmJson => {
                        console.info("TagService:: The data returned from Last.FM API");

                        if (lastFmJson.code === 'ENOTFOUND') {
                            callback(lastFmJson.message);
                        } else if (lastFmJson){
                            lastFmJson.topartists.artist.forEach(artist => {
                                index++
                                if (artist.mbid) {
                                    artistService.getArtistData(null, artist.mbid,  data => {
                                        console.log("Trying save data on " + artist.name)
                                        saveLastFmArtistToDbIfNeeded(data.artist);
                                    });
                                }

                                if (index == lastFmJson.topartists.artist.length){
                                    getArtistsByTagFromDb(tagName, artistList => {callback(artistList)});
                                }
                            })

                        }
                    });
                }
            })
        }
        else {
            callback(undefined);
        }
    }

    getTopTracks(tagName, callback) {
        this
            .api
            .getTagTopTracks(tagName, jsonData => {
                console.info("TagService:: The data returned from Last.FM API");
                callback(jsonData);
            });
    }

    getTopAlbums(tagName, callback) {
        this
            .api
            .getTagTopAlbums(tagName, jsonData => {
                console.info("TagService:: The data returned from Last.FM API");
                callback(jsonData);
            });
    }
}

module.exports = TagService;