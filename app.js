const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const memeRouter = require('./controller/memes')
const candidateRouter = require('./controller/candidates')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


mongoose.set('useFindAndModify', false)

logger.info('connecting to', config.mongoUrl)



mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(express.static('build'))
app.use(express.json())

app.use(cors())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/memes', memeRouter)
app.use('/api/candidates', candidateRouter)




if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controller/testing')
    app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app