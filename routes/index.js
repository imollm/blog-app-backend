const express = require('express')
const articles = require('../components/article/routes')

const router = express.Router()

router.use('/article', articles)

module.exports = router