'use strict';
const express = require('express');
const Tracks = require('./src/tracks');
const lastfmapi = require('./src/last-fm-api');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const service_list = {
    "service_list": [
        {
            "id": 1,
            "service_name": "Track Data",
            "type": "GET",
            "relative_url": "/tracks"
        }, {
            "id": 2,
            "service_name": "Album Data",
            "type": "GET",
            "relative_url": "/albums"
        }
    ]
};

// Functions
const sendResponse = (res, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 4));
    return res;
};

// App
const app = express();

app.get('/', (req, res) => {
    sendResponse(res, {"error": "There is no service at / , For more information go to /help"});
});

app.get('/help', (req, res) => {
    sendResponse(res, service_list);
});

app.get('/tracks', (req, res) => {
    var j = new Tracks();
    j
        .getTrackData("")
        .then(response => {
            console.log("response " + response);
            sendResponse(res, response);
        });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);