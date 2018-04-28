const UserService = require('../user/user.service');
const UserModel = require('../user/user.model')
const DB = require('../mongo/mongo.adapter')
const FakeUsers = require('../__fakedata__/user.example').Users;

describe('Testing User.Service', () => {
    let userid = undefined
    const username = "username" + Math.random()

    test('Testing create function', (done) => {
        let user = {
            "profile": {
                "firstname": "firstname0",
                "lastname": "lastname0",
                "username": username,
                "birthdate": "08/05/1992",
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

        if (userid) {
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
        let expected = (userid != undefined)

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

    test('Negative testing isExist function by username', done => {
        //let expected = (userid != undefined)
        let expected = false

        UserService.isExist(null, "username").then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    test('Testing isExist function', done => {
        //let expected = (userid != undefined)
        let expected = (userid != undefined)

        UserService.isExist(userid).then(val => {
            expect(val).toBe(expected)
            done()
        })
    })

    /*test('Testing remove function', done => {
        if (userid) {
            UserService.remove(userid).then(val => {
                expect(val).toBe(true)
                done()
            })
        }
    })*/


})

describe('Testing UserService updatePreferences', () => {
    test('test', done => {
        let user = FakeUsers[0];
        delete(user._id);
        user.username = "testupdated@gmail.com"
        
        UserService.create(user).then(createdUser => {
            createdUser.preferences = {
                events: [
                    UserModel.preferenceEventsEnum.Working
                ],
                artists: [
                    {"_id":"5a635c9ff4af0a150cc8b75e","albums":[],"tags":[{"name":"rock","url":"https://www.last.fm/tag/rock"},{"name":"alternative","url":"https://www.last.fm/tag/alternative"},{"name":"britpop","url":"https://www.last.fm/tag/britpop"},{"name":"alternative rock","url":"https://www.last.fm/tag/alternative+rock"},{"name":"indie","url":"https://www.last.fm/tag/indie"}],"name":"Coldplay","pic":"https://lastfm-img2.akamaized.net/i/u/174s/df378e4cd71c45f2c51702b0a3290547.png","subObjects":{"LastFMObject":{"name":"Coldplay","mbid":"cc197bad-dc9c-440d-a5b5-d52ba2e14234","url":"https://www.last.fm/music/Coldplay","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/df378e4cd71c45f2c51702b0a3290547.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/df378e4cd71c45f2c51702b0a3290547.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/df378e4cd71c45f2c51702b0a3290547.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/df378e4cd71c45f2c51702b0a3290547.png","size":"extralarge"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/df378e4cd71c45f2c51702b0a3290547.png","size":"mega"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/df378e4cd71c45f2c51702b0a3290547.png","size":""}],"streamable":"0","ontour":"0","stats":{"listeners":"5238543","playcount":"347506711"},"similar":{"artist":[{"name":"OneRepublic","url":"https://www.last.fm/music/OneRepublic","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/b8fff56d41e23e5c75a7b25079938557.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/b8fff56d41e23e5c75a7b25079938557.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/b8fff56d41e23e5c75a7b25079938557.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/b8fff56d41e23e5c75a7b25079938557.png","size":"extralarge"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/b8fff56d41e23e5c75a7b25079938557.png","size":"mega"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/b8fff56d41e23e5c75a7b25079938557.png","size":""}]},{"name":"Keane","url":"https://www.last.fm/music/Keane","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/4eed298977c04dd1ad77e9c4d61e7a11.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/4eed298977c04dd1ad77e9c4d61e7a11.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/4eed298977c04dd1ad77e9c4d61e7a11.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/4eed298977c04dd1ad77e9c4d61e7a11.png","size":"extralarge"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/4eed298977c04dd1ad77e9c4d61e7a11.png","size":"mega"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/4eed298977c04dd1ad77e9c4d61e7a11.png","size":""}]},{"name":"Snow Patrol","url":"https://www.last.fm/music/Snow+Patrol","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/3c488e96d4e441afa743ca8975a62935.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/3c488e96d4e441afa743ca8975a62935.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/3c488e96d4e441afa743ca8975a62935.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/3c488e96d4e441afa743ca8975a62935.png","size":"extralarge"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/3c488e96d4e441afa743ca8975a62935.png","size":"mega"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/3c488e96d4e441afa743ca8975a62935.png","size":""}]},{"name":"Imagine Dragons","url":"https://www.last.fm/music/Imagine+Dragons","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":"extralarge"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":"mega"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/8fc8476bfd161bcc4a568f3639c9a2bb.png","size":""}]},{"name":"Muse","url":"https://www.last.fm/music/Muse","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/c02beb4a355a40faaadf834422bbacef.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/c02beb4a355a40faaadf834422bbacef.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/c02beb4a355a40faaadf834422bbacef.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/c02beb4a355a40faaadf834422bbacef.png","size":"extralarge"},
                    {"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/c02beb4a355a40faaadf834422bbacef.png","size":"mega"},
                    {"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/c02beb4a355a40faaadf834422bbacef.png","size":""}]}]},
                    "tags":{"tag":[{"name":"rock","url":"https://www.last.fm/tag/rock"},{"name":"alternative","url":"https://www.last.fm/tag/alternative"},{"name":"britpop","url":"https://www.last.fm/tag/britpop"},{"name":"alternative rock","url":"https://www.last.fm/tag/alternative+rock"},{"name":"indie","url":"https://www.last.fm/tag/indie"}]},"bio":{"links":{"link":{"#text":"","rel":"original","href":"https://last.fm/music/Coldplay/+wiki"}},
                    "published":"02 Feb 2006, 02:58","summary":"summary"},"lastUpdated":1516461215848}},"__v":0}
                ],
                genres:[
                    {"_id":"5a63173eb9424b391cb05605","name":"rock","songCounter":3918524,"popularity":-1,"createdAt":"2018-01-20T10:17:34.149Z","lastUpdated":"2018-01-20T10:17:34.149Z","subObjects":{"LastFMObject":{"name":"rock","count":3918524,"reach":391898,"lastUpdated":1516443454150}},"__v":0}
                ]
            }
            
            UserService.updatePreferences(createdUser).then(userUpdated =>{
                expect(userUpdated).not.toBe(undefined)
                expect(userUpdated).not.toBe(null)
                console.log("Got here")
                console.dir(userUpdated)
            })

        });

        done();
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
            "username" + index, 
            "15-8-2017", 
            "Male",
            "Israel", 
            ["Driving"],
            hashed_password,
            "","")

        await UserModel.Users.create(newUser)
    })
}*/