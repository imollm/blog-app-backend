'use strict'

require('../../../config')
const MongoDB = require('../../mongoDb')
const MongoSeeder = require('../mongo-seeder')
const mongoose = require('mongoose')

describe('Test MongoDB Seeder', () => {

  let mongodb
  let mongoSeeder

  beforeAll(async () => {
    mongodb = new MongoDB()
    await mongodb.connect()
    mongoSeeder = new MongoSeeder(mongodb)
  })

  beforeEach(async () => {
    await mongoSeeder.delete('articles')
  })

  afterAll(async () => await mongodb.disconnect())

  test('should populate many objects', async () => {
    const expected = 2
    await mongoSeeder.populate('articles', expected)

    const result = await mongoose.connection.collection('articles').find({}).toArray()

    expect(result).toHaveLength(expected)
  })

  test('should populate one object', async () => {
    const expected = 1
    await mongoSeeder.populateOne('articles')

    const result = await mongoose.connection.collection('articles').find({}).toArray()

    expect(result).toHaveLength(expected)
  })

  test('should delete all objects', async () => {
    const expected = 0

    const result = await mongoose.connection.collection('articles').find({}).toArray()

    expect(result).toHaveLength(expected)
  })
})