

const express = require('express')
const global = require('../utils/extensions')

const router = express.Router()

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

router.get('/', (req, res) => {
    global.sendResponse(res, service_list);
});

module.exports = router