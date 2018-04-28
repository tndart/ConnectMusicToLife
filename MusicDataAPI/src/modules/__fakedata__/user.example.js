
const Users = [
    {
        "_id": "5aa8157b5e98902310cf69cc",
        "profile": {
            "firstname": "liron",
            "lastname": "elbaz",
            "username": "lironelbaz@gmail.com",
            "gender": "Male",
            "country": "Israel",
            "birthdate": "10-10-1992"
        },
        "preferences": {
            "events": "Driving"
        },
        "auth": {
            "mode": "local",
            "local": {
                "password": "$2a$05$9eTHb0CzVVuI7fzBGwKBqe58rm2O7xAACOV/..6Ys8rgxKiWnzJ.u"
            }
        }
    } // password is 123456
]


const UsersWithUnencryptedPassword = [
    {
        "_id": "5aabf423eb4a532af0ea0cbe",
        "profile": {
            "firstname": "Uncypted",
            "lastname": "Password",
            "username": "UncyptedPassword@gmail.com",
            "gender": "Male",
            "country": "Israel",
            "birthdate": "10/10/1992"
        },
        "preferences": {
            "events": "Driving"
        },
        "auth": {
            "mode": "local",
            "local": {
                "password": "123456"
            }
        }
    }
]

module.exports = {
    Users,
    UsersWithUnencryptedPassword
}