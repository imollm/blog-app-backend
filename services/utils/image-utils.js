const fs = require('fs')

module.exports = {
  getFileName: (filePath) => {
    return filePath.split('/')[2]
  },

  getFileExtension: (fileName) => {
    return fileName.split('.')[1]
  },

  checkIfHaveValidImageExtension: (imageExtension) => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif']

    return imageExtensions.includes(imageExtension.toLowerCase())
  },

  deleteFilesByExtension(path, extensions) {
    if (extensions.length > 0) {
      extensions.forEach(extension => {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        let regex = new RegExp(`[.]${extension}+$`, 'is')
        fs.readdirSync(path)
          .filter(f => regex.test(f))
          .map(f => fs.unlinkSync(path + f))
      })
    }
  }
}