
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const trackRouter = require('./routes/track')
const artistRouter = require('./routes/artist')
const tagRouter = require('./routes/tag')
const userRouter = require('./routes/user')
const helpRouter = require('./routes/help')
const playlistRouter = require('./modules/playlist/playlist.router')
const historyRouter = require('./modules/history/history.router')


const AuthMiddleware = require('./modules/auth/auth.middleware')

const global = require('./utils/extensions')

// Constants
const PORT = 8001
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