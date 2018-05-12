const express = require('express')
const global = require('../../utils/extensions')
const router = express.Router()

const HistoryService = require('./hisotry.service')

router.post('/saveEvent', (req, res) => {
    
    HistoryService.saveEvent(req.body.payload);
    global.sendResponse(res, { status: "success" });
});

module.exports = router 