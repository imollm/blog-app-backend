require('./config/index')
const MongoDB = require('./services/mongoDb')
const express = require('express')
const bodyParser = require('body-parser')

// CONNECT WITH MONGODB
const connect = async () => await new MongoDB().connect()
connect()

// CREATE EXPRESS SERVER
const app = express()

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

// CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// ROUTES
const routes = require('./routes/index')
app.use('/api/v1', routes)

module.exports = app
