const AuthService = require('./auth.service')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')

var num = 0

module.exports = function(options) {
    return function(req, res, next) {
        console.log("Request from : " + req.url + " Method: " + req.method)
        const authorizationCode = req.headers.authorization && req.headers.authorization.substring("Bearer ".length)
        console.log("authorizationCode is " + authorizationCode)

        if (req.url === '/user/login') {
            next()
        }
        else if (authorizationCode && authorizationCode != 'undefined' ) {
            AuthService.verifyToken(authorizationCode).then(isValid => {
                if (isValid){
                    res.cookie(config.AuthorizationCookieName, authorizationCode, { maxAge: 10000, httpOnly: true })
                    next()
                }
                else {
                    return global.sendResponse(res, {"error": "404 Unauthorized"})
                }
            })
        }
        else {
            console.warn("no authorizationCode for " + req.url)
            next()
        }
    }
  }

function verifyCookie(req){
    let cookie = req.cookies.cookieName
    if (cookie === undefined){
        AuthService.verifyToken()
    }

}

/*
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
} */