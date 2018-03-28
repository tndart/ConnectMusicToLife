'use strict';
const mongoose = require('mongoose');

const DB = require('../mongo/mongo.adapter');
const Schema = mongoose.Schema;

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
    constructor(firstname,
        lastname,
        email,
        birthdate, 
        gender = GenderEnum.Another, 
        country = CountryEnum.Israel, 
        preferenceEvents = [ preferenceEventsEnum.UNKNOWN ],
        password = undefined, 
        googleId = undefined, 
        googleToken = undefined) {

        try {
            var date = birthdate.split('-')
            date = new Date(date[0], date[1] - 1, date[2])
        } catch (error) {
            date = undefined
            console.log("User Ctor: Cant parse birthdate object " + birthdate);
        }   
       
        this.profile = {
            firstname,
            lastname,
            email,
            birthdate: date,
            gender,
            country,
        }

        this.preferences =  {
            events: preferenceEvents,
            dayHours: []
        }

        var mode = undefined

        if (password)
            mode = AuthModesEnum.Local
        else if (googleToken && googleId)
            mode = AuthModesEnum.Google

        this.auth = {
            mode: mode,
            local: {
                password
            },
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
        email: { type: String, lowercase: true, trim: true },
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
        dayHours: Array.of(Number)
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

function getUserModel(){
    return new Promise(resolve => {
        schema.loadClass(User)
        new DB().getConnection().then(db => {
            resolve(db.model('User', schema))
        })
    })
}

module.exports = {
    User,
    getUserModel,
    GenderEnum,
    CountryEnum,
    preferenceEventsEnum,
    AuthModesEnum
}

