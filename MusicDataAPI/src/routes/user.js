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

router.get('/:userid', (req, res) => {
    UserService2.get(req.params.userid).then(user => {
        global.sendResponse(res, user)
    }).catch(err => {
        global.sendResponse(res, err)
    })
})

router.post('/preferences', (req, res) => {
    if (req.body){
        UserService2.updatePreferences(req.body.payload).then(data => {
            global.sendResponse(res, data)
        }).catch(err => {
            global.sendResponse(res, err)
        })
    }    
});

router.post('/signup', (req, res) => {
    if (req.body){
        UserService.signup(req.body, (data, err) => {
            console.log("data: " + data);
        });
    }    
});


router.post('/oldlogin', (req, res) => {
    if (req.body){
        UserService.login(req.body, (data, err) => {
            if (err)
                global.sendResponse(res, err)
            else
                global.sendResponse(res, data)
        });
    }    
});

router.post('/login', (req, res) => {
    if (req.body){
        if (req.body.payload && req.body.payload.auth && req.body.payload.auth.google) {
            UserService2.loginOrSignupByGoogle(req.body.payload).then(data => {
                global.sendResponse(res, data);
            }).catch(err => {
                global.sendResponse(res, err);
            })
        }
        
    }
})

module.exports = router