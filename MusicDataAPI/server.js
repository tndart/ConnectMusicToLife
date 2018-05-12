
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const trackRouter = require('./src/routes/track')
const artistRouter = require('./src/routes/artist')
const tagRouter = require('./src/routes/tag')
const userRouter = require('./src/routes/user')
const helpRouter = require('./src/routes/help')
const playlistRouter = require('./src/modules/playlist/playlist.router')
const historyRouter = require('./src/modules/history/history.router')


const AuthMiddleware = require('./src/modules/auth/auth.middleware')

const global = require('./src/utils/extensions')

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

// App
const app = express()
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json());
app.options('*', cors())
app.use(AuthMiddleware({ cookieParser }))

// Global routes
app.get('/', (req, res) => {
    console.log("request: --> " + req.cookies['ConnectFM|Auth'])
    global.sendResponse(res, {"error": "There is no service at / , For more information go to /help"})
});

artistRouter.use('/track/', trackRouter)
app.use('/artist', artistRouter)
app.use('/track', trackRouter)
app.use('/tag', tagRouter)
app.use('/user', userRouter)
app.use('/playlist', playlistRouter)
app.use('/help', helpRouter)
app.use('/history', historyRouter)


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)