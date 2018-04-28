'use strict';
const Mongoose = require('mongoose');
const DB = require('../mongo/mongo.adapter');
const Schema = Mongoose.Schema;

const GenderEnum = {
    Male: 'Male',
    Female: 'Female',
    Another: 'Another'
}

const CountryEnum = {
    Israel: 'Israel'
}

const preferenceEventsEnum = {
    Working: 'Working',
    Studying: 'Studying',
    Gaming: 'Gaming',
    Cooking: 'Cooking',
    At_Shower: 'At Shower',
    At_Party: 'At Party',
    Driving: 'Driving',
    UNKNOWN: 'UNKNOWN'
}

const AuthModesEnum = {
    Local: 'Local',
    Google: 'Google'
}

class User {
    constructor(username, firstname, lastname, googleId, googleToken) {       
        this.profile = {
            firstname,
            lastname,
            username
        }

        this.preferences = undefined;

        this.auth = {
            mode: "Google",
            google: {
                googleId,
                googleToken
            },
            jwtToken: undefined
        }
    }
}

const schema = new Schema({
    id: Schema.Types.ObjectId,
    profile: {
        firstname: String,
        lastname: String,
        username: { type: String, lowercase: true, trim: true },
        birthdate: Date,
        gender: {
            type: String,
            enum: [GenderEnum.Male, GenderEnum.Female, GenderEnum.Another]
        },
        country: {
            type: String,
            enum: [CountryEnum.Israel]
        }
    },
    preferences: {
        events: [
            {
                type: String,
                enum: [preferenceEventsEnum.At_Party,
                    preferenceEventsEnum.At_Shower,
                    preferenceEventsEnum.Cooking,
                    preferenceEventsEnum.Gaming,
                    preferenceEventsEnum.Studying,
                    preferenceEventsEnum.Working,
                    preferenceEventsEnum.Driving]
            }
        ],
        dayHours: Array.of(Number),
        artists: [{type: Schema.Types.ObjectId, ref: 'Artist'}],
        songs:  Array.of(String) || Array.of(Object),
        genres:  [{type: Schema.Types.ObjectId, ref: 'Tag'}]
        
    },
    auth: {
        mode: { 
            type: String,
            enum: [
                AuthModesEnum.Local,
                AuthModesEnum.Google
            ]
        },
        local: {
            password: String
        },
        google: [Schema.Types.Mixed],
        jwtToken: String
    }
});

schema.loadClass(User)
function getUserModel(){
    return DB.model('User', schema)
}

module.exports = {
    User,
    getUserModel,
    GenderEnum,
    CountryEnum,
    preferenceEventsEnum,
    AuthModesEnum
}

