'use strict'

require('../../config')
const mongoose = require('mongoose')

module.exports = class MongoDB {

  constructor() {
    this.client = undefined
    this.url = process.env.MONGODB_URI
    mongoose.set('useFindAndModify', false)
    mongoose.Promise = global.Promise
  }

  async connect() {
    try {
      this.client = await mongoose.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true })
      console.log('Database connection do it fine!!!')
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async disconnect() {
    try {
      if (this.client !== undefined)
        await this.client.disconnect()
      console.log('Database disconnect do it fine!!!')
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}