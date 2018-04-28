const bcrypt = require('bcrypt')
const ObjectID = require('mongodb').ObjectID;

var UserModel = require('./user.model')
var AuthService = require('../auth/auth.service')

function updatePreferences(user){
    return new Promise((resolve, reject) => {
        if ((!user) || (!user.preferences) || (!user._id)){
            reject({ message: "No user data sent"})
        }
        let promiseGenres = undefined;
        let promiseArtists = undefined;
        /**/
        if (user.preferences.genres) {
            promiseGenres = UserModel.getUserModel().findByIdAndUpdate(user._id, {
                $addToSet: { 
                    'preferences.genres': { $each: [...user.preferences.genres] },
                }
            }, { 
                multi: true 
            })
        }
        
        if (user.preferences.artists) {
            promiseArtists = UserModel.getUserModel().findByIdAndUpdate(user._id, {
                $addToSet: { 
                    'preferences.artists': { $each: [...user.preferences.artists] },                   
                }
            }, { 
                multi: true 
            })
        }

        Promise.all([promiseGenres, promiseArtists]).then(res => {
            let user = {};
            let userAlreadyCopied = false;

            array.forEach(element => {
                if (element.preferences.artists){
                    if (!userAlreadyCopied){
                        user = element;
                        userAlreadyCopied = true
                    } else {
                        user.preferences.artists = element.preferences.artists
                    }
                }
                if (element.preferences.genres){
                    if (!userAlreadyCopied){
                        user = element;
                        userAlreadyCopied = true
                    } else {
                        user.preferences.genres = element.preferences.genres
                    }
                }
            });

            resolve(user)
        }).catch(err => {
            reject(err)
        })
    })
}

// Returns true if the user exist in db
function isExist(userId, username, googleId) {

    return new Promise((resolve, reject) => {
        let query = undefined

        if (userId) {
            query = {
                _id: new ObjectID(userId)
            }
        } else if (username) {
            query = {
                'profile.username': username
            }
        } else if (googleId) {
            query = {
                'auth.google.googleId': googleId
            }
        } else {
            resolve(false)
        }

        UserModel.getUserModel().find(query).count().then((counter, err) => {
            if (err) {
                reject(err)
            } else if (counter > 0) {
                resolve(true)
            }
            resolve(false)
        })
    })
}

function loginOrSignupByGoogle(user) {
    return new Promise((resolve, reject) => {
        isExist(null, null, user.auth.google.googleId).then(exist => {
            if (exist) {
                AuthService.login(user).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            } else {
                AuthService.signup(user).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }
        })
    })
}

function create(user) {
    return new Promise((resolve, reject) => {
        isExist(null, user.profile.username).then((exist, error) => {
            if (exist) {
                resolve("already exist")
            }
            if (error) {
                reject(error)
            }

            UserModel.getUserModel().create(user).then(
                userCreated => resolve(userCreated),
                creationError => reject(creationError)
            )
        })
    })
}

function remove(_id, username) {
    return new Promise((resolve, reject) => {
        isExist(_id, username).then(exist => {
            if (!exist) {
                reject({
                    message: 'This user not exist'
                })
            }

            if (!_id) {
                _id = UserModel.getUserModel().then(model => {
                    model.find({
                        'profile.username': username
                    })
                })
            }

            UserModel.getUserModel().then(model => {
                model.findByIdAndRemove(_id)
                    .then(() => resolve(true))
                    .catch(error => reject(error))
            })
        })
    })
}

function get(userId, username, googleId) {
    return new Promise((resolve, reject) => {
        if (!userId && !username && !googleId){
            reject ({ source: "user.service.js: get", message: "Require one of the following params: userId, username or googleId"})
        }
    
        let promise = null;

        if (userId){
            promise = UserModel.getUserModel().findById(userId)
        }
        else {
            let query = null;
            if (username) {
                query = { 'profile.username': username }
            } else if (googleId) {
                query = { 'auth.google.googleId': googleId }
            }

            promise = UserModel.getUserModel().findOne(query)
        }

        if (promise){
            promise
                .populate('preferences.genres')
                .populate('preferences.artists')
                .then(user => {
                resolve(user)
            }).catch(error => {
                reject(error)
            })
        } else {
            reject ({ source: "user.service.js: get", message: "Unknown error occurred"})
        }

       
    })
}

function updateJwtToken(userId, token) {
    return new Promise((resolve, reject) => {
        UserModel.getUserModel().findByIdAndUpdate(userId, {
            $set: {
                'auth.jwtToken': token
            }
        }, {
            new: true
        })
            .then(userUpdated => {
                resolve(userUpdated.auth.jwtToken)
            })
            .catch(error => {
                reject(error)
            })
    })
}

module.exports = {
    isExist,
    create,
    remove,
    get,
    updateJwtToken,
    loginOrSignupByGoogle,
    updatePreferences,
}