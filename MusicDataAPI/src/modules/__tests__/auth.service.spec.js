
const AuthService = require('../auth/auth.service')
const UserService = require('../user/user.service')
const config = require('../config/config.helper')

describe('Testing Auth Service', () => {
    let userArray = []

    beforeAll(() => {
        config.DEFAULT_DB_NAME = 'test'
        /*UserService.create()*/
    })

    afterAll((done) => {

    })

    test('Test', (done) => {
        expect(1).toBe(1)
        done()
    })
})

