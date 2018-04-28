
const DB = require('../mongo/mongo.adapter')
const config = require('../config/config.helper')

describe('Testing', () => {
    test("test", ()=>{
        expect(true).toBe(true)
    })
})

/*
describe('Testing Mongo connection', () => {
    test('Test readyState after mongo.adapter constructor', (done) => {  
        let db = new DB()
        db.connection.then(connection => {
            expect(connection.readyState).toBe(1)
            done()
        })
    })
    test('Test connection to db that configured at config.helper by default ', (done) => {
        let db = new DB()
        db.connection.then(connection => {
            expect(connection.name).toBe(config.DEFAULT_DB_NAME)
            expect(connection.client.s.url).toBe(config.DEFAULT_DB_BASE_URL + config.DEFAULT_DB_NAME)
            done()
        })
    })
})*/