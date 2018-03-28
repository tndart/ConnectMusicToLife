var mongoose = require('mongoose')
var config = require('../config/config.helper')


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
}

module.exports = DB;