'use strict'

const MongoDB = require('../index')

describe('MongoDB class tests', () => {
  test('should instance a MongoDB object', () => {
    const expected = 'object'

    const result = new MongoDB()

    expect(typeof result).toBe(expected)
  })
})