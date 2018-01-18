'use strict';
const express = require('express');
const ArtistSrvice = require('./src/services/artist');
const mongo = require('./src/adapters/db');

const trackRouter = require('./src/routes/track');
const artistRouter = require('./src/routes/artist');
const tagRouter = require('./src/routes/tag');

const global = require('./src/global');

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


// App
const app = express();

// Global routes
app.get('/', (req, res) => {
    global.sendResponse(res, {"error": "There is no service at / , For more information go to /help"});
});

app.get('/help', (req, res) => {
    global.sendResponse(res, service_list);
});

artistRouter.use('/track/', trackRouter);
app.use('/artist', artistRouter)
app.use('/track', trackRouter);
app.use('/tag', tagRouter);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);