require('../config')
const app = require('../app')
const request = require('supertest')
const faker = require('faker')
const MongoDB = require('../services/mongoDb')
const MongoSeeder = require('../services/utils/mongo-seeder')
const imageUtils = require('../services/utils/image-utils')

describe('API Article Endpoints', () => {

  let mongodb
  let mongoSeeder

  beforeAll(async () => {
    mongodb = new MongoDB()
    await mongodb.connect()
    mongoSeeder = new MongoSeeder()
  })

  beforeEach(async () => {
    await mongoSeeder.delete('articles')
    await mongoSeeder.populate('articles', 5)
  })

  afterAll(async () => {
    imageUtils.deleteFilesByExtension(process.env.IMAGES_PATH, ['png', 'txt'])
    await mongodb.disconnect()
  })

  describe('GET /api/v1/article/test', () => {
    test('200 OK - A simple test endpoint', async () => {
      const response = await request(app).get('/api/v1/article/test')
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toMatchObject({ message: 'Test endpoint of article' })
    })
  })

  describe('GET /api/v1/article/last/:limit', () => {

    test('200 OK - Get last articles by limit successfully', async () => {
      const limit = 2
      const response = await request(app).get(`/api/v1/article/last/${limit}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          articles: expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              content: expect.any(String),
              image: expect.any(String),
              date: expect.any(String),
            })
          ])
        })
      )

      expect(response.body.articles).toHaveLength(limit)
    })

    test('400 Bad Request - No limit specified', async () => {
      const limit = undefined
      await request(app).get(`/api/v1/article/last/${limit}`).expect(400)
    })

    test('400 Bad Request - No int limit passed', async () => {
      const limit = 'c'
      await request(app).get(`/api/v1/article/last/${limit}`).expect(400)
    })

    test('404 Not Found - No articles are on system',async () => {
      await mongoSeeder.delete('articles')

      const limit = 2
      await request(app).get('/api/v1/article/last/' + limit)
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('GET /api/v1/article/all', () => {

    test('200 OK - Get all articles', async () => {

      const response = await request(app).get('/api/v1/article/all')
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.stringContaining('success'),
          articles: expect.arrayContaining([
            expect.objectContaining({
              title: expect.any(String),
              content: expect.any(String),
              image: expect.any(String),
              date: expect.any(String),
            })
          ]),
          message: expect.stringContaining('All articles on system')
        })
      )
    })

    test('404 Not Found - No articles are on system', async () => {
      await mongoSeeder.delete('articles')

      await request(app).get('/api/v1/article/all')
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('POST /api/v1/article/save', () => {

    test('201 Created - Create successfully an article', async () => {

      const articleToSave = {
        title: faker.name.title(),
        content: faker.lorem.text(),
        image: faker.system.filePath()
      }

      const response = await request(app).post('/api/v1/article/save')
        .send(articleToSave)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.stringContaining('success'),
          article: expect.objectContaining({
            title: expect.stringContaining(articleToSave.title),
            content: expect.stringContaining(articleToSave.content),
            date: expect.any(String),
            image: expect.stringContaining(articleToSave.image),
          }),
          message: expect.stringContaining('Article saved!')
        })
      )
    })

    test('422 Unprocessable Entity - Request with empty required fields', async () => {

      const objectToSave = { title: '', content: '', image: '' }

      return await request(app).post('/api/v1/article/save')
        .send(objectToSave)
        .expect(422)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('GET /api/v1/article/get/:id', () => {

    test('200 OK - Get article by id successfully', async () => {

      const articleId = await mongoSeeder.populateOne('articles')

      const response = await request(app)
        .get(`/api/v1/article/get/${articleId}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.stringContaining('success'),
          article: expect.objectContaining({
            _id: expect.stringContaining(articleId),
            title: expect.any(String),
            content: expect.any(String),
            date: expect.any(String),
            image: expect.any(String),
          }),
          message: expect.stringContaining(`Article with id ${articleId}`)
        })
      )
    })

    test('404 Not Found - Article does not exists with this id', async () => {

      const itemID = faker.datatype.uuid()

      await request(app).get(`/api/v1/article/get/${itemID}`)
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('PUT /api/v1/article/update', () => {

    test('200 OK - Update an article successfully', async () => {

      const objectID = await mongoSeeder.populateOne('articles')

      const objectToUpdate = {
        id: objectID,
        title: faker.name.title(),
        content: faker.lorem.text()
      }

      const response = await request(app).put('/api/v1/article/update')
        .send(objectToUpdate)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.stringContaining('success'),
          article: expect.objectContaining({
            _id: expect.stringContaining(objectToUpdate.id),
            title: expect.stringContaining(objectToUpdate.title),
            content: expect.stringContaining(objectToUpdate.content)
          }),
          message: expect.stringContaining('Article updated')
        })
      )
    })

    test('404 Not Found - Article with this id does not exists', async () => {

      const objectWithRandomId = {
        id: faker.datatype.uuid(),
        title: faker.name.title(),
        content: faker.lorem.text()
      }

      await request(app).put('/api/v1/article/update')
        .send(objectWithRandomId)
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })

    test('422 Unprocessable Entity - Required fields are invalid', async () => {

      const objectID = await mongoSeeder.populateOne('articles')

      const objectsWithOutRequiredAttributes = [
        {
          id: '',
          title: faker.name.title(),
          content: faker.lorem.text()
        },
        {
          id: objectID,
          title: '',
          content: faker.lorem.text()
        },
        {
          id: objectID,
          title: faker.name.title(),
          content: ''
        },
      ]

      for (let i = 0; i <= objectsWithOutRequiredAttributes.length; i++) {

        await request(app).put('/api/v1/article/update')
          .send(objectsWithOutRequiredAttributes[i])
          .expect(422)
          .expect('Content-Type', /text\/html/)

      }

    })
  })

  describe('DELETE /api/v1/article/delete/:id', () => {

    test('204 No Content - Success delete', async () => {

      const objectID = await mongoSeeder.populateOne('articles')

      return await request(app).delete(`/api/v1/article/delete/${objectID}`).expect(204)

    })

    test('404 Not Found - Article with this id does not exists', async () => {

      const objectID = faker.datatype.uuid()

      return await request(app)
        .delete(`/api/v1/article/delete/${objectID}`)
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('POST /api/v1/article/upload-image', () => {

    test('204 No Content - Successfully image upload', async () => {

      const articleId = await mongoSeeder.populateOne('articles')
      const testImagePath = './test/resources/test-image.png'

      return request(app)
        .post(`/api/v1/article/upload-image/${articleId}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file0', testImagePath)
        .expect(204)
    })

    test('400 Bad Request - No image attached on request', async () => {

      const articleId = await mongoSeeder.populateOne('articles')

      return request(app)
        .post(`/api/v1/article/upload-image/${articleId}`)
        .set('Content-Type', 'multipart/form-data')
        .expect(400)
    })

    test('500 Server Internal Error - No article id attached on uri', () => {

      const articleId = undefined

      return request(app)
        .post(`/api/v1/article/upload-image/${articleId}`)
        .set('Content-Type', 'multipart/form-data')
        .expect(400)
    })

    test('415 Unsupported Media Type - Send a invalid file extension', async () => {

      const articleId = await mongoSeeder.populateOne('articles')
      const testImagePath = './test/resources/test-text.txt'

      return request(app)
        .post(`/api/v1/article/upload-image/${articleId}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file0', testImagePath)
        .expect(415)
    })
  })

  describe('GET /api/v1/article/get-image/:imageName', () => {

    test('200 OK - Get image successfully', async () => {

      const imageToUpload = './test/resources/test-image.png'
      const articleId = await mongoSeeder.populateOne('articles')

      await request(app)
        .post(`/api/v1/article/upload-image/${articleId}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file0', imageToUpload)
        .expect(204)

      const response = await request(app)
        .get(`/api/v1/article/get/${articleId}`)
        .expect(200)
        .expect('Content-Type', /json/)

      return await request(app)
        .get(`/api/v1/article/get-image/${response.body.article.image}`)
        .expect(200)
        .expect('Content-Type', /image\/png/)
    })

    test('404 Not Found - Image with given name not found',  () => {

      const imageName = `${faker.datatype.uuid()}.png`

      return request(app)
        .get(`/api/v1/article/get-image/${imageName}`)
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })
  })

  describe('GET /api/v1/article/search', () => {

    test('200 OK - Return matching articles with search string', async () => {

      const toSearch = 'a'

      const response = await request(app)
        .get(`/api/v1/article/search/${toSearch}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toEqual(
        expect.objectContaining({
          status: expect.stringContaining('success'),
          articles: expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              content: expect.any(String),
              date: expect.any(String),
              image: expect.any(String),
            })
          ]),
          message: expect.stringContaining('All articles matching')
        })
      )
    })

    test('200 OK - Return empty result', async () => {

      const toSearch = faker.lorem.text

      const response = await request(app)
        .get(`/api/v1/article/search/${toSearch}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body.articles).toHaveLength(0)
    })

    test('404 Not Found - No valid url, no search string param send', () => {

      return request(app)
        .get('/api/v1/article/search/')
        .expect(404)
        .expect('Content-Type', /text\/html/)
    })

  })
})