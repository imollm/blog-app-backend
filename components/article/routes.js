'use strict'

const express = require('express')
const controller = require('./controller')
const router = express.Router()
const multipart = require('connect-multiparty')
const mdUpload = multipart({ uploadDir: './upload/articles' })

router.get('/test', controller.test)
router.post('/save', controller.save)
router.get('/get/:id', controller.get)
router.get('/all', controller.all)
router.get('/last/:limit', controller.last)
router.put('/update', controller.update)
router.delete('/delete/:id', controller.delete)
router.post('/upload-image/:id', mdUpload, controller.upload)
router.get('/get-image/:imageName', controller.getImage)
router.get('/search/:search', controller.search)

module.exports = router