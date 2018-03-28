const AuthService = require('./auth.service')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')

var num = 0

module.exports = function(options) {
    return function(req, res, next) {
        // let authorizationCode = req.headers.authorization.substring("Bearer ".length)
        let authorizationCookie = req.cookies[config.AuthorizationCookieName]

        if (authorizationCookie !== undefined) {
            let authToken = authorizationCookie.jwtToken
            AuthService.verifyToken(authToken).then(value => {
                if (value === true){
                    
                }
            })
          
            let randomNumber = Math.random().toString()
          randomNumber = randomNumber.substring(2,randomNumber.length)
          num++
          res.cookie(config.AuthorizationCookieName, "liron" + num, { maxAge: 10000, httpOnly: true })
          console.log('----cookie created successfully')
        } 
        else
        {

          // yes, cookie was already present 
          //console.log('cookie exists ' + num, cookie)
        } 

        next()
    }
  }

function verifyCookie(req){
    let cookie = req.cookies.cookieName
    if (cookie === undefined){
        AuthService.verifyToken()
    }

}