'use strict';

const http = require('http')
var bcrypt = require('bcrypt')

const DB = require('../adapters/db')
const UserModel = require('../modules/user/user.model')
const extensions = require('../utils/extensions')
const globals = require('../utils/globals')
const jwt = require('jsonwebtoken')


const dbConn = new DB().getDbConn();

function login(user, callback){
    if (user && user.data.username !== '' && user.auth.local.password !== ''){
        const username = user.data.username
        const password = user.auth.local.password

        UserModel
        .Users
        .find().where({
            'data.username': new RegExp('\\b^' + username + '$\\b', 'i')
        }).exec((err, results) => {
            if (err) {
                callback(null, err)
            } else if (results.length === 0) {
                const err = { err: { messege: "Username not found" } }
                callback (null, err)
            } else if ( results.length > 1) {
                const err = { err: { messege: `There is more than one username with '${username}' user name` } }
                callback (null, err)
            } else {

                bcrypt.compare(password, results[0]._doc.auth.local.password, (err, res) => {
                    if(res){
                        var retVal = results[0]._doc
                        delete retVal.auth.local.password
                        callback(results[0]._doc)
                    }
                    else
                        callback( { auth: { local: { isAuthorized: false } } } )
                    
                })
            }
        })
    }
    else {
        const err = { err: { messege: "Username or password not exists" } }
        callback (null, err); 
    }
}

function signup(user, callback) {

    UserModel
        .Users
        .count({
            'data.username': new RegExp('\\b^' + user.username + '$\\b', 'i')
        }, (err, counter) => {
            if (err) {
                callback(null, err)
            } else if (counter === 0) {
                bcrypt.hash(user.password, 1, function(err, hashed_password) {
                    var newUser = new UserModel.User(
                        user.firstname, 
                        user.lastname, 
                        user.username, 
                        user.birthdate, 
                        user.gender,
                        user.country, 
                        user.preferencesTiming, 
                        hashed_password,
                        tokenId);
                    UserModel.getUserModel().then(model => 
                        model.create(newUser, (err, res) => {
                            callback(res, err);
                        })
                    )
                })
            } else {
                callback(null, {
                    messege: "There is already user with the name " + user.username
                })
            }
        })
}

module.exports = {
    signup,
    login
}