'use strict'

require('../../config/index')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: new Date()
  },
  image: {
    type: String
  }
})

module.exports = mongoose.model('Article', ArticleSchema)
