'use strict'

const articleModel = require('./model')
const httpError = require('http-errors')
const validator = require('validator')

const controller = {

  test: async (req, res) => {
    return res.json({
      status: 'success',
      message: 'Test endpoint of article'
    })
  },

  last: async (req, res, next) => {
    const limit = req.params.limit

    if (!validator.isInt(limit)) {
      return next(httpError(400, 'Bad Request'))
    }

    try {
      const lastArticles = await articleModel.getLastArticles(limit)

      return lastArticles.length <= 0 ?
        next(httpError(404, 'Not Found')) :
        res.json({
          status: 'success',
          articles: lastArticles,
          message: `Last ${limit} articles`
        })

    } catch (e) {
      return next(httpError(500, 'Internal Server Error'))
    }
  },

  all: async (req, res, next) => {
    try {
      const allArticles = await articleModel.getAllArticles()

      return allArticles.length <= 0 ?
        next(httpError(404, 'Not Found')) :
        res.json({
          status: 'success',
          articles: allArticles,
          message: 'All articles on system'
        })
    } catch (e) {
      return next(httpError(500, 'Internal Server Error'))
    }
  },

  save: async (req, res, next) => {
    const article = req.body

    if (validator.isEmpty(article.title) &&
            validator.isEmpty(article.content)) {
      return next(httpError(422, 'Unprocessable Entity'))
    }

    try {
      const result = await articleModel.createArticle(article)

      res.status(201).json({
        status: 'success',
        article: result,
        message: 'Article saved!'
      })
    } catch (e) {
      return next(httpError(500, 'Internal Server Error'))
    }
  },

  get: async (req, res, next) => {
    const articleId = req.params.id

    if (validator.isEmpty(articleId)) {
      return next(httpError(400, 'Bad Request'))
    }

    try {
      const result = await articleModel.getArticleById(articleId)

      return res.json({
        status: 'success',
        article: result,
        message: `Article with id ${articleId}`
      })
    } catch (e) {
      return next(httpError(404, 'Not found'))
    }
  },

  update: async (req, res, next) => {
    const article = req.body

    if (
      !article.id || !article.title || !article.content ||
            validator.isEmpty(article.id) ||
            validator.isEmpty(article.title) ||
            validator.isEmpty(article.content)
    ) {
      return next(httpError(422, 'Unprocessable Entity'))
    }

    try {
      const result = await articleModel.updateArticleById(article)

      return res.json({
        status: 'success',
        article: result,
        message: 'Article updated'
      })
    } catch (e) {
      return next(httpError(404, 'Not Found'))
    }
  },

  delete: async (req, res, next) => {
    const articleId = req.params.id

    try {
      await articleModel.deleteArticleById(articleId)

      return res.status(204).send()
    } catch (e) {
      return next(httpError(404, 'Not Found'))
    }
  },

  upload: async (req, res, next) => {
    const articleId = req.params.id
    let filePath

    if (!req.files || (!articleId && !validator.isEmpty(articleId))) {
      return next(httpError(400, 'Bad Request'))
    }

    filePath = req.files.file0.path

    try {
      await articleModel.uploadImageByArticleId(articleId, filePath)

      return res.status(204).send()
    } catch (e) {
      if (e.message === 'Unsupported Media Type')
        return next(httpError(415, e.message))

      return next(httpError(404, 'Not Found'))
    }
  },

  getImage: async (req, res, next) => {
    const imageName = req.params.imageName

    if (!imageName || validator.isEmpty(imageName)) {
      return next(httpError(400, 'Bad Request'))
    }

    try {
      const image = await articleModel.getImageByName(imageName)

      return res.status(200).sendFile(image)
    } catch (e) {
      return next(httpError(404, 'Not Found'))
    }
  },

  search: async (req, res, next) => {
    const toSearch = req.params.search

    try {
      const result = await articleModel.searchArticle(toSearch)

      return res.json({
        status: 'success',
        articles: result,
        message: 'All articles matching'
      })
    } catch (e) {
      return next(httpError(404, 'Not Found'))
    }
  }
}

module.exports = controller
