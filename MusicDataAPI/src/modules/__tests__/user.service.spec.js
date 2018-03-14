const UserService = require('../user/user.service');
const DB = require('../mongo/mongo.adapter')

describe('Testing User.Service', () => {
    let userid = undefined
    const email = "email" + Math.random()

    test('Testing create function', (done) => {
        let user = {
            "profile": {
                "firstname": "firstname0",
                "lastname": "lastname0",
                "email": email,
                "birthdate": "30-05-1992",
                "gender": "Male",
                "country": "Israel"
            },
            "preferences": {
                "events": ["Driving"],
                "dayHours": []
            },
            "auth": {
                "local": {
                    "password": "$2a$04$huQY7t7MD2vargbAk35W4.O8DGJ2cp68dyEF2BlcgMwANQSOTpZMW"
                },
                "google": [{
                    "googleId": "",
                    "googleToken": ""
                }],
                "mode": "Local"
            }
        }

        UserService.create(user).then(userCreated => {
            expect(userCreated._id).not.toBe(undefined)
            userid = userCreated._id 
            done()
        })

    })

    test('Testing update JWT token', done => {
        let newToken = "blalblalala"

        if (userid){
            UserService.updateJwtToken(userid, newToken).then(val => {
                UserService.get(userid).then(user => {
                    expect(user.auth.jwtToken).toBe(newToken)
                    done()
                })
            })
        }
    })


    test('Testing isExist function by user id', done => {
        //let expected = (userid != undefined)
        let expected = ( userid != undefined )

        UserService.isExist(userid).then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    test('Negative testing isExist function by user id', done => {
        //let expected = (userid != undefined)
        let expected = false

        UserService.isExist("5aa7dedb9c07053378b66fe7").then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    test('Negative testing isExist function by email', done => {
        //let expected = (userid != undefined)
        let expected = false

        UserService.isExist(null, "email").then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    test('Testing isExist function', done => {
        //let expected = (userid != undefined)
        let expected = ( userid != undefined )

        UserService.isExist(userid).then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    test('Testing remove function', done => {
        if (userid){
            UserService.remove(userid).then(val => {
                expect(val).toBe(true)
                done()
            })
        }
    })

    
})
/*
async function generateUsers(array, amount) {
   
    for (let index = 0; index < amount; index++) {
        await generateUser(index)
    }
}

async function generateUser(index){
    await bcrypt.hash("password" + index, 1, async function(err, hashed_password) {
        var newUser = new UserModel.User(
            "firstname" + index, 
            "lastname" + index, 
            "email" + index, 
            "15-8-2017", 
            "Male",
            "Israel", 
            ["Driving"],
            hashed_password,
            "","")

        await UserModel.Users.create(newUser)
    })
}*/