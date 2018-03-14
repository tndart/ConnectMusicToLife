const express = require('express')
const global = require('../utils/extensions')
const UserService = require('../services/user')
const UserService2 = require('../modules/user/user.service')
const router = express.Router()

router.get('/exist/:userid', (req, res) => {
    UserService2.isExist(req.params.userid).then(exist => {
        res.send("this user exist? " + (exist? "true" : "false"))
    })
})

router.post('/signup', (req, res) => {
    if (req.body){
        UserService.signup(req.body, (data, err) => {
            console.log("data: " + data);
        });
    }    
});


router.post('/login', (req, res) => {
    if (req.body){
        UserService.login(req.body, (data, err) => {
            if (err)
                global.sendResponse(res, err)
            else
                global.sendResponse(res, data)
        });
    }    
});

module.exports = router