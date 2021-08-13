'use strict'

const articleDAO = require('./dao')

module.exports = {

  getLastArticles: (limit) => {
    return articleDAO.getLastArticles(limit)
  },

  getAllArticles: () => {
    return articleDAO.getAllArticles()
  },

  createArticle: (article) => {
    return articleDAO.createArticle(article)
  },

  getArticleById: (articleId) => {
    return articleDAO.getArticleById(articleId)
  },

  updateArticleById: (article) => {
    return articleDAO.updateArticleById(article)
  },

  deleteArticleById: (articleId) => {
    return articleDAO.deleteArticleById(articleId)
  },

  uploadImageByArticleId: (articleId, filePath) => {
    return articleDAO.uploadImageByArticleId(articleId, filePath)
  },

  getImageByName: (imageName) => {
    return articleDAO.getImageByName(imageName)
  },

  searchArticle: (toSearch) => {
    return articleDAO.searchArticle(toSearch)
  }
}