
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')

// If needed, create (or recreate) the user token and updating the user entity in db
// returns the token
function getToken(userId){
    return new Promise( (resolve, reject) => {
        UserService.get(userId).then(user => {
            if (!user.auth.jwtToken || user.auth.jwtToken === ""){
                createToken(user).then(token => {
                    if (token) {
                        UserService.updateJwtToken(user._id, token).then(updatedToken => {
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
    return new Promise( (resolve, reject) => {
        let decodedToken = decodeToken(token)

        if (decodedToken._id === undefined){
            reject({ message: "Token does not contain _id value"})
        }

        UserService.get(decodedToken._id).then(user => {
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
    return new Promise( (resolve, reject) => {
        if (user === undefined || 
            user.profile === undefined || 
            user.profile.email === undefined ||
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

        UserService.get(user._id).then(userFromDB => {
            if (!userFromDB){
                reject({ message: "User not exist" })
            }
            if (userFromDB.profile.email !== user.profile.email){
                reject({ message: "User email from DB not match to given user email" })
            }
            if(loginType === 'Local'){
                verifyLocalPassword(user.auth.local.password, userFromDB.auth.local.password).then( value => {
                    if (value !== true) { 
                        reject({ message: 'Cannot logged in. The given password is wrong'})
                    }

                    resolve(value)
                })
            }
        })
    })
}

function signup(user) {
    return new Promise( (resolve, reject) => {
        UserService.create(user).then(userCreated => {
             getToken(userCreated._id).then(token => {
                userCreated.auth.jwtToken = token
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