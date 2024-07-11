const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)


mongoose.connect(config.MONGODB_URL)
    .then(result => {
        console.log("connected to ", config.MONGODB_URL)
    })
    .catch(error => {
        console.log(error)
    })

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use("/api/blogs", blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if(process.env.NODE_ENV === 'test'){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}
app.use(middleware.errorHandler)

module.exports = app