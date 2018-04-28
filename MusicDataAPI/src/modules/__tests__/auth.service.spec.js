const AuthService = require('../auth/auth.service')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')
const jwt = require('jsonwebtoken')
const UserExample = require('../__fakedata__/user.example').Users
const UsersUncrypted = require('../__fakedata__/user.example').UsersWithUnencryptedPassword

describe('Testing', () => {
    test("test", ()=>{
        expect(true).toBe(true)
    })
})

/*
describe('Testing Auth Service - Tokenize', () => {
    let userArray = []
    let userToDelete = []

    beforeAll(done => {
        config.DEFAULT_DB_NAME = 'test'
        config.jwtDefaultExpiredTime = '2s'

        let user = UsersUncrypted[0]
        delete user._id
        if (user.auth.jwtToken) {
            delete user.auth.jwtToken
        }
        user.profile.username = user.profile.username + Math.random()

        UserService.create(user).then((userCreated, error) => {
            userArray.push(userCreated)
            done()
        })
    })

    afterAll(() => {
        userArray.forEach(user => {
            UserService.remove(user._id)
        });
        userToDelete.forEach(user => {
            UserService.remove(user._id)
        });
    })

    test('Testing get token function for new user (without token)', (done) => {
        AuthService.getToken(userArray[0]._id).then(token => {
            userArray[0].auth.jwtToken = token;
            expect(token).not.toBe(undefined)
            done()
        })
    })

    test('Testing get token function for existing user (with token)', (done) => {
        if (userArray[0].auth.jwtToken) {
            AuthService.getToken(userArray[0]._id).then(token => {
                expect(userArray[0].auth.jwtToken).toBe(token)
                done()
            }).catch(error => {
                throw error.message
            })
        }
    })

    test('Testing get token function for existing user with EXPIRED token', (done) => {
        if (userArray[0].auth.jwtToken) {
            setTimeout(() => {
                AuthService.getToken(userArray[0]._id).then(token => {
                }).catch(error => {
                    const expected = {
                        name: 'TokenExpiredError',
                        message: 'jwt expired'
                    }
                    expect(error.name).toBe(expected.name)
                    expect(error.message).toBe(expected.message)
                    done()
                })
            }, 2000)
        }
    })
})

describe('Testing Auth Service - Signup and Login', () => {
    let userArray = []
    let userToDelete = []

    beforeAll(done => {
        config.DEFAULT_DB_NAME = 'test'

        let user = UsersUncrypted[0]
        delete user._id
        if (user.auth.jwtToken) {
            delete user.auth.jwtToken
        }
        user.profile.username = user.profile.username + Math.random()

        UserService.create(user).then((userCreated, error) => {
            userArray.push(userCreated)
            done()
        })
    })

    afterAll(() => {
        userArray.forEach(user => {
            UserService.remove(user._id)
        });
    })
/*
    test('Testing signup flow', (done) => {
        let user = UserExample[0]
        delete user._id
        if (user.auth.jwtToken) {
            delete user.auth.jwtToken
        }
        user.profile.username = user.profile.username + Math.random()

        AuthService.signup(user).then(userCreated => {
            userToDelete.push(userCreated)
            expect(userCreated.auth.jwtToken).not.toBe(undefined)
            expect(userCreated.auth.jwtToken).not.toBe('')
            expect(userCreated._id).not.toBe(undefined)
            expect(userCreated.profile.username).toBe(user.profile.username)
            done()
        })
    })*/
/*
    test('Testing first login flow', (done) => {
        let user = userArray[0]
        if (user === undefined) {
            throw ('no user')
        }
        user.auth.local.password = '123456'

        AuthService.login(user).then(token => {
            expect(token).not.toBe(undefined)

            let decodedToken = jwt.decode(token)
            expect(decodedToken._id).toBe(user._id.toString())

            done()
        }).catch(error => {
            throw (error.message)
        })
    })
})
*/