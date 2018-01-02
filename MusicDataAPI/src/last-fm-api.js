'use strict';

const http = require('http');

const API_KEY = "8964453062a973666d1dbc55e892fa64";

class LastFmApi {

    constructor() {
        this.isValidToken = false;
        this.token = undefined;
    }

    auth() {
        var promise = new Promise((resolve, reject) => {
            if (this.token !== undefined && this.isValidToken) {
                resolve(this.token);
            } else {

                http.get(`http://ws.audioscrobbler.com/2.0/?method=auth.gettoken&api_key=${API_KEY}&format=json`, (res) => {
                    let data = '';

                    // A chunk of data has been recieved.
                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received.
                    res.on('end', () => {
                        this.token = JSON
                            .parse(data)
                            .token;
                        this.isValidToken = true;
                        resolve(this.token);
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject(err);
                });

            }
        });
        return promise;
    }
}

module.exports = LastFmApi;