const AuthService = require('../auth/auth.service')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')
const UserExample = require('../__fakedata__/user.example')

describe('Testing Auth Service - Tokenize', () => {
    let userArray = []

    beforeAll(done => {
        config.DEFAULT_DB_NAME = 'test'
        config.jwtDefaultExpiredTime = '2s'

        let user = UserExample[0]

        delete user._id
        if (user.auth.jwtToken) { delete user.auth.jwtToken }
        user.profile.email = user.profile.email + Math.random()

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

    test('Testing get token function for new user (without token)', (done) => {
        AuthService.getToken(userArray[0]._id).then(token => {
            userArray[0].auth.jwtToken = token;
            expect(token).not.toBe(undefined)
            done()
        })
    })

    test('Testing get token function for existing user (with token)', (done) => {
        if (userArray[0].auth.jwtToken){
            AuthService.getToken(userArray[0]._id).then( token => {
                expect(userArray[0].auth.jwtToken).toBe(token)
                done()
            }).catch(error => {
                throw error.message
            })
        }
    })

    test('Testing get token function for existing user with EXPIRED token', (done) => {
        if (userArray[0].auth.jwtToken){
            setTimeout( () => {
                AuthService.getToken(userArray[0]._id).then( token => {
                }).catch(error => {
                    const expected = { 
                        name: 'TokenExpiredError',
                        message : 'jwt expired' 
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

    beforeAll(() => {
        config.DEFAULT_DB_NAME = 'test'
    })

    afterAll(() => {
        userArray.forEach(user => {
            UserService.remove(user._id)
        });
    })

    test('Testing signup flow', (done) => {
        let user = UserExample[0]
        delete user._id
        if (user.auth.jwtToken) { delete user.auth.jwtToken }
        user.profile.email = user.profile.email + Math.random()

        AuthService.signup(user).then(userCreated => {
            userArray.push(userCreated._id)
            expect(userCreated.auth.jwtToken).not.toBe(undefined)
            expect(userCreated.auth.jwtToken).not.toBe('')
            expect(userCreated._id).not.toBe(undefined)
            expect(userCreated.profile.email).toBe(user.profile.email)
            done()
        })
    })

    test('Testing first login flow', (done) => {
        let userid = userArray[0]

        if (userid === undefined) { throw('no user') }

        UserService.get(userid).then(user => {            
            AuthService.login(user).then(value => {

                console.dir(user)
                if (value){

                }

                done()
            }).catch(error => { throw(error.message) })
        }).catch(error => { throw(error.message) })
    })
})
