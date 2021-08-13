'use strict'

const imageUtils = require('../image-utils')

describe('Image utils unit tests', () => {

  describe('Test getFileName function', () => {
    test('should get a wrong file name. The file is four levels deep', () => {
      const expected = 'fileName.png'
      const filePath = `./Some/path/in/filesystem/${expected}`

      const result = imageUtils.getFileName(filePath)

      expect(result).not.toEqual(expected)
    })

    test('should get correct file name. The file is two levels deep', () => {
      const expected = 'fileName.png'
      const filePath = `./Some/path/${expected}`

      const result = imageUtils.getFileName(filePath)

      expect(result).not.toEqual(expected)
    })
  })

  describe('Test getFileExtension function', () => {
    test('should get undefined file extension', () => {
      const fileName = 'fileName'

      const result = imageUtils.getFileExtension(fileName)

      expect(result).toBeUndefined()
    })

    test('should get file extension', () => {
      const expected = 'png'
      const fileName = `fileName.${expected}`

      const result = imageUtils.getFileExtension(fileName)

      expect(result).toEqual(expected)
    })
  })

  describe('Test checkIfHaveValidImageExtension function', () => {
    test('should get wrong match file extension',() => {
      const wrongExtension = 'pdf'

      const result = imageUtils.checkIfHaveValidImageExtension(wrongExtension)

      expect(result).toBeFalsy()
    })

    test('should get correct match file extension', () => {
      const correctExtensions = ['png', 'jpg', 'jpeg', 'gif']

      correctExtensions.forEach(extension => {
        let result = imageUtils.checkIfHaveValidImageExtension(extension)
        expect(result).toBeTruthy()
      })
    })
  })
})