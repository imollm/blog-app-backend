'use strict'

require('../../../config')
const articleDAO = require('../dao')
const MongoDB = require('../../../services/mongoDb')
const MongoSeeder = require('../../../services/utils/mongo-seeder')
const faker = require('faker')

let mongodb
let mongoSeeder

beforeAll(async () => {
  mongodb = new MongoDB()
  await mongodb.connect()
  mongoSeeder = new MongoSeeder(mongodb)
})

beforeEach(async () => await mongoSeeder.delete('articles'))

afterAll(async () => await mongodb.disconnect())

describe('Article service unit tests', () => {

  describe('Test getLastArticles()', () => {
    test('should get five articles', async () => {
      const expected = 5
      await mongoSeeder.populate('articles', expected)

      const result = await articleDAO.getLastArticles(expected)

      expect(result).toHaveLength(expected)
    })

    test('should get empty articles', async () => {
      const expected = 0
      const articleToGet = 1

      const result = await articleDAO.getLastArticles(articleToGet)

      expect(result).toHaveLength(expected)
    })
  })

  describe('Test getAllArticles()', () => {
    test('should get five articles', async() => {
      const expected = 5
      await mongoSeeder.populate('articles', expected)

      const result = await articleDAO.getAllArticles()

      expect(result).toHaveLength(expected)
    })

    test('should get empty articles', async () => {
      const expected = 0

      const result = await articleDAO.getAllArticles()

      expect(result).toHaveLength(expected)
    })
  })

  describe('Test createArticle()', () => {
    test('should create new article', async () => {
      const expected = {
        title: faker.name.title(),
        content: faker.lorem.text(),
        image: faker.system.filePath()
      }

      const result = await articleDAO.createArticle(expected)

      expect(result).toMatchObject(expected)
    })

    test('should not create new article, missing required attributes', async () => {
      const articles = [
        {
          title: '',
          content: faker.lorem.text(),
          image: faker.system.filePath()
        },
        {
          title: faker.name.title(),
          content: '',
          image: faker.system.filePath()
        }
      ]

      const expected = Error

      articles.map(async article => {
        await expect(articleDAO.createArticle(article)).rejects.toEqual(expect.any(expected))
      })
    })
  })

  describe('Test getArticleById()', () => {
    test('should get article previously inserted', async () => {
      const expected = await mongoSeeder.populateOne('articles')

      const result = await articleDAO.getArticleById(expected)

      expect(result._id.toString()).toEqual(expected)
    })

    test('shouldn\'t get article, because id do not exists', async () => {
      const articleIdDoNotExists = faker.datatype.uuid()

      await expect(articleDAO.getArticleById(articleIdDoNotExists)).rejects.toEqual(expect.any(Error))
    })
  })

  describe('Test updateArticleById()', () => {
    test('should update article successfully', async () => {
      const articleId = await mongoSeeder.populateOne('articles')

      const expected = {
        id: articleId,
        title: faker.name.title(),
        content: faker.lorem.text(),
        image: faker.system.filePath()
      }

      const result = await articleDAO.updateArticleById(expected)

      expect(result).toMatchObject(expected)
    })

    test('shouldn\'t update article, because id do not exists', async () => {
      const articleToUpdate = {
        id: faker.datatype.uuid(),
        title: faker.name.title(),
        content: faker.lorem.text(),
        image: faker.system.filePath()
      }

      await expect(articleDAO.updateArticleById(articleToUpdate)).rejects.toEqual(expect.any(Error))
    })
  })

  describe('Test deleteArticleById()', () => {
    test('should delete article successfully', async () => {
      const expected = await mongoSeeder.populateOne('articles')

      const result = await articleDAO.deleteArticleById(expected)

      expect(result._id.toString()).toEqual(expected)
    })

    test('shouldn\'t delete article, because id do not exists', async () => {
      const articleIdDoNotExists = faker.datatype.uuid()

      await expect(articleDAO.deleteArticleById(articleIdDoNotExists)).rejects.toEqual(expect.any(Error))
    })
  })
})
