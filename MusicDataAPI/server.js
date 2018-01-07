'use strict';
const express = require('express');
const ArtistSrvice = require('./services/artist');
const mongo = require('./adapters/db');

const trackRouter = require('./routes/track');
const artistRouter = require('./routes/artist');
const tagRouter = require('./routes/tag');

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

// Functions .Depracted.
const sendResponse = (res, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 4));
    return res;
};

// App
const app = express();

// Global routes
app.get('/', (req, res) => {
    sendResponse(res, {"error": "There is no service at / , For more information go to /help"});
});

app.get('/help', (req, res) => {
    sendResponse(res, service_list);
});

artistRouter.use('/track/', trackRouter);
app.use('/artist', artistRouter)
app.use('/track', trackRouter);
app.use('/tag', tagRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);