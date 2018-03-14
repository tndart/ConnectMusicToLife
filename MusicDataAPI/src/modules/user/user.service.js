const bcrypt = require('bcrypt')
const ObjectID = require('mongodb').ObjectID;

const UserModel = require('./user.model')

// Returns true if the user exist in db
function isExist(userId, email){
    
    return new Promise( (resolve, reject) => {
        let query = undefined

        if (userId){
            query = { '_id': userId }
        } else if (email){
            query = { 'profile.email':  email }
        } else {
            resolve(false)
        }

        UserModel.getUserModel().then(model => {
            model.count(query).exec().then((counter, err) => {
                if (err) {
                    reject(err)
                } else if (counter > 0) {
                    resolve(true)
                }
                resolve(false)
            })
        })
    })    
}

function create(user){

    return new Promise( (resolve, reject) => {
        isExist(null, user.profile.email).then( (exist, error) => {
            if (exist) { resolve("already exist") }
            if (error) { reject(error) }
            
            bcrypt.genSalt(5).then(salt => {
                bcrypt.hash(user.auth.local.password, salt).then(hashed_password => {
                    var newUser = new UserModel.User(
                        user.profile.firstname, 
                        user.profile.lastname, 
                        user.profile.email, 
                        user.profile.birthdate, 
                        user.profile.gender,
                        user.profile.country, 
                        user.preferences.events, 
                        hashed_password)
                      
                    UserModel.getUserModel().then(model => {
                        model.create(newUser).then(
                        userCreated => resolve(userCreated),
                        createError => reject(createError)
                        )
                    })
                })
            })
        })
    })
}

function remove(_id, email) {
    return new Promise( (resolve, reject) => {
        isExist(_id, email).then(exist => {
            if (!exist) { reject({ message: 'This user not exist'}) }

            if (!_id){
                _id = UserModel.getUserModel().then(model => {
                    model.find({ 'profile.email' : email })
                })
            }

            UserModel.getUserModel().then(model => {
                model.findByIdAndRemove(_id)
                    .then(() => resolve(true))
                    .catch(error => reject(error))       
            }) 
        })
    })
}

function get(userId) {
    return new Promise( (resolve, reject) => {
        UserModel.getUserModel().then(model => {
            model.findById(userId)
                .then(user => resolve(user))
                .catch(error => reject(error))
        })
    })
}

function updateJwtToken(userId, token){
    return new Promise( (resolve, reject) => {
        UserModel.getUserModel().then(model => {
            model.findByIdAndUpdate(userId, { 'auth.jwtToken' : token })
                .then( userUpdated => { resolve ( userUpdated.auth.jwtToken ) } )
                .catch( error => { reject(error) } )
        })
    })
}

module.exports = {
    isExist, create, remove, get, updateJwtToken
}