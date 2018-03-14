const jwt = require('jsonwebtoken')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')

// If needed, create (or recreate) the user token and updating the user entity in db
// returns the token
function getToken(userId){
    return new Promise( (resolve, reject) => {
        UserService.get(userId).then(user => {
            if (user.auth.jwtToken && user.auth.jwtToken === ""){
                createToken(user).then(token => {
                    if (token) {
                        UserService.updateJwtToken(user._id, token).then(updatedToken => {
                            resolve(updatedToken)
                        })
                    }
                })
            }
        })
    })
}

function verifyToken(user, token) {
    return new Promise( (resolve, reject) => {
        if (user && user.auth && user.auth.jwtToken === token){
            resolve(true)
        } else {
            resolve(false)
        }
    })
}

function decodeToken(token) {
    return jwt.decode(token)
    
    /*jwt.verify(token, config.jwtSecret, (error, decoded) => {
        if (error) { reject(error) }
        resolve(decoded)
    })*/
}


function createToken(user){
    return new Promise( (resolve, reject) => {
        let date = new Date()
        date.setDate(date.getDate() + (3 * 60 * 1000))

        let token = jwt.sign({ _id: user._id }, config.jwtSecret, {
            expiresIn: date
        })

        resolve(token)
    })
}


module.exports = {
    getToken
}