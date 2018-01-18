var mongoose = require('mongoose');

var instance = null;
const DB_NAME = 'mongodb://127.0.0.1/graduateDB';

class DB {

    constructor() {
        if (!instance) {
            instance = this;
            this.dbConnnection = mongoose.createConnection(DB_NAME);
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