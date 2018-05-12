
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config/config.helper')
const UserService2 = require('../user/user.service')

// If needed, create (or recreate) the user token and updating the user entity in db
// returns the token
function getToken(userId){
    const UserService2 = require('../user/user.service')

    return new Promise( (resolve, reject) => {
        UserService2.get(userId).then(user => {
            if (!user.auth.jwtToken || user.auth.jwtToken === ""){
                createToken(user).then(token => {
                    if (token) {
                        UserService2.updateJwtToken(user._id.toString(), token).then(updatedToken => {
                            resolve(updatedToken)
                        })
                    }
                })
            } else { // if got token already 
                verifyExpiration(user.auth.jwtToken).then( decoded => {
                    if (decoded._id != user._id){ reject( { message: "Not same user id in token"} )}
                    resolve(user.auth.jwtToken)
                }).catch(error => {
                    reject(error)
                })
            }
        })
    })
}

function verifyExpiration(token) {
    return new Promise( (resolve, reject) => {
        jwt.verify(token, config.jwtSecret, (error, decoded) => {
            if (error) { reject(error) }
            resolve(decoded)
        })
    })
}

function verifyToken(token) {
    const UserService2 = require('../user/user.service')
    return new Promise( (resolve, reject) => {
        let decodedToken = decodeToken(token)

        if (decodedToken === undefined || decodedToken._id === undefined){
            reject({ message: "Token does not contain _id value"})
        }

        UserService2.get(decodedToken._id).then(user => {
            if (user.auth.jwtToken === token){
                resolve(true)
            } else {
                reject( { message : 'Token does not match to the token in db' } )
            }
        }).catch(error => reject(error))
    })
}

function decodeToken(token) {
    return jwt.decode(token)
}

function createToken(user, expiredTime){
    return new Promise( (resolve, reject) => {
        expiresIn = expiredTime || config.jwtDefaultExpiredTime;        
        let token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn })

        resolve(token)
    })
}

function login(user){
    const UserService2 = require('../user/user.service')

    return new Promise( (resolve, reject) => {
        if (user === undefined || 
            user.profile === undefined || 
            user.profile.username === undefined ||
            user.auth === undefined || 
            (user.auth.local && user.auth.local.password === undefined && user.auth.google === undefined)) {
                reject( { message: 'User not defined as required' } )
            }
        
        let loginType = ''

        if (user.auth.local.password !== undefined && user.auth.local.password !== '') {
            loginType = 'Local'
        } else if (user.auth.google != undefined) {
            loginType = 'Google'
        }

        const userId = user._id && user._id.toString()
        const userName = user.profile && user.profile.username
        const googleId = user.auth && user.auth.google && user.auth.google.googleId

        UserService2.get(userId, userName, googleId).then(userFromDB => {
            if (!userFromDB){
                reject({ message: "User not exist" })
            }
            if (userFromDB.profile.username !== user.profile.username){
                reject({ message: "Username from DB not match to given username" })
            }
            if(loginType === 'Local'){
                verifyLocalPassword(user.auth.local.password, userFromDB.auth.local.password).then( value => {
                    if (value !== true) { 
                        reject({ message: 'Cannot logged in. The given password is wrong'})
                    }

                    getToken(user._id).then(token => {
                        resolve(token);
                    })
                
                })
            }

            console.log("User logged in!!! " + userFromDB.profile.username);
            resolve(userFromDB)
        })
        
    })
}

function signup(user) {
    const UserService2 = require('../user/user.service')

    return new Promise( (resolve, reject) => {
        UserService2.create(user).then(userCreated => {
            console.log("New User Created!!! " + userCreated.profile.username)
             getToken(userCreated._id.toString()).then(token => {
                userCreated.auth.jwtToken = token
                console.log("New User Got Token!!! " + userCreated.auth.jwtToken)
                resolve(userCreated)
             }).catch(error => reject(error))
        }).catch(error => reject(error))
    })
}

function verifyLocalPassword(password, encryptedPassword) {
    return new Promise((resolve, reject) => {
        if (password == undefined || encryptedPassword == undefined) {
            reject ({ message: "Local password not set" })
        }

        bcrypt.compare(password, encryptedPassword).then( value => {
            resolve(value)
        }).catch(error => reject(error))
    })
    
}

module.exports = {
    getToken,
    verifyToken,
    signup,
    login
}
