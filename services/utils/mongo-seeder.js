'use strict'

const faker = require('faker')
const mongoose = require('mongoose')

module.exports = class MongoSeeder {

  constructor() {
  }

  async populate(collectionName, howMany) {

    let collectionObjects = []
    for (let i = 0; i < howMany; i++) {
      collectionObjects.push({
        title: faker.name.title(),
        content: faker.lorem.text(),
        date: faker.datatype.datetime(),
        image: faker.system.filePath()
      })
    }
    await this.getCollectionByName(collectionName).insertMany(collectionObjects)
  }

  async delete(collectionName) {
    await this.getCollectionByName(collectionName).deleteMany({})
  }

  async populateOne(collectionName) {

    const object = {
      title: faker.name.title(),
      content: faker.lorem.text(),
      date: faker.datatype.datetime(),
      image: faker.system.filePath()
    }

    const result = await this.getCollectionByName(collectionName).insertOne(object)

    return result.insertedId.toString()
  }

  getCollectionByName(collectionName) {
    return mongoose.connection.collection(collectionName)
  }
}