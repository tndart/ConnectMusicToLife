var mongoose = require('mongoose');
var config = require('../modules/config/config.helper')

const DEFAULT_DB_URL = config.DEFAULT_DB_BASE_URL + config.DEFAULT_DB_NAME
const actualDbName = ( null ? (config.DEFAULT_DB_BASE_URL + arguments[0]) : DEFAULT_DB_URL )

var instance = null;

class DB {

    constructor() {
        if (!instance) {
            instance = this;
            this.dbConnnection = mongoose.createConnection(actualDbName);
            this
                .dbConnnection
                .on('error', console.error.bind(console, 'MongoDB connection error:'));
            this.dbConnnection.Promise = global.Promise;

        }
        /*this.createSchema();*/
    }

    getDbConn() {
        return instance.dbConnnection;
    }

    /* createSchema() {

        var Cat = this
            .dbConnnection
            .model('Cat', {name: String});

        var kitty = new Cat({name: 'Zildjian'});
        kitty.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('meow');
            }
        });
    }*/
}

module.exports = DB;