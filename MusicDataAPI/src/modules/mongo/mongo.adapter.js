const mongoose = require('mongoose')
var config = require('../config/config.helper')

const DEFAULT_DB_URL = config.DEFAULT_DB_BASE_URL + config.DEFAULT_DB_NAME
const actualDbName = ( null ? (config.DEFAULT_DB_BASE_URL + arguments[0]) : DEFAULT_DB_URL )

const db = mongoose.createConnection(actualDbName)

db.once('open', () => {
    console.log("Open DB Connection successfully")
})

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db

/*

function createDBConnection(dbUrl) {
    return new Promise(resolve => {
        resolve(mongoose.createConnection(dbUrl))
    })
}

class DB {
    constructor(dbName) {
        const DEFAULT_DB_URL = config.DEFAULT_DB_BASE_URL + config.DEFAULT_DB_NAME
        let actualDbName = ( dbName ? (config.DEFAULT_DB_BASE_URL + dbName) : DEFAULT_DB_URL )
        this.connection = createDBConnection(actualDbName)
        this.connection.Promise = global.Promise
    }

    getConnection(){
        return this.connection
    }
}*/