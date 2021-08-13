'use strict'

const articleCollection = require('./mongoose')
const imageUtils = require('../../services/utils/image-utils')
const fs = require('fs')
const path = require('path')

const articleDAO = {

  getLastArticles: (limit) => {
    return articleCollection.find({}).limit(parseInt(limit)).sort('-_id')
  },

  getAllArticles: () => {
    return articleCollection.find({}).sort('-_id')
  },

  createArticle: (article) => {
    if (article['date'] === null || article['date'] ==='')
      delete article['date']

    return articleCollection.create(article)
  },

  getArticleById:  (articleId) => {
    return  articleCollection.findById(articleId)
  },

  updateArticleById: (article) => {
    return articleCollection.findOneAndUpdate({ _id: article.id }, article, { new: true })
  },

  deleteArticleById: (articleId) => {
    return articleCollection.findOneAndDelete({ _id: articleId })
  },

  uploadImageByArticleId: (articleId, filePath) => {
    const fileName = imageUtils.getFileName(filePath)
    const imageExtension = imageUtils.getFileExtension(fileName)

    if (!imageUtils.checkIfHaveValidImageExtension(imageExtension)) {
      fs.unlink(filePath, () => { })
      throw new Error('Unsupported Media Type')
    }

    return  articleCollection.findByIdAndUpdate(articleId, { image: fileName }, { new: true })
  },

  getImageByName: async (imageName) => {
    const pathFile = `./upload/articles/${imageName}`
    const statsFile = fs.statSync(pathFile)

    if (typeof statsFile === 'object')
      return path.resolve(pathFile)

    throw new Error('Image not found')
  },

  searchArticle: (toSearch) => {
    return articleCollection.find({ '$or': [
      { 'title': { '$regex': toSearch, '$options': 'i' } },
      { 'content': { '$regex': toSearch, '$options': 'i' } }
    ] })
      .sort([['date', 'descending']])
  }
}

module.exports = articleDAO
