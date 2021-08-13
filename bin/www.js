require('../config')

const app = require('../app')
const port = process.env.APP_PORT
const { version } = require('../package.json')

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/version', (req, res) => {
  res.send(version)
})

app.listen(port)
console.log('Server is running on port ' + port)
