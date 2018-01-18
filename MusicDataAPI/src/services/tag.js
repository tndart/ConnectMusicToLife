'use strict';

const http = require('http')

const DB = require('../adapters/db')
const lastfm_api = require('../adapters/last-fm-api')
const TagModel = require('../models/tag')

const global = require('../global')

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

const saveLastFmTagToDbIfNeeded = (tag) => {
    checkIfExist(tag.name, (tagsCount) => {
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

const checkIfExist = (tagName, callback) => {
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

                    getTopTagsFromDb(taglist => {callback(tagList)});
                })
            }
        });
        
        
    }

    getTopArtists(tagName, callback) {
        this
            .api
            .getTagTopArtists(tagName, jsonData => {
                console.info("TagService:: The data returned from Last.FM API");
                callback(jsonData);
            });
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