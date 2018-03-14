
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const trackRouter = require('./src/routes/track');
const artistRouter = require('./src/routes/artist');
const tagRouter = require('./src/routes/tag');
const userRouter = require('./src/routes/user');
const helpRouter = require('./src/routes/help');
const playlistRouter = require('./src/routes/playlist')

const global = require('./src/utils/extensions');

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

// App
const app = express()
var jsonParser = bodyParser.json()
app.use(cors())
app.use(bodyParser.json());
app.options('*', cors())

// Global routes
app.get('/', (req, res) => {
    global.sendResponse(res, {"error": "There is no service at / , For more information go to /help"})
});

artistRouter.use('/track/', trackRouter)
app.use('/artist', artistRouter)
app.use('/track', trackRouter)
app.use('/tag', tagRouter)
app.use('/user', userRouter)
app.use('/playlist', playlistRouter)
app.use('/help', helpRouter)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)